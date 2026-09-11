/* ==========================================================
   CropWise — auth.js
   Frontend-only mock authentication using localStorage.
   No real backend — for prototype/demo purposes only.
   ========================================================== */
(function(){
const CW = window.CW = window.CW || {};
const SESSION_KEY = 'cw_session';
const USERS_KEY = 'cw_users';

function readUsers(){
  try{ return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }catch(e){ return {}; }
}
function writeUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

CW.getSession = function(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY)); }catch(e){ return null; }
};
CW.saveSession = function(user){ localStorage.setItem(SESSION_KEY, JSON.stringify(user)); };
CW.logout = function(){ localStorage.removeItem(SESSION_KEY); window.location.href = 'login.html'; };

/* Protect authenticated pages — call at top of DOMContentLoaded */
CW.requireAuth = function(){
  if(!CW.getSession()){ window.location.href = 'login.html'; return false; }
  return true;
};

/* Redirect away from login/signup if already logged in */
CW.redirectIfAuthed = function(){
  if(CW.getSession()) window.location.href = 'dashboard.html';
};

CW.signup = async function({ name, mobile, password, crop, location }){
  const userPayload = {
    name, mobile, password, crop, location,
    quantity: 25, grade:'A', moisture:10,
    createdAt: new Date().toISOString()
  };

  // Check if Firebase SDK is active
  if (typeof firebase !== 'undefined' && window.db && window.auth) {
    try {
      const email = `${mobile}@cropwise.app`;
      // 1. Create User in Firebase Auth
      let authUser;
      try {
        const userCred = await window.auth.createUserWithEmailAndPassword(email, password);
        authUser = userCred.user;
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          return { ok: false, error: 'An account with this mobile number already exists.' };
        }
        // Fallback if email-already-in-use or other error
        console.warn("Firebase Auth error, attempting direct Firestore lookup:", authErr);
      }

      // 2. Save User Document in Firestore Database ('users' collection)
      const docId = authUser ? authUser.uid : mobile;
      await window.db.collection('users').doc(docId).set({
        ...userPayload,
        uid: docId
      }, { merge: true });

      userPayload.uid = docId;
    } catch(err) {
      console.error("Firebase Database save error:", err);
      // Fallback to local storage if network or config error occurs
    }
  }

  // Local sync & session save
  const users = readUsers();
  users[mobile] = userPayload;
  writeUsers(users);
  CW.saveSession(userPayload);
  return { ok: true, user: userPayload };
};

CW.login = async function(identifier, password){
  // Try Firebase Authentication & Firestore first
  if (typeof firebase !== 'undefined' && window.db && window.auth) {
    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@cropwise.app`;
      let userCred;
      try {
        userCred = await window.auth.signInWithEmailAndPassword(email, password);
      } catch(err) {
        console.warn("Firebase Auth sign-in failed, checking localStorage fallback:", err.message);
      }

      if (userCred && userCred.user) {
        const docRef = await window.db.collection('users').doc(userCred.user.uid).get();
        if (docRef.exists) {
          const userData = docRef.data();
          CW.saveSession(userData);
          return { ok: true, user: userData };
        }
      }
    } catch(err) {
      console.error("Firebase login error:", err);
    }
  }

  // Local storage fallback
  const users = readUsers();
  const key = Object.keys(users).find(k => k === identifier || users[k].mobile === identifier);
  if(!key) return { ok:false, error:'No account found with that mobile number or email.' };
  if(users[key].password !== password) return { ok:false, error:'Incorrect password. Please try again.' };
  CW.saveSession(users[key]);
  return { ok:true, user: users[key] };
};

CW.demoLogin = function(){
  const users = readUsers();
  users[CW.demoUser.mobile] = Object.assign({ password:'demo1234' }, CW.demoUser);
  writeUsers(users);
  CW.saveSession(users[CW.demoUser.mobile]);
  return users[CW.demoUser.mobile];
};

CW.updateProfile = async function(patch){
  const session = CW.getSession();
  if(!session) return;
  const updated = Object.assign({}, session, patch);
  CW.saveSession(updated);

  // Sync with Firestore Database if initialized
  if (typeof firebase !== 'undefined' && window.db) {
    try {
      const docId = session.uid || session.mobile;
      await window.db.collection('users').doc(docId).set(patch, { merge: true });
    } catch(err) {
      console.error("Failed to update profile in Firebase:", err);
    }
  }

  const users = readUsers();
  if(users[session.mobile]){
    users[session.mobile] = Object.assign(users[session.mobile], patch);
    writeUsers(users);
  }
  return updated;
};

/* Helper to save any form data or crop transactions to Firestore */
CW.saveToDatabase = async function(collectionName, data){
  const session = CW.getSession() || {};
  const record = {
    ...data,
    userId: session.uid || session.mobile || 'anonymous',
    createdAt: new Date().toISOString()
  };

  if (typeof firebase !== 'undefined' && window.db) {
    try {
      const docRef = await window.db.collection(collectionName).add(record);
      console.log(`Saved to Firebase [${collectionName}]:`, docRef.id);
      return { ok: true, id: docRef.id };
    } catch(err) {
      console.error(`Firebase error saving to ${collectionName}:`, err);
      return { ok: false, error: err.message };
    }
  }
  return { ok: true, id: 'local_' + Date.now() };
};

})();

