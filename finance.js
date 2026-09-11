(function(){
if(!CW.requireAuth()) return;
const user = CW.getSession();
CW.mountShell('finance');

const totalSales = CW.transactions.reduce((s,t)=>s+t.gross,0);
const totalNet = CW.transactions.reduce((s,t)=>s+t.net,0);
const pendingPayments = CW.transactions.filter(t=>t.status==='Payment Pending'||t.status==='Pending').reduce((s,t)=>s+t.net,0);
const completedPayments = CW.transactions.filter(t=>t.status==='Completed').reduce((s,t)=>s+t.net,0);
const transportSpend = CW.transactions.length * 1400;
const totalDeductions = CW.transactions.reduce((s,t)=>s+t.deductions,0);

document.getElementById('financeStats').innerHTML = [
  { label:'Total Sales Value', value: CW.formatINR(totalSales) },
  { label:'Estimated Earnings', value: CW.formatINR(totalNet) },
  { label:'Pending Payments', value: CW.formatINR(pendingPayments) },
  { label:'Completed Payments', value: CW.formatINR(completedPayments) },
].map(s=>`<div class="stat-card"><div class="label">${s.label}</div><div class="value tabular">${s.value}</div></div>`).join('');

/* Monthly trend — mock 6-month series */
const months = ['Apr','May','Jun','Jul','Aug','Sep'];
const gross = [42000, 51000, 47500, 60200, 58800, 61250];
const net = [38500, 46800, 43200, 55400, 53900, 56750];

function trendChart(){
  const w=520,h=200,pad=32;
  const max = Math.max(...gross)*1.1;
  const stepX = (w-pad*2)/(months.length-1);
  const toPts = arr => arr.map((v,i)=> [pad+i*stepX, h-pad-( (v/max) * (h-pad*2) )]);
  const grossPts = toPts(gross), netPts = toPts(net);
  const path = pts => 'M'+pts.map(p=>p[0]+','+p[1]).join(' L');
  const dots = (pts,color) => pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${color}"/>`).join('');
  const labels = months.map((m,i)=>`<text x="${pad+i*stepX}" y="${h-8}" font-size="11" fill="var(--text-tertiary)" text-anchor="middle">${m}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;">
    <path d="${path(grossPts)}" fill="none" stroke="var(--fresh-green)" stroke-width="2.5"/>
    <path d="${path(netPts)}" fill="none" stroke="var(--dark-green)" stroke-width="2.5"/>
    ${dots(grossPts,'var(--fresh-green)')}${dots(netPts,'var(--dark-green)')}
    ${labels}
  </svg>`;
}
document.getElementById('trendChart').innerHTML = trendChart();

/* Cost breakdown donut */
function costPie(){
  const segments = [
    { label:'Transport', value: 42, color:'var(--fresh-green)' },
    { label:'Commission', value: 24, color:'var(--wheat)' },
    { label:'Loading & toll', value: 18, color:'var(--dark-green)' },
    { label:'Deductions', value: 16, color:'#B7CFC0' },
  ];
  const r=60,cx=80,cy=80,circ=2*Math.PI*r;
  let offset=0;
  const arcs = segments.map(s=>{
    const len = circ * (s.value/100);
    const arc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="22" stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += len;
    return arc;
  }).join('');
  const legend = segments.map(s=>`<span class="lg"><span class="sw" style="background:${s.color};"></span>${s.label} — ${s.value}%</span>`).join('');
  return `<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
    <svg viewBox="0 0 160 160" style="width:150px;height:150px;">${arcs}</svg>
    <div style="display:flex;flex-direction:column;gap:8px;font-size:12.5px;">${legend}</div>
  </div>`;
}
document.getElementById('costPie').innerHTML = costPie();

/* Cash flow */
const upcoming = CW.transactions.filter(t=>t.status!=='Completed').slice(0,3);
document.getElementById('cashFlow').innerHTML = `
  ${upcoming.map(t=>`
    <div class="opp-row" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <span>Buyer payment — ${t.buyer}<br><span style="font-size:11.5px;color:var(--text-tertiary);">Expected ${t.date}</span></span>
      <b class="tabular">${CW.formatINR(t.net)}</b>
    </div>`).join('')}
  <div class="opp-row" style="padding:10px 0;border-bottom:1px solid var(--border);"><span>Transport expense (est.)</span><b class="tabular" style="color:var(--danger);">-${CW.formatINR(transportSpend)}</b></div>
  <div class="opp-row" style="padding:10px 0;"><span>Commission (est.)</span><b class="tabular" style="color:var(--danger);">-${CW.formatINR(totalDeductions*0.35)}</b></div>
`;

document.getElementById('insightTitle').textContent = 'Reducing transport cost pays off fast';
document.getElementById('insightBody').textContent = 'Reducing transport cost by ₹500 per trip could improve your estimated net return by approximately ₹20,000 across 40 similar trips.';
})();
