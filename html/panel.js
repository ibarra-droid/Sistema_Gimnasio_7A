const pages = {
  socios: {
    entity: 'clientes', title: 'Socios', subtitle: 'Administrá los datos y el estado de tus socios.',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true }, { name: 'apellido', label: 'Apellido', required: true },
      { name: 'dni', label: 'DNI', required: true }, { name: 'telefono', label: 'Teléfono' },
      { name: 'correo', label: 'Correo', type: 'email' }, { name: 'domicilio_calle', label: 'Calle' },
      { name: 'domicilio_nro', label: 'Número' }, { name: 'fecha_alta', label: 'Fecha de alta', type: 'date' },
      { name: 'estado', label: 'Estado', type: 'select', options: [['Activo','Activo'],['Inactivo','Inactivo']] },
    ], columns: [['nombre','Nombre'],['apellido','Apellido'],['dni','DNI'],['telefono','Teléfono'],['estado','Estado']],
  },
  membresias: {
    entity: 'contrataciones', title: 'Membresías', subtitle: 'Consultá planes contratados, vigencia y vencimientos.',
    lookups: ['clientes','planes'],
    fields: [
      { name: 'cliente_id', label: 'Socio', lookup: 'clientes', display: (r) => `${r.apellido}, ${r.nombre} · ${r.dni}`, required: true },
      { name: 'plan_id', label: 'Plan', lookup: 'planes', display: (r) => `${r.nombre} (${r.creditos ?? '—'} créditos)`, required: true },
      { name: 'fecha_inicio', label: 'Inicio', type: 'date', required: true }, { name: 'fecha_vencimiento', label: 'Vencimiento', type: 'date', required: true },
      { name: 'estado', label: 'Estado', type: 'select', defaultValue: 'Activa', options: [['Activa','Activa'],['Vencida','Vencida'],['Suspendida','Suspendida']] },
    ], columns: [['cliente_id','Socio'],['plan_id','Plan'],['fecha_inicio','Inicio'],['fecha_vencimiento','Vencimiento'],['estado','Estado']],
  },
  pagos: {
    entity: 'pagos', title: 'Pagos', subtitle: 'Registrá cobros y consultá el historial de pagos.', lookups: ['contrataciones','metodos_pago','clientes','planes'],
    fields: [
      { name: 'contratacion_id', label: 'Membresía / socio', lookup: 'contrataciones', display: (r, refs) => { const c=refs.clientes?.find(x=>x.id_cliente==r.cliente_id); const p=refs.planes?.find(x=>x.id_plan==r.plan_id); return `${c?.apellido || 'Socio'} ${c?.nombre || ''} · ${p?.nombre || 'Plan'} · #${r.id_contratacion}`; }, required: true },
      { name: 'fecha_pago', label: 'Fecha', type: 'date', required: true }, { name: 'monto', label: 'Monto ($)', type: 'number', min: '0', step: '0.01', required: true },
      { name: 'metodo_pago_id', label: 'Método', lookup: 'metodos_pago', display: (r) => r.nombre, required: true },
      { name: 'concepto', label: 'Concepto' }, { name: 'comprobante', label: 'Comprobante' },
    ], columns: [['fecha_pago','Fecha'],['contratacion_id','Socio / membresía'],['monto','Monto'],['metodo_pago_id','Método'],['concepto','Concepto']],
  },
  actividad: {
    entity: 'inscripciones_asistencias', title: 'Actividad', subtitle: 'Registrá ingresos y asistencias a las clases.', lookups: ['contrataciones','clases','clientes','planes'],
    fields: [
      { name: 'contratacion_id', label: 'Membresía / socio', lookup: 'contrataciones', display: (r, refs) => { const c=refs.clientes?.find(x=>x.id_cliente==r.cliente_id); const p=refs.planes?.find(x=>x.id_plan==r.plan_id); return `${c?.apellido || 'Socio'} ${c?.nombre || ''} · ${p?.nombre || 'Plan'} · #${r.id_contratacion}`; }, required: true },
      { name: 'clase_id', label: 'Clase', lookup: 'clases', display: (r) => `${r.nombre} · ${r.dia_semana || ''} ${String(r.hora_inicio || '').slice(0,5)}` },
      { name: 'fecha_inscripcion', label: 'Fecha de asistencia', type: 'date', required: true },
      { name: 'asistido', label: 'Asistió', type: 'select', defaultValue: '1', options: [['1','Sí'],['0','No']] },
    ], columns: [['fecha_inscripcion','Fecha'],['contratacion_id','Socio / membresía'],['clase_id','Clase'],['asistido','Asistencia']],
  },
  clases: {
    entity: 'clases', title: 'Clases', subtitle: 'Administrá horarios, cupos y responsables.', lookups: ['empleados'],
    fields: [
      { name: 'nombre', label: 'Nombre', required: true }, { name: 'dia_semana', label: 'Día', type: 'select', options: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(x=>[x,x]) },
      { name: 'hora_inicio', label: 'Desde', type: 'time' }, { name: 'hora_fin', label: 'Hasta', type: 'time' },
      { name: 'limite_clientes', label: 'Cupo', type: 'number', min: '1' }, { name: 'empleado_id', label: 'Instructor', lookup: 'empleados', display: (r) => `${r.apellido}, ${r.nombre}` },
    ], columns: [['nombre','Clase'],['dia_semana','Día'],['hora_inicio','Desde'],['hora_fin','Hasta'],['limite_clientes','Cupo'],['empleado_id','Instructor']],
  },
  empleados: {
    entity: 'empleados', title: 'Empleados', subtitle: 'Mantené al día los datos del equipo.',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true }, { name: 'apellido', label: 'Apellido', required: true },
      { name: 'dni', label: 'DNI', required: true }, { name: 'telefono', label: 'Teléfono' }, { name: 'correo', label: 'Correo', type: 'email' },
      { name: 'domicilio_calle', label: 'Calle' }, { name: 'domicilio_nro', label: 'Número' },
    ], columns: [['nombre','Nombre'],['apellido','Apellido'],['dni','DNI'],['telefono','Teléfono'],['correo','Correo']],
  },
  planes: {
    entity: 'planes', title: 'Planes', subtitle: 'Configurá los planes, créditos y precios ofrecidos.',
    fields: [{ name:'nombre',label:'Nombre',required:true },{ name:'creditos',label:'Créditos',type:'number',min:'0' },{ name:'precio',label:'Precio ($)',type:'number',min:'0',step:'0.01' }],
    columns: [['nombre','Plan'],['creditos','Créditos'],['precio','Precio']],
  },
  metodos_pago: {
    entity: 'metodos_pago', title: 'Métodos de pago', subtitle: 'Mantené las formas de pago disponibles para registrar cobros.',
    fields: [{ name:'nombre',label:'Nombre del método',required:true }], columns: [['nombre','Método']],
  },
};

const escapeValue = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const today = () => new Date().toLocaleDateString('en-CA');
let config, records = [], refs = {};

document.addEventListener('DOMContentLoaded', async () => {
  const key = document.body.dataset.section;
  config = pages[key];
  if (!config) return;
  document.title = `Pulse Gym | ${config.title}`;
  document.querySelector('#page-title').textContent = config.title;
  document.querySelector('#page-subtitle').textContent = config.subtitle;
  document.querySelector('#breadcrumb').textContent = config.title;
  document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('activo', link.dataset.nav === key));
  const createLabels = {socios:'Nuevo socio',membresias:'Nueva membresía',pagos:'Nuevo pago',actividad:'Registrar asistencia',clases:'Nueva clase',empleados:'Nuevo empleado',planes:'Nuevo plan',metodos_pago:'Nuevo método'};
  document.querySelector('#create-button span').textContent = createLabels[key] || 'Nuevo registro';
  document.querySelector('#create-button').addEventListener('click', () => openForm());
  document.querySelector('#search').addEventListener('input', renderRows);
  document.querySelector('#refresh').addEventListener('click', loadPage);
  document.querySelector('#export').addEventListener('click', exportCsv);
  document.querySelector('#dialog-close').addEventListener('click', closeForm);
  document.querySelector('#cancel-button').addEventListener('click', closeForm);
  document.querySelector('#record-form').addEventListener('submit', saveRecord);
  document.querySelector('#records-body').addEventListener('click', onTableAction);
  document.querySelector('#record-dialog').addEventListener('click', e => { if (e.target.id === 'record-dialog') closeForm(); });
  await loadPage();
  if (location.hash === '#nuevo') openForm();
});

async function loadPage() {
  setStatus('Cargando…');
  try {
    const entities = [...new Set(config.lookups || [])];
    const values = await Promise.all([API.listar(config.entity), ...entities.map(e => API.listar(e))]);
    records = values.shift() || [];
    refs = Object.fromEntries(entities.map((entity, i) => [entity, values[i] || []]));
    if (config.entity === 'pagos' || config.entity === 'inscripciones_asistencias') {
      if (!refs.clientes) refs.clientes = await API.listar('clientes');
      if (!refs.planes) refs.planes = await API.listar('planes');
    }
    document.querySelector('#record-count').textContent = `${records.length} registro${records.length === 1 ? '' : 's'}`;
    renderRows(); setStatus('Sistema operativo');
  } catch (error) { setStatus('Error de conexión'); showToast(error.message, true); }
}

function fieldValue(field, value) {
  if (field.lookup) {
    const row = refs[field.lookup]?.find(item => String(item[primaryKey(field.lookup)]) === String(value));
    return row ? (field.display ? field.display(row, refs) : row.nombre) : (value ? `#${value}` : '—');
  }
  if (field.name === 'asistido') return Number(value) === 1 ? 'Sí' : 'No';
  if (field.name === 'monto') return new Intl.NumberFormat('es-AR', {style:'currency',currency:'ARS'}).format(Number(value)||0);
  return value || '—';
}

function renderRows() {
  const query = (document.querySelector('#search').value || '').trim().toLocaleLowerCase('es');
  const filtered = records.filter(row => config.columns.some(([name]) => {
    const field = config.fields.find(x => x.name === name) || {name};
    return String(fieldValue(field, row[name])).toLocaleLowerCase('es').includes(query);
  }));
  document.querySelector('#record-count').textContent = `${filtered.length} de ${records.length} registro${records.length === 1 ? '' : 's'}`;
  document.querySelector('#records-head').innerHTML = `<tr>${config.columns.map(([,label]) => `<th>${escapeValue(label)}</th>`).join('')}<th class="acciones-col">ACCIONES</th></tr>`;
  document.querySelector('#records-body').innerHTML = filtered.length ? filtered.map(row => `<tr data-id="${row[primaryKey(config.entity)]}">${config.columns.map(([name]) => `<td>${escapeValue(fieldValue(config.fields.find(x=>x.name===name)||{name}, row[name]))}</td>`).join('')}<td class="acciones-fila"><button type="button" class="accion-editar" data-action="edit">Editar</button><button type="button" class="accion-eliminar" data-action="delete">Eliminar</button></td></tr>`).join('') : `<tr><td colspan="${config.columns.length+1}" class="tabla-vacia">${query ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay registros.'}</td></tr>`;
}

function primaryKey(entity) { return ({clientes:'id_cliente',empleados:'id_empleado',planes:'id_plan',clases:'id_clase',contrataciones:'id_contratacion',pagos:'id_pago',metodos_pago:'id_metodo_pago',inscripciones_asistencias:'id_inscripcion'})[entity]; }

function openForm(row = null) {
  const form = document.querySelector('#record-form');
  form.dataset.id = row ? row[primaryKey(config.entity)] : '';
  document.querySelector('#dialog-title').textContent = row ? `Editar ${config.title.toLocaleLowerCase('es')}` : `Nuevo registro`;
  document.querySelector('#form-fields').innerHTML = config.fields.map(field => {
    const value = row?.[field.name] ?? field.defaultValue ?? (field.type === 'date' && field.name.includes('fecha') ? today() : '');
    const required = field.required ? 'required' : '';
    if (field.lookup) {
      const options = (refs[field.lookup] || []).map(item => `<option value="${item[primaryKey(field.lookup)]}" ${String(value)===String(item[primaryKey(field.lookup)])?'selected':''}>${escapeValue(field.display ? field.display(item, refs) : item.nombre)}</option>`).join('');
      return `<label>${escapeValue(field.label)}<select name="${field.name}" ${required}><option value="">Seleccioná…</option>${options}</select></label>`;
    }
    if (field.type === 'select') return `<label>${escapeValue(field.label)}<select name="${field.name}" ${required}><option value="">Seleccioná…</option>${field.options.map(([v,l])=>`<option value="${escapeValue(v)}" ${String(value)===String(v)?'selected':''}>${escapeValue(l)}</option>`).join('')}</select></label>`;
    return `<label>${escapeValue(field.label)}<input name="${field.name}" type="${field.type||'text'}" value="${escapeValue(value)}" ${required} ${field.min ? `min="${field.min}"` : ''} ${field.step ? `step="${field.step}"` : ''}></label>`;
  }).join('');
  document.querySelector('#record-dialog').showModal();
}

function closeForm() { document.querySelector('#record-dialog').close(); }

async function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  for (const field of config.fields) {
    if (field.type === 'number' && data[field.name] !== '') data[field.name] = Number(data[field.name]);
    if (field.name === 'asistido' && data[field.name] !== '') data[field.name] = Number(data[field.name]);
    if (data[field.name] === '') data[field.name] = null;
  }
  const id = form.dataset.id;
  const submit = form.querySelector('[type=submit]'); submit.disabled = true;
  try {
    if (id) await API.actualizar(config.entity, id, data); else await API.crear(config.entity, data);
    closeForm(); showToast(id ? 'Cambios guardados.' : 'Registro creado.'); await loadPage();
  } catch (error) { showToast(error.message, true); }
  finally { submit.disabled = false; }
}

async function onTableAction(event) {
  const button = event.target.closest('button[data-action]'); if (!button) return;
  const row = records.find(x => String(x[primaryKey(config.entity)]) === button.closest('tr').dataset.id);
  if (!row) return;
  if (button.dataset.action === 'edit') { openForm(row); return; }
  if (!confirm(`¿Eliminar este registro de ${config.title.toLocaleLowerCase('es')}? Esta acción no se puede deshacer.`)) return;
  try { await API.eliminar(config.entity, row[primaryKey(config.entity)]); showToast('Registro eliminado.'); await loadPage(); }
  catch (error) { showToast(`${error.message} Puede estar relacionado con pagos, clases o asistencias.`, true); }
}

function showToast(message, isError = false) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.toggle('error', isError); toast.hidden = false;
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.hidden = true, 4500);
}
function setStatus(text) { const el = document.querySelector('.estado'); if (el) el.innerHTML = `<i></i>${escapeValue(text)}`; }
function exportCsv() {
  const rows = [config.columns.map(([,label]) => label), ...records.map(row => config.columns.map(([name]) => fieldValue(config.fields.find(x=>x.name===name)||{name},row[name])))];
  const csv = rows.map(row => row.map(value => `"${String(value??'').replaceAll('"','""')}"`).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a'); a.href=url; a.download=`${config.entity}.csv`; a.click(); URL.revokeObjectURL(url);
}
