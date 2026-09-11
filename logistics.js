(function(){
if(!CW.requireAuth()) return;
const user = CW.getSession();
CW.mountShell('logistics');

const destSel = document.getElementById('destMarket');
CW.markets.forEach(m=>{ const o=document.createElement('option'); o.value=m.id; o.textContent = m.name + ' (' + m.distance + ' km)'; destSel.appendChild(o); });

const vehicleSel = document.getElementById('vehicleSel');
CW.vehicles.forEach(v=>{ const o=document.createElement('option'); o.value=v.id; o.textContent=v.name; vehicleSel.appendChild(o); });

let selectedVehicleId = CW.vehicles[0].id;

function renderVehicles(distance, quantity){
  const grid = document.getElementById('vehicleGrid');
  grid.innerHTML = CW.vehicles.map(v=>{
    const cost = Math.round(v.baseCost + v.costPerKm * distance);
    const perQuintal = Math.round(cost / Math.min(quantity, v.capacity));
    const active = v.id === selectedVehicleId;
    return `<div class="card ${active?'':''}" style="border:1.5px solid ${active?'var(--fresh-green)':'var(--border)'};cursor:pointer;" data-v="${v.id}">
      <div class="flex-between"><b style="font-family:var(--font-display);font-size:16px;">${v.name}</b>${active?'<span class="badge badge-success">Selected</span>':''}</div>
      <div class="opp-row" style="padding:6px 0;"><span>Capacity</span><b>${v.capacity} quintals</b></div>
      <div class="opp-row" style="padding:6px 0;border-top:1px solid var(--border);"><span>Estimated cost</span><b class="tabular">${CW.formatINR(cost)}</b></div>
      <div class="opp-row" style="padding:6px 0;border-top:1px solid var(--border);"><span>Cost per quintal</span><b class="tabular">${CW.formatINR(perQuintal)}</b></div>
      <div class="opp-row" style="padding:6px 0;border-top:1px solid var(--border);"><span>Availability</span><b>${v.availability}</b></div>
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-v]').forEach(card=>{
    card.addEventListener('click', ()=>{ selectedVehicleId = card.dataset.v; vehicleSel.value = selectedVehicleId; render(); });
  });
}

function render(){
  const marketId = parseInt(destSel.value) || CW.markets[0].id;
  const market = CW.markets.find(m=>m.id===marketId);
  const quantity = parseInt(document.getElementById('qty').value) || 25;
  const vehicle = CW.vehicles.find(v=>v.id===vehicleSel.value) || CW.vehicles[0];
  selectedVehicleId = vehicle.id;

  document.getElementById('distVal').textContent = market.distance + ' km';
  document.getElementById('timeVal').textContent = Math.max(1, Math.round(market.distance / 42)) + ' hr' + (market.distance>42?'s':'') + ' (approx.)';

  const transportCost = Math.round(vehicle.baseCost + vehicle.costPerKm * market.distance);
  document.getElementById('transportCostVal').textContent = CW.formatINR(transportCost);

  renderVehicles(market.distance, quantity);

  const cropId = user.crop || 'wheat';
  const grade = user.grade || 'A';
  const price = CW.getMarketPrice(marketId, cropId, grade);
  const grossNoTransport = quantity * price;
  const calc = CW.calcNetReturn({
    quantity, price, transportCost, loadingCost: market.loadingCost, toll: market.toll,
    commissionPct: parseFloat(market.commission), waitingCost: market.waitingCost,
    moistureDeductionPct: market.moistureDeductionPct, rejectionRiskPct: market.rejectionRiskPct
  });
  document.getElementById('withoutTransport').textContent = CW.formatINR(grossNoTransport);
  document.getElementById('afterTransport').textContent = CW.formatINR(calc.net);

  const cheapest = CW.vehicles.map(v=>({v, cost: v.baseCost + v.costPerKm*market.distance})).sort((a,b)=>a.cost-b.cost)[0];
  document.getElementById('recommendedOption').innerHTML = `<div class="k">Recommended option</div><div class="v" style="font-size:18px;">${cheapest.v.name}</div><div style="font-size:12.5px;color:var(--primary-green);margin-top:4px;">Lowest reasonable cost for this route</div>`;
}

['destMarket','qty','vehicleSel'].forEach(id=>{
  document.getElementById(id).addEventListener('input', render);
  document.getElementById(id).addEventListener('change', render);
});

render();
})();
