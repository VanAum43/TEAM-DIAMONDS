(function(){
if(!CW.requireAuth()) return;
const user = CW.getSession();
CW.mountShell('dashboard');

const hour = new Date().getHours();
document.getElementById('greeting').textContent = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
document.getElementById('userName').textContent = user.name.split(' ')[0] + ', here\'s today\'s outlook';
document.getElementById('locLine').textContent = (user.location ? user.location.label : 'Ahmedabad, Gujarat') + ' · ' + CW.cropName(user.crop || 'wheat') + ' · ' + (user.quantity||25) + ' quintals';

const quantity = user.quantity || 25;
const grade = user.grade || 'A';
const cropId = user.crop || 'wheat';
const ranked = CW.rankOpportunities(cropId, quantity, grade);
const best = ranked[0];
const nearest = ranked.slice().sort((a,b)=> a.market.distance - b.market.distance)[0];
const diff = best.net - nearest.net;

document.getElementById('bestNetValue').textContent = CW.formatINR(best.perQuintal) + '/q';
document.getElementById('bestMarketName').textContent = 'Market: ' + best.market.name;
document.getElementById('netDiffBadge').textContent = diff > 0 ? `+${CW.formatINR(diff)} vs your nearest market` : 'Best available option';

/* Quick stats */
const stats = [
  { label:'Best Market', value: best.market.name, sub: best.market.distance+' km away' },
  { label:'Current Crop', value: CW.cropName(cropId), sub: 'Grade ' + grade + ' · ' + quantity + ' quintals' },
  { label:'Expected Net Return', value: CW.formatINR(best.net), sub: 'at ' + best.market.name },
  { label:'Active Buyers', value: CW.buyers.filter(b=>b.crops.includes(cropId)).length, sub: 'matching your crop' },
];
document.getElementById('quickStats').innerHTML = stats.map(s=>`
  <div class="stat-card"><div class="label">${s.label}</div><div class="value">${s.value}</div><div class="sub">${s.sub}</div></div>
`).join('');

/* Opportunity cards — top 3 by net return */
const grid = document.getElementById('opportunityGrid');
CW.simulateLoad(grid, 'Calculating net return across nearby markets…', ()=>{
  grid.innerHTML = ranked.slice(0,3).map((o,i)=>`
    <div class="opp-card ${i===0?'best':''} fade-in">
      <div class="opp-top">
        <div><div class="opp-name">${o.market.name}</div><div class="opp-dist">${o.market.distance} km away</div></div>
        ${i===0?'<span class="badge badge-success">Best Net Return</span>':''}
      </div>
      <div class="opp-net"><div class="k">Estimated net return</div><div class="v tabular">${CW.formatINR(o.net)}</div></div>
      <div class="opp-row"><span>Quoted price</span><b class="tabular">${CW.formatINR(o.price)}/q</b></div>
      <div class="opp-row"><span>Transport + loading</span><b class="tabular">${CW.formatINR(o.market.transportCost+o.market.loadingCost)}</b></div>
      <div class="opp-row"><span>Demand</span><b>${o.market.demand}</b></div>
      <a href="market-details.html?market=${o.market.id}" class="btn btn-secondary btn-sm btn-block">View Details</a>
    </div>
  `).join('');
}, 500);

/* Crop snapshot */
const gross = quantity * best.price;
document.getElementById('cropSnapshot').innerHTML = `
  <div style="font-family:var(--font-display);font-size:19px;color:var(--dark-green);margin-bottom:2px;">${CW.cropName(cropId)}</div>
  <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">${quantity} quintals · Grade ${grade} · ${user.moisture||10}% moisture</div>
  <div class="opp-row" style="padding:8px 0;border-top:1px solid var(--border);"><span>Expected gross value</span><b class="tabular">${CW.formatINR(gross)}</b></div>
  <div class="opp-row" style="padding:8px 0;border-top:1px solid var(--border);"><span>Estimated deductions</span><b class="tabular" style="color:var(--danger);">-${CW.formatINR(best.totalDeductions)}</b></div>
  <div class="opp-row" style="padding:8px 0;border-top:1px solid var(--border);font-size:15px;"><span>Expected net value</span><b class="tabular" style="color:var(--success);">${CW.formatINR(best.net)}</b></div>
`;

/* Recommendation engine */
document.getElementById('recTitle').textContent = 'Sell at ' + best.market.name;
document.getElementById('recReason').textContent = diff > 0
  ? `Although ${nearest.market.name} is closer, ${best.market.name} gives you approximately ${CW.formatINR(diff)} more net return once transport and deductions are accounted for.`
  : `${best.market.name} currently offers the strongest realistic net return for your ${CW.cropName(cropId)} after all costs.`;
})();
