(function(){
if(!CW.requireAuth()) return;
const user = CW.getSession();
CW.mountShell('buyers');

const cropFilter = document.getElementById('cropFilter');
CW.crops.forEach(c=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=c.name; cropFilter.appendChild(o); });

function stars(rating){
  return CW.icon('star').repeat(0) + `<span style="display:inline-flex;align-items:center;gap:3px;color:var(--wheat);">${CW.icon('star')}<span style="color:var(--text-primary);font-weight:700;">${rating.toFixed(1)}</span></span>`;
}

function render(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const cropId = cropFilter.value;
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const minQty = parseFloat(document.getElementById('minQty').value) || 0;
  const verifiedOnly = document.getElementById('verifiedOnly').checked;
  const paySpeed = document.getElementById('paySpeed').value;

  const results = CW.buyers.filter(b=>{
    if(q && !b.name.toLowerCase().includes(q) && !b.city.toLowerCase().includes(q)) return false;
    if(cropId && !b.crops.includes(cropId)) return false;
    if(verifiedOnly && !b.verified) return false;
    if(paySpeed && b.paySpeed !== paySpeed) return false;
    if(b.qtyCapacity < minQty) return false;
    const anyCrop = cropId || (b.crops[0]);
    const indicativePrice = Math.round((CW.crops.find(c=>c.id===anyCrop)||CW.crops[0]).basePrice * b.priceIdx);
    if(indicativePrice < minPrice) return false;
    return true;
  });

  document.getElementById('resultsMeta').textContent = `${results.length} buyer${results.length!==1?'s':''} found`;
  const grid = document.getElementById('buyersGrid');

  if(results.length === 0){
    grid.innerHTML = `<div class="card empty-state" style="grid-column:1/-1;"><div class="ico">${CW.icon('users')}</div><h4>No buyers found</h4><p>Try adjusting your filters.</p></div>`;
    return;
  }

  grid.innerHTML = results.map(b=>{
    const refCrop = cropId || b.crops[0];
    const price = Math.round((CW.crops.find(c=>c.id===refCrop)||CW.crops[0]).basePrice * b.priceIdx);
    return `
    <div class="card card-hover fade-in">
      <div class="opp-top">
        <div>
          <div style="font-family:var(--font-display);font-size:17px;font-weight:600;color:var(--dark-green);">${b.name}</div>
          <div style="font-size:12.5px;color:var(--text-tertiary);">${b.city} · ${b.distance} km away</div>
        </div>
        ${b.verified ? `<span class="badge badge-success">${CW.icon('shield')} Verified</span>` : `<span class="badge badge-outline">Unverified</span>`}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0;">
        ${b.crops.map(c=>`<span class="badge badge-neutral">${CW.cropName(c)}</span>`).join('')}
      </div>
      <div class="opp-row"><span>Indicative price</span><b class="tabular">${CW.formatINR(price)}/q</b></div>
      <div class="opp-row"><span>Quantity capacity</span><b class="tabular">${b.qtyCapacity} q</b></div>
      <div class="opp-row"><span>Rating</span>${stars(b.rating)}</div>
      <div class="opp-row"><span>Transactions</span><b>${b.transactions}</b></div>
      <div class="opp-row"><span>Payment speed</span><b>${b.paySpeed}</b></div>
      <a href="buyer-details.html?buyer=${b.id}" class="btn btn-primary btn-sm btn-block" style="margin-top:12px;">View Buyer</a>
    </div>`;
  }).join('');
}

['searchInput','cropFilter','minPrice','minQty','verifiedOnly','paySpeed'].forEach(id=>{
  document.getElementById(id).addEventListener('input', render);
  document.getElementById(id).addEventListener('change', render);
});
document.getElementById('clearFilters').addEventListener('click', ()=>{
  document.getElementById('searchInput').value='';
  cropFilter.value='';
  document.getElementById('minPrice').value='';
  document.getElementById('minQty').value='';
  document.getElementById('verifiedOnly').checked=false;
  document.getElementById('paySpeed').value='';
  render();
});

const grid = document.getElementById('buyersGrid');
CW.simulateLoad(grid, 'Finding buyers…', render, 450);
})();
