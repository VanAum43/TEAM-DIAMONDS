/* ==========================================================
   CropWise — data.js
   Centralized mock data + shared business-logic utilities.
   All figures are DEMO DATA for prototype purposes only.
   ========================================================== */

const CW = window.CW = window.CW || {};

/* ---------- CROPS ---------- */
CW.crops = [
  { id:'wheat',     name:'Wheat',     unit:'quintal', basePrice:2380 },
  { id:'rice',      name:'Rice',      unit:'quintal', basePrice:2950 },
  { id:'maize',     name:'Maize',     unit:'quintal', basePrice:2020 },
  { id:'bajra',     name:'Bajra',     unit:'quintal', basePrice:2150 },
  { id:'mustard',   name:'Mustard',   unit:'quintal', basePrice:5450 },
  { id:'groundnut', name:'Groundnut', unit:'quintal', basePrice:5950 },
];

CW.gradeMultiplier = { A: 1.00, B: 0.92, C: 0.82 };

/* ---------- MARKETS (mandis) ---------- */
CW.markets = [
  { id:1, name:'APMC Ahmedabad',     city:'Ahmedabad', distance:6,   demand:'High',   arrivals:'High',   queue:'Medium', transportCost:250,  loadingCost:200, toll:0,   commission:'2.0%', waitingCost:180, moistureDeductionPct:1.5, rejectionRiskPct:1.0 },
  { id:2, name:'Unjha Mandi',        city:'Unjha',     distance:82,  demand:'High',   arrivals:'Medium', queue:'Low',    transportCost:1500, loadingCost:500, toll:250, commission:'1.5%', waitingCost:150, moistureDeductionPct:1.0, rejectionRiskPct:0.5 },
  { id:3, name:'Rajkot Krishi Bazar',city:'Rajkot',    distance:210, transportCost:4000, loadingCost:750, toll:400, commission:'2.2%', waitingCost:300, demand:'Medium', arrivals:'High',  queue:'High', moistureDeductionPct:2.0, rejectionRiskPct:1.8 },
  { id:4, name:'Mehsana Mandi',      city:'Mehsana',   distance:64,  transportCost:1150, loadingCost:400, toll:150, commission:'1.8%', waitingCost:120, demand:'Medium', arrivals:'Medium', queue:'Medium', moistureDeductionPct:1.2, rejectionRiskPct:0.8 },
  { id:5, name:'Deesa Mandi',        city:'Deesa',     distance:145, transportCost:2600, loadingCost:600, toll:300, commission:'2.0%', waitingCost:220, demand:'Low',    arrivals:'Low',  queue:'Low',  moistureDeductionPct:1.6, rejectionRiskPct:1.2 },
  { id:6, name:'Palanpur Mandi',     city:'Palanpur',  distance:130, transportCost:2350, loadingCost:550, toll:280, commission:'1.9%', waitingCost:200, demand:'Medium', arrivals:'Low',  queue:'Medium', moistureDeductionPct:1.4, rejectionRiskPct:1.0 },
];

/* Deterministic per-market price variance so every crop/market combo
   feels distinct without random flicker on reload. */
function priceSeed(marketId, cropId){
  let s = 0;
  const str = marketId + cropId;
  for(let i=0;i<str.length;i++) s += str.charCodeAt(i) * (i+3);
  return (s % 21) - 10; // -10..+10
}

CW.getMarketPrice = function(marketId, cropId, grade){
  const crop = CW.crops.find(c=>c.id===cropId) || CW.crops[0];
  const variancePct = priceSeed(marketId, cropId) / 100; // -0.10..+0.10
  const raw = crop.basePrice * (1 + variancePct);
  const graded = raw * (CW.gradeMultiplier[grade] || 1);
  return Math.round(graded / 5) * 5;
};

/* Core net-return calculator — the heart of CropWise.
   costs object: { transport, loading, toll, commission, waiting, moisture, rejection } */
CW.calcNetReturn = function({ quantity, price, transportCost, loadingCost, toll, commissionPct, waitingCost, moistureDeductionPct, rejectionRiskPct }){
  const gross = quantity * price;
  const commission = gross * (commissionPct/100);
  const moistureDeduction = gross * (moistureDeductionPct/100);
  const rejectionRisk = gross * (rejectionRiskPct/100);
  const totalDeductions = transportCost + loadingCost + toll + commission + waitingCost + moistureDeduction + rejectionRisk;
  const net = gross - totalDeductions;
  return {
    gross, commission, moistureDeduction, rejectionRisk, totalDeductions, net,
    perQuintal: net / quantity,
    breakdown:[
      { label:'Transport', value: transportCost },
      { label:'Loading', value: loadingCost },
      { label:'Toll', value: toll },
      { label:'Commission', value: Math.round(commission) },
      { label:'Waiting cost', value: waitingCost },
      { label:'Moisture deduction', value: Math.round(moistureDeduction) },
      { label:'Rejection risk (est.)', value: Math.round(rejectionRisk) },
    ]
  };
};

/* Build a fully-computed market opportunity for a given crop/quantity/grade */
CW.buildOpportunity = function(market, cropId, quantity, grade){
  const price = CW.getMarketPrice(market.id, cropId, grade);
  const commissionPct = parseFloat(market.commission);
  const calc = CW.calcNetReturn({
    quantity, price,
    transportCost: market.transportCost,
    loadingCost: market.loadingCost,
    toll: market.toll,
    commissionPct,
    waitingCost: market.waitingCost,
    moistureDeductionPct: market.moistureDeductionPct,
    rejectionRiskPct: market.rejectionRiskPct
  });
  return { market, price, ...calc };
};

CW.rankOpportunities = function(cropId, quantity, grade){
  return CW.markets
    .map(m => CW.buildOpportunity(m, cropId, quantity, grade))
    .sort((a,b)=> b.net - a.net);
};

/* ---------- BUYERS ---------- */
CW.buyers = [
  { id:1, name:'Satvik Agro Traders',        verified:true,  city:'Ahmedabad', crops:['wheat','bajra'],       priceIdx:1.02, qtyCapacity:150, rating:4.6, transactions:212, paySpeed:'Fast',   distance:8 },
  { id:2, name:'Greenfield Grain Co.',       verified:true,  city:'Unjha',     crops:['wheat','mustard'],     priceIdx:0.98, qtyCapacity:400, rating:4.3, transactions:340, paySpeed:'Medium', distance:80 },
  { id:3, name:'Patel Krishi Bhandar',       verified:true,  city:'Mehsana',   crops:['wheat','maize','rice'],priceIdx:1.00, qtyCapacity:220, rating:4.5, transactions:158, paySpeed:'Fast',   distance:62 },
  { id:4, name:'Anand Foodgrain Mills',      verified:false, city:'Rajkot',    crops:['groundnut','wheat'],   priceIdx:1.05, qtyCapacity:600, rating:3.9, transactions:74,  paySpeed:'Slow',   distance:205 },
  { id:5, name:'Om Sai Agro Exports',        verified:true,  city:'Deesa',     crops:['rice','mustard'],      priceIdx:0.96, qtyCapacity:300, rating:4.1, transactions:120, paySpeed:'Medium', distance:140 },
  { id:6, name:'Bhoomi Grain Collective',    verified:true,  city:'Palanpur',  crops:['bajra','maize','wheat'],priceIdx:1.01,qtyCapacity:180, rating:4.7, transactions:265, paySpeed:'Fast',   distance:128 },
];

/* ---------- TRANSACTIONS (sales history) ---------- */
CW.transactions = [
  { id:'TXN-10231', date:'2026-09-02', crop:'Wheat', quantity:25, market:'Unjha Mandi',   buyer:'Greenfield Grain Co.', price:2380, gross:59500, deductions:2750, net:56750, status:'Completed' },
  { id:'TXN-10198', date:'2026-08-24', crop:'Bajra', quantity:14, market:'APMC Ahmedabad',buyer:'Satvik Agro Traders',  price:2150, gross:30100, deductions:1120, net:28980, status:'Completed' },
  { id:'TXN-10176', date:'2026-08-12', crop:'Mustard',quantity:8, market:'Mehsana Mandi', buyer:'Patel Krishi Bhandar', price:5450, gross:43600, deductions:1950, net:41650, status:'Payment Pending' },
  { id:'TXN-10151', date:'2026-07-29', crop:'Maize',  quantity:20,market:'Palanpur Mandi', buyer:'Bhoomi Grain Collective', price:2020, gross:40400, deductions:2380, net:38020, status:'In Transit' },
  { id:'TXN-10122', date:'2026-07-14', crop:'Wheat',  quantity:30,market:'Deesa Mandi',    buyer:'Om Sai Agro Exports', price:2260, gross:67800, deductions:3450, net:64350, status:'Completed' },
  { id:'TXN-10098', date:'2026-06-30', crop:'Rice',   quantity:12,market:'Mehsana Mandi',  buyer:'Patel Krishi Bhandar', price:2950, gross:35400, deductions:1610, net:33790, status:'Pending' },
];

/* ---------- LOGISTICS VEHICLE OPTIONS ---------- */
CW.vehicles = [
  { id:'tractor', name:'Tractor Trolley', capacity:15, costPerKm:12, baseCost:200, availability:'Available now' },
  { id:'small',   name:'Small Truck (Tata Ace)', capacity:30, costPerKm:18, baseCost:350, availability:'Available in 2 hrs' },
  { id:'large',   name:'Large Truck (10-wheeler)', capacity:100, costPerKm:26, baseCost:600, availability:'Available tomorrow' },
];

/* ---------- NOTIFICATIONS ---------- */
CW.notifications = [
  { id:1, title:'Unjha Mandi price updated', body:'Wheat quoted price moved to ₹2,380/quintal.', time:'2h ago', type:'info' },
  { id:2, title:'Payment received', body:'₹56,750 credited for TXN-10231.', time:'1d ago', type:'success' },
  { id:3, title:'New buyer nearby', body:'Bhoomi Grain Collective is now buying Bajra near you.', time:'2d ago', type:'info' },
];

/* ---------- DEMO USER ---------- */
CW.demoUser = {
  name:'Rajesh Patel', mobile:'9825012345', crop:'wheat', quantity:25, grade:'A', moisture:10,
  location:{ label:'Ahmedabad, Gujarat', lat:23.0225, lng:72.5714 }
};

/* ---------- HELPERS ---------- */
CW.formatINR = function(n){
  return '₹' + Math.round(n).toLocaleString('en-IN');
};
CW.cropName = function(id){ const c = CW.crops.find(c=>c.id===id); return c ? c.name : id; };
