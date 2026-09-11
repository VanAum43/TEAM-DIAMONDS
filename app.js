/* ==========================================================
   CropWise — app.js
   App shell (sidebar/topbar/mobile drawer), icons, toasts, modals.
   ========================================================== */
(function(){
const CW = window.CW = window.CW || {};

/* ---------- ICONS (inline SVG, stroke-based) ---------- */
CW.icon = function(name){
  const I = {
    leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-6 5-11 11-11 2 6-2 12-7 12"/><path d="M4 13c3 1 6 3 7 7"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    bar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-7"/></svg>',
    shuffle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h4l7 12h4"/><path d="M17 4l3 2-3 2"/><path d="M3 18h4l3-5"/><path d="M13 8l1-2"/><path d="M17 20l3-2-3-2"/></svg>',
    seed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="5" ry="9"/><path d="M12 3v18"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="8" r="2.6"/><path d="M16 14.2c2.7.4 4.5 2.7 4.5 5.8"/></svg>',
    tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l8-8h7v7l-8 8-7-7z"/><circle cx="15" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="12" height="9"/><path d="M14 10h4l4 3v3h-8z"/><circle cx="6.5" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/></svg>',
    wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19"/><circle cx="17" cy="14.2" r="1.2" fill="currentColor" stroke="none"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.2 9a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 1.7-2.6 3.6"/><path d="M12 17.2h.01"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.5 2.4a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9c.8.7 1.7 1.2 2.6 1.5L10 22h4l.5-2.4c1-.3 1.8-.8 2.6-1.5l2.3.9 2-3.4z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.4-4.4"/></svg>',
    bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.1 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.9 5.6 21.4l1.5-7.1L1.7 9.4l7.2-.8z"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3.5v6c0 5-3.4 8.5-8 10.5-4.6-2-8-5.5-8-10.5v-6z"/><path d="M9 12l2 2 4-4.2"/></svg>',
    check_circle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>',
    warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5L2 20h20z"/><path d="M12 9.5v4.5"/><path d="M12 17.2h.01"/></svg>',
    x_circle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4l1.5 5-2 1.5a13 13 0 0 0 6 6l1.5-2 5 1.5v4a2 2 0 0 1-2.2 2A17 17 0 0 1 2 6.2 2 2 0 0 1 4 4z"/></svg>',
  };
  return I[name] || '';
};

/* ---------- NAV CONFIG ---------- */
CW.navItems = [
  { key:'dashboard', label:'Dashboard', href:'dashboard.html', icon:'home' },
  { key:'markets', label:'Market Intelligence', href:'markets.html', icon:'bar' },
  { key:'compare', label:'Compare Markets', href:'market-details.html', icon:'shuffle' },
  { key:'crop', label:'My Crops', href:'crop-analysis.html', icon:'seed' },
  { key:'buyers', label:'Buyers', href:'buyers.html', icon:'users' },
  { key:'sell', label:'Sell Crop', href:'sell-crop.html', icon:'tag' },
  { key:'logistics', label:'Logistics', href:'logistics.html', icon:'truck' },
  { key:'finance', label:'Finance', href:'finance.html', icon:'wallet' },
  { key:'transactions', label:'Transactions', href:'transactions.html', icon:'list' },
  { key:'profile', label:'Profile', href:'profile.html', icon:'user' },
];

function initials(name){
  return name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
}

/* ---------- MOUNT SHELL ---------- */
CW.mountShell = function(activeKey){
  const user = CW.getSession ? CW.getSession() : null;
  const name = user ? user.name : 'Guest Farmer';
  const loc = user && user.location ? user.location.label : 'Ahmedabad, Gujarat';

  const navHTML = CW.navItems.map(n=>`
    <a href="${n.href}" class="${n.key===activeKey?'active':''}">${CW.icon(n.icon)}<span>${n.label}</span></a>
  `).join('');

  const sidebar = `
    <aside class="sidebar">
      <div class="sidebar-logo">${CW.icon('leaf')}<span>CropWise</span></div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div class="sidebar-foot">
        <a href="#" id="helpLink">${CW.icon('help')}<span>Help &amp; Support</span></a>
        <a href="profile.html">${CW.icon('settings')}<span>Settings</span></a>
      </div>
    </aside>`;

  const topbar = `
    <header class="topbar">
      <div class="topbar-search">${CW.icon('search')}<input type="text" id="globalSearch" placeholder="Search markets, buyers, crops..."></div>
      <div class="topbar-loc">${CW.icon('pin')}<span>${loc}</span></div>
      <div class="topbar-right">
        <button class="icon-btn" id="notifBtn">${CW.icon('bell')}<span class="dot"></span></button>
        <div class="topbar-user">
          <div class="avatar">${initials(name)}</div>
        </div>
      </div>
    </header>`;

  const mobileHeader = `
    <div class="mobile-header">
      <button class="mobile-menu-btn" id="mobileMenuBtn">${CW.icon('menu')}</button>
      <div class="brand">CropWise</div>
      <button class="icon-btn" id="mobileNotifBtn" style="background:rgba(255,255,255,.12);border:none;color:#fff;">${CW.icon('bell')}</button>
    </div>
    <div class="mobile-drawer" id="mobileDrawer">
      <div class="backdrop" id="drawerBackdrop"></div>
      <div class="panel">
        <div class="sidebar-logo">${CW.icon('leaf')}<span>CropWise</span></div>
        <nav class="sidebar-nav">${navHTML}</nav>
        <div class="sidebar-foot">
          <a href="#" id="helpLinkMobile">${CW.icon('help')}<span>Help &amp; Support</span></a>
          <a href="profile.html">${CW.icon('settings')}<span>Settings</span></a>
          <a href="#" id="logoutMobile">${CW.icon('close')}<span>Log out</span></a>
        </div>
      </div>
    </div>`;

  const pageEl = document.getElementById('page-content');
  if(!pageEl) return;

  document.body.insertAdjacentHTML('afterbegin', mobileHeader);

  const shell = document.createElement('div');
  shell.className = 'app-shell';
  shell.innerHTML = sidebar;
  pageEl.parentNode.insertBefore(shell, pageEl);

  const mainCol = document.createElement('div');
  mainCol.className = 'main-col';
  mainCol.insertAdjacentHTML('beforeend', topbar);
  shell.appendChild(mainCol);
  mainCol.appendChild(pageEl);

  document.getElementById('toast-stack') || document.body.insertAdjacentHTML('beforeend','<div class="toast-stack" id="toast-stack"></div>');

  // mobile drawer behavior
  const drawer = document.getElementById('mobileDrawer');
  const openDrawer = ()=> drawer.classList.add('open');
  const closeDrawer = ()=> drawer.classList.remove('open');
  document.getElementById('mobileMenuBtn').addEventListener('click', openDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
  document.getElementById('logoutMobile').addEventListener('click', (e)=>{ e.preventDefault(); CW.logout(); });

  document.getElementById('helpLink').addEventListener('click', (e)=>{e.preventDefault(); CW.toast('Help Center — support@cropwise.app · 1800-000-2026','info');});
  document.getElementById('helpLinkMobile').addEventListener('click', (e)=>{e.preventDefault(); CW.toast('Help Center — support@cropwise.app · 1800-000-2026','info');});
  document.getElementById('notifBtn').addEventListener('click', ()=> CW.openNotifPanel());
  document.getElementById('mobileNotifBtn').addEventListener('click', ()=> CW.openNotifPanel());

  const gs = document.getElementById('globalSearch');
  if(gs) gs.addEventListener('keydown', e=>{
    if(e.key==='Enter' && gs.value.trim()){
      window.location.href = 'markets.html?q=' + encodeURIComponent(gs.value.trim());
    }
  });
};

/* ---------- NOTIFICATIONS PANEL (reuses modal) ---------- */
CW.openNotifPanel = function(){
  const rows = CW.notifications.map(n=>`
    <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">
      <div class="icon-btn" style="background:var(--light-green);color:var(--primary-green);flex-shrink:0;">${CW.icon(n.type==='success'?'check_circle':'bell')}</div>
      <div>
        <div style="font-weight:700;font-size:13.5px;">${n.title}</div>
        <div style="font-size:12.5px;color:var(--text-secondary);margin:2px 0;">${n.body}</div>
        <div style="font-size:11px;color:var(--text-tertiary);">${n.time}</div>
      </div>
    </div>`).join('');
  CW.showModal('Notifications', `<div>${rows}</div>`);
};

/* ---------- TOASTS ---------- */
CW.toast = function(message, type){
  type = type || 'info';
  let stack = document.getElementById('toast-stack');
  if(!stack){
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.id = 'toast-stack';
    document.body.appendChild(stack);
  }
  const iconMap = { success:'check_circle', error:'x_circle', warning:'warn', info:'bell' };
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = CW.icon(iconMap[type]) + '<span>'+message+'</span>';
  stack.appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .3s ease, transform .3s ease'; el.style.opacity='0'; el.style.transform='translateX(30px)'; setTimeout(()=>el.remove(),300); }, 3200);
};

/* ---------- GENERIC MODAL ---------- */
CW.showModal = function(title, bodyHTML, footHTML){
  let overlay = document.getElementById('cw-modal');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'cw-modal';
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-head"><h3 id="cw-modal-title"></h3><button class="modal-close" id="cw-modal-close">${CW.icon('close')}</button></div>
        <div class="modal-body" id="cw-modal-body"></div>
        <div class="modal-foot" id="cw-modal-foot"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e=>{ if(e.target===overlay) CW.closeModal(); });
    document.getElementById('cw-modal-close').addEventListener('click', CW.closeModal);
  }
  document.getElementById('cw-modal-title').textContent = title;
  document.getElementById('cw-modal-body').innerHTML = bodyHTML;
  document.getElementById('cw-modal-foot').innerHTML = footHTML || '';
  document.getElementById('cw-modal-foot').style.display = footHTML ? 'flex' : 'none';
  overlay.classList.add('open');
};
CW.closeModal = function(){
  const overlay = document.getElementById('cw-modal');
  if(overlay) overlay.classList.remove('open');
};

/* ---------- LOADING HELPER ---------- */
CW.simulateLoad = function(el, message, cb, ms){
  el.innerHTML = `<div class="loading-row"><span class="spinner"></span><span>${message}</span></div>`;
  setTimeout(cb, ms || 550);
};

})();
