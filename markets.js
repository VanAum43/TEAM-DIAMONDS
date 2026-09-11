(function(){
if(!CW.requireAuth()) return;
const user = CW.getSession();
CW.mountShell('markets');
document.getElementById('demoTag').innerHTML = CW.icon('warn') + '<span>Demo market data — not live trading prices.</span>';

const cropSelect = document.getElementById('cropFilter');
CW.crops.forEach(c=>{
  const opt = document.createElement('option');
  opt.value = c.id; opt.textContent = c.name;
  if(c.id === (user.crop||'wheat')) opt.selected = true;
  cropSelect.appendChild(opt);
});

const params = new URLSearchParams(window.location.search);
if(params.get('q')) document.getElementById('searchInput').value = params.get('q');

function render(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const cropId = cropSelect.value;
  const grade = document.getElementById('gradeFilter').value || (user.grade || 'A');
  const radius = parseInt(document.getElementById('radiusFilter').value, 10);
  const quantity = parseInt(document.getElementById('quantityInput').value, 10) || 25;

  let opportunities = CW.rankOpportunities(cropId, quantity, grade)
    .filter(o => o.market.distance <= radius)
    .filter(o => !q || o.market.name.toLowerCase().includes(q) || o.market.city.toLowerCase().includes(q));

  const list = document.getElementById('marketsList');
  document.getElementById('resultsMeta').textContent = `${opportunities.length} market${opportunities.length!==1?'s':''} found for ${CW.cropName(cropId)} · ${quantity} quintals · Grade ${grade}`;

  if(opportunities.length === 0){
    list.innerHTML = `<div class="card empty-state">
      <div class="ico">${CW.icon('search')}</div>
      <h4>No markets match your filters</h4>
      <p>Try widening your search radius or clearing filters.</p>
    </div>`;
    return;
  }

  const bestNet = opportunities[0];
  const bestPrice = opportunities.slice().sort((a,b)=>b.price-a.price)[0];
  const lowestTransport = opportunities.slice().sort((a,b)=>a.market.transportCost-b.market.transportCost)[0];

  list.innerHTML = `<div class="card" style="padding:0;overflow-x:auto;">
    <table class="data-table">
      <thead><tr>
        <th>Market</th><th>Distance</th><th>Quoted Price</th><th>Est. Costs</th><th>Net Return</th><th>Demand</th><th>Badges</th><th></th>
      </tr></thead>
      <tbody>
        ${opportunities.map(o=>`
          <tr>
            <td><b>${o.market.name}</b><div style="font-size:12px;color:var(--text-tertiary);">${o.market.city}</div></td>
            <td class="tabular">${o.market.distance} km</td>
            <td class="tabular">${CW.formatINR(o.price)}/q</td>
            <td class="tabular" style="color:var(--danger);">-${CW.formatINR(o.totalDeductions)}</td>
            <td class="tabular" style="font-weight:800;color:var(--success);">${CW.formatINR(o.net)}</td>
            <td><span class="badge ${o.market.demand==='High'?'badge-success':o.market.demand==='Medium'?'badge-neutral':'badge-outline'}">${o.market.demand}</span></td>
            <td>
              ${o.market.id===bestNet.market.id?'<span class="badge badge-success">Best Net Return</span>':''}
              ${o.market.id===bestPrice.market.id?'<span class="badge badge-neutral">Best Price</span>':''}
              ${o.market.id===lowestTransport.market.id?'<span class="badge badge-outline">Lowest Transport</span>':''}
            </td>
            <td><a href="market-details.html?market=${o.market.id}&crop=${cropId}&qty=${quantity}&grade=${grade}" class="btn btn-secondary btn-sm">View</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

['searchInput','cropFilter','gradeFilter','radiusFilter','quantityInput'].forEach(id=>{
  document.getElementById(id).addEventListener('input', render);
  document.getElementById(id).addEventListener('change', render);
});
document.getElementById('clearFilters').addEventListener('click', ()=>{
  document.getElementById('searchInput').value='';
  document.getElementById('gradeFilter').value='';
  document.getElementById('radiusFilter').value='9999';
  document.getElementById('quantityInput').value='25';
  render();
});

const listEl = document.getElementById('marketsList');
CW.simulateLoad(listEl, 'Loading markets…', render, 450);
})();
