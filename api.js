const API_URL = document.body.dataset.api || './api/api.php';

async function apiRequest(entity, { method = 'GET', id, body } = {}) {
  const url = new URL(API_URL, window.location.href);
  url.searchParams.set('entity', entity);
  if (id != null) url.searchParams.set('id', id);
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || 'No se pudo completar la solicitud.');
  return result.data;
}

const API = {
  listar: (entity) => apiRequest(entity),
  obtener: (entity, id) => apiRequest(entity, { id }),
  crear: (entity, data) => apiRequest(entity, { method: 'POST', body: data }),
  actualizar: (entity, id, data) => apiRequest(entity, { method: 'PUT', body: { ...data, id } }),
  eliminar: (entity, id) => apiRequest(entity, { method: 'DELETE', body: { id } }),
  confirmarPago: (data) => apiRequest('confirmar_pago', { method: 'POST', body: data }),
};

const formatoDinero = (valor) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(Number(valor) || 0);
let datosInforme = null;

function mostrarError(error) {
  const estado = document.querySelector('.estado');
  if (estado) estado.innerHTML = '<i></i> No se pudo conectar';
  document.querySelectorAll('.tarjeta-estadistica .valor-estadistica').forEach(node => node.textContent = '—');
  const tbody = document.querySelector('.panel-actividad tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="4">No se pudo cargar la actividad.</td></tr>';
  const renewals = document.querySelector('.lista-renovaciones');
  if (renewals) renewals.innerHTML = '<p>No se pudieron cargar los vencimientos.</p>';
  const chart = document.querySelector('.linea-tendencia polyline');
  if (chart) chart.setAttribute('points', '');
  const footer = document.querySelector('footer span');
  if (footer) footer.textContent = 'No se pudieron cargar los datos de la base';
  console.error('API OKTUBRE:', error);
}

async function cargarPanel() {
  const url = new URL(API_URL, window.location.href);
  url.searchParams.set('entity', 'dashboard');
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok || !json.ok) throw new Error(json.error || 'No se pudo cargar el panel.');
  datosInforme = json.data;
  const { summary, recent, renewals, trend } = json.data;
  const dateLabel = document.querySelector('#fecha-hoy');
  if (dateLabel) dateLabel.textContent = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toLocaleUpperCase('es');
  const valores = document.querySelectorAll('.tarjeta-estadistica .valor-estadistica');
  [summary.socios, summary.membresias_activas, formatoDinero(summary.ingresos_mes), summary.asistencias_hoy]
    .forEach((valor, i) => { if (valores[i]) valores[i].textContent = valor; });
  const badge = document.querySelector('.contador-nav');
  if (badge) badge.textContent = summary.socios;
  const legendas = document.querySelectorAll('.leyenda strong');
  [summary.membresias_activas, summary.por_vencer, summary.vencidas].forEach((v, i) => {
    if (legendas[i]) legendas[i].textContent = v;
  });
  const activeShare = summary.membresias_total ? Math.round(summary.membresias_activas / summary.membresias_total * 100) : 0;
  const donut = document.querySelector('.dona');
  if (donut) {
    const active = Math.max(0, summary.membresias_activas - summary.por_vencer);
    const activePct = summary.membresias_total ? active / summary.membresias_total * 100 : 0;
    const expiringPct = summary.membresias_total ? summary.por_vencer / summary.membresias_total * 100 : 0;
    donut.style.background = `conic-gradient(#7157e8 0 ${activePct}%, #f2b968 ${activePct}% ${activePct + expiringPct}%, #ececf4 ${activePct + expiringPct}% 100%)`;
    donut.setAttribute('aria-label', `${activeShare} por ciento de membresías activas`);
    const value = donut.querySelector('strong'); if (value) value.textContent = `${activeShare}%`;
  }
  const activeProgress = document.querySelector('.progreso-verde');
  if (activeProgress) activeProgress.style.width = `${activeShare}%`;
  const attendanceProgress = document.querySelector('.progreso-azul');
  if (attendanceProgress) attendanceProgress.style.width = `${Math.min(100, Math.round(summary.asistencias_hoy / 60 * 100))}%`;
  const membershipCaption = document.querySelector('.tarjeta-estadistica:nth-child(2) .leyenda-estadistica');
  if (membershipCaption) membershipCaption.textContent = `${activeShare}% de las membresías`;
  const chart = document.querySelector('.linea-tendencia polyline');
  if (chart && trend?.length) {
    const amounts = trend.map(row => Number(row.monto));
    const min = Math.min(...amounts), max = Math.max(...amounts), spread = max - min || 1;
    chart.setAttribute('points', amounts.map((value, index) => `${Math.round(index * 180 / Math.max(1, amounts.length - 1))},${Math.round(29 - (value - min) / spread * 25)}`).join(' '));
    chart.parentElement?.setAttribute('aria-label', 'Tendencia de ingresos de los últimos seis meses');
  } else if (chart) chart.setAttribute('points', '0,29 45,29 90,29 135,29 180,29');

  const tbody = document.querySelector('.panel-actividad tbody');
  if (tbody) tbody.innerHTML = recent.length ? recent.map((row) => {
    const initials = escapeHtml(`${row.nombre?.[0] || ''}${row.apellido?.[0] || ''}`);
    const date = new Date(`${row.fecha}T00:00:00`).toLocaleDateString('es-AR');
    return `<tr><td><div class="persona"><span class="avatar-persona lavanda">${initials}</span><span><strong>${escapeHtml(row.nombre)} ${escapeHtml(row.apellido)}</strong><small>DNI ${escapeHtml(row.dni)}</small></span></div></td><td><span class="tipo-actividad">${escapeHtml(row.actividad)}</span></td><td>${date}</td><td><span class="insignia pagado">${escapeHtml(row.estado)}</span></td></tr>`;
  }).join('') : '<tr><td colspan="4">Todavía no hay movimientos.</td></tr>';

  const lista = document.querySelector('.lista-renovaciones');
  if (lista) lista.innerHTML = renewals.length ? renewals.map((row) => {
    const date = new Date(`${row.fecha_vencimiento}T00:00:00`);
    const days = Math.max(0, Math.ceil((date - new Date(new Date().toDateString())) / 86400000));
    return `<div class="item-renovacion"><div class="fecha-renovacion"><strong>${date.toLocaleDateString('es-AR', { day: '2-digit' })}</strong><small>${date.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase()}</small></div><div class="info-renovacion"><strong>${escapeHtml(row.nombre)} ${escapeHtml(row.apellido)}</strong><small>Plan ${escapeHtml(row.plan)}</small></div><span class="dias-restantes ${days <= 1 ? 'urgente' : ''}">${days === 0 ? 'Hoy' : `${days} días`}</span></div>`;
  }).join('') : '<p>No hay vencimientos próximos.</p>';
  const footer = document.querySelector('footer span');
  if (footer) footer.textContent = 'Datos cargados desde la base ingresos_gim';
}

function exportarInforme() {
  if (!datosInforme) {
    alert('El informe todavía no está disponible. Esperá a que carguen los datos.');
    return;
  }
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    alert('El navegador bloqueó la ventana del informe. Permití las ventanas emergentes para este sitio y volvé a intentarlo.');
    return;
  }

  const { summary, trend = [], renewals = [] } = datosInforme;
  const ahora = new Date();
  const fechaInforme = ahora.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  const activeShare = summary.membresias_total ? Math.round(summary.membresias_activas / summary.membresias_total * 100) : 0;
  const maxRevenue = Math.max(1, ...trend.map(item => Number(item.monto) || 0));
  const monthRows = trend.map(item => {
    const date = new Date(`${item.mes}-01T00:00:00`);
    const label = date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }).replace('.', '');
    const amount = Number(item.monto) || 0;
    const height = amount ? Math.max(5, Math.round(amount / maxRevenue * 100)) : 2;
    return `<div class="bar-item"><strong>${escapeHtml(formatoDinero(amount))}</strong><div class="bar-track"><i style="height:${height}%"></i></div><span>${escapeHtml(label)}</span></div>`;
  }).join('');
  const previous = trend.length > 1 ? Number(trend[trend.length - 2].monto) || 0 : null;
  const current = trend.length ? Number(trend[trend.length - 1].monto) || 0 : Number(summary.ingresos_mes) || 0;
  const totalSixMonths = trend.reduce((total, item) => total + (Number(item.monto) || 0), 0);
  const variation = previous === null || previous === 0
    ? 'Sin base comparativa'
    : `${current >= previous ? '+' : ''}${Math.round((current - previous) / previous * 100)}% vs. mes anterior`;
  const renewalRows = renewals.length ? renewals.map(item => {
    const date = new Date(`${item.fecha_vencimiento}T00:00:00`);
    return `<tr><td>${escapeHtml(`${item.apellido}, ${item.nombre}`)}</td><td>${escapeHtml(item.plan)}</td><td>${escapeHtml(date.toLocaleDateString('es-AR'))}</td></tr>`;
  }).join('') : '<tr><td colspan="3" class="empty">No hay vencimientos próximos.</td></tr>';
  const safeDate = escapeHtml(fechaInforme);

  reportWindow.document.open();
  reportWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe de gestión - OKTUBRE</title><style>
    @page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{margin:0;background:#eef0f5;color:#202235;font:14px Arial, sans-serif;line-height:1.45}.report{max-width:900px;margin:28px auto;padding:38px 42px;background:#fff;box-shadow:0 12px 40px #19213a18}.head{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:22px;border-bottom:2px solid #7157e8}.brand{font-size:12px;font-weight:700;letter-spacing:2px;color:#7157e8}.head h1{margin:10px 0 4px;font-size:28px;line-height:1.15;letter-spacing:-.5px}.subtitle{margin:0;color:#6e7283;font-size:14px}.date{text-align:right;color:#666b7c;font-size:13px}.date strong{display:block;margin-bottom:4px;color:#26283b;font-size:12px;text-transform:uppercase;letter-spacing:1px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}.metric{padding:16px;border:1px solid #e7e8ef;border-radius:9px;background:#fcfcfe}.metric span{display:block;color:#727688;font-size:12px}.metric strong{display:block;margin-top:9px;font-size:23px;line-height:1.1}.metric small{display:block;margin-top:7px;color:#85899a;font-size:11px}.section{margin-top:25px;break-inside:avoid}.section-title{display:flex;align-items:baseline;justify-content:space-between;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid #e7e8ef}.section-title h2{margin:0;font-size:17px}.section-title span{color:#777b8d;font-size:12px}.business{display:grid;grid-template-columns:1fr 1fr;gap:18px}.status-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.status-card{padding:13px;border-left:3px solid #7157e8;background:#f7f6fd}.status-card:nth-child(2){border-color:#d49a45}.status-card:nth-child(3){border-color:#a2a5b2}.status-card span{display:block;color:#737789;font-size:12px}.status-card strong{display:block;margin-top:6px;font-size:20px}.chart{height:155px;display:grid;grid-template-columns:repeat(6,1fr);align-items:end;gap:10px;padding:12px 10px 0;border-bottom:1px solid #dfe1e9}.bar-item{height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;min-width:0}.bar-item strong{font-size:10px;color:#4e5264;white-space:nowrap}.bar-track{height:90px;width:100%;display:flex;align-items:flex-end;justify-content:center}.bar-track i{display:block;width:min(34px,65%);min-height:2px;border-radius:4px 4px 0 0;background:#806be6}.bar-item span{padding-bottom:5px;color:#777b8d;font-size:11px;text-transform:capitalize}table{width:100%;border-collapse:collapse}th{padding:9px 10px;background:#f5f5f9;color:#696e80;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px}td{padding:10px;border-bottom:1px solid #ececf2;font-size:13px}.empty{color:#797d8e;text-align:center}.foot{display:flex;justify-content:space-between;margin-top:30px;padding-top:12px;border-top:1px solid #e5e6ed;color:#898d9c;font-size:10px}.actions{display:flex;justify-content:flex-end;gap:8px;margin:0 auto 14px;max-width:900px}.actions button{padding:9px 13px;border:0;border-radius:6px;background:#7157e8;color:white;font-size:13px;cursor:pointer}.actions .close{background:#fff;color:#45495a;border:1px solid #dfe1e9}@media print{body{background:#fff;font-size:12px}.report{max-width:none;margin:0;padding:0;box-shadow:none}.actions{display:none}.head h1{font-size:25px}.metrics{gap:8px;margin:18px 0}.metric{padding:12px}.metric strong{font-size:20px}.section{margin-top:18px}.chart{height:130px}.foot{margin-top:20px}}@media(max-width:700px){.report{margin:8px;padding:22px}.metrics{grid-template-columns:repeat(2,1fr)}.business{grid-template-columns:1fr}.head{gap:14px}.head h1{font-size:23px}.date{font-size:11px}}
  </style></head><body><div class="actions"><button onclick="window.print()">Imprimir o guardar como PDF</button><button class="close" onclick="window.close()">Cerrar</button></div><main class="report"><header class="head"><div><div class="brand">OKTUBRE</div><h1>Informe de gestión</h1><p class="subtitle">Indicadores de operación y evolución del negocio</p></div><div class="date"><strong>Fecha de emisión</strong>${safeDate}</div></header>
    <section class="metrics"><article class="metric"><span>Socios registrados</span><strong>${Number(summary.socios) || 0}</strong><small>Personas en la base</small></article><article class="metric"><span>Membresías activas</span><strong>${Number(summary.membresias_activas) || 0}</strong><small>${activeShare}% del total registrado</small></article><article class="metric"><span>Ingresos del mes</span><strong>${escapeHtml(formatoDinero(summary.ingresos_mes))}</strong><small>${escapeHtml(variation)}</small></article><article class="metric"><span>Ingresos en seis meses</span><strong>${escapeHtml(formatoDinero(totalSixMonths))}</strong><small>Acumulado del período analizado</small></article></section>
    <div class="business"><section class="section"><div class="section-title"><h2>Estado de membresías</h2><span>Situación actual</span></div><div class="status-grid"><div class="status-card"><span>Activas</span><strong>${Number(summary.membresias_activas) || 0}</strong></div><div class="status-card"><span>Vencen en 7 días</span><strong>${Number(summary.por_vencer) || 0}</strong></div><div class="status-card"><span>Vencidas</span><strong>${Number(summary.vencidas) || 0}</strong></div></div></section><section class="section"><div class="section-title"><h2>Ingresos mensuales</h2><span>Últimos seis meses</span></div><div class="chart">${monthRows || '<p class="empty">Sin datos de ingresos para el período.</p>'}</div></section></div>
    <section class="section"><div class="section-title"><h2>Próximos vencimientos</h2><span>Socios a contactar</span></div><table><thead><tr><th>Socio</th><th>Plan</th><th>Fecha de vencimiento</th></tr></thead><tbody>${renewalRows}</tbody></table></section>
    <footer class="foot"><span>OKTUBRE · Informe interno de gestión</span><span>Período de ingresos: mes actual · Tendencia: seis meses</span></footer></main><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`);
  reportWindow.document.close();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#export-report')?.addEventListener('click', exportarInforme);
  cargarPanel().catch(mostrarError);
});
