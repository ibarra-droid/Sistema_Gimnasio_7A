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
};

const formatoDinero = (valor) => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(Number(valor) || 0);

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
  console.error('API Pulse Gym:', error);
}

async function cargarPanel() {
  const url = new URL(API_URL, window.location.href);
  url.searchParams.set('entity', 'dashboard');
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok || !json.ok) throw new Error(json.error || 'No se pudo cargar el panel.');
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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

document.addEventListener('DOMContentLoaded', () => cargarPanel().catch(mostrarError));
