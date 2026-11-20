const pages = {
  socios: {
    entity: 'clientes', title: 'Socios', subtitle: 'Administrá los datos y el estado de tus socios.',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true }, { name: 'apellido', label: 'Apellido', required: true },
      { name: 'dni', label: 'DNI', required: true }, { name: 'telefono', label: 'Teléfono' },
      { name: 'correo', label: 'Correo', type: 'email' }, { name: 'domicilio_calle', label: 'Calle' },
      { name: 'domicilio_nro', label: 'Número' }, { name: 'fecha_alta', label: 'Fecha de alta', type: 'date' },
      { name: 'estado', label: 'Estado', type: 'select', defaultValue: 'Activo', options: [['Activo','Activo'],['Inactivo','Inactivo']] },
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
      { name: 'fecha_pago', label: 'Fecha', type: 'date', required: true }, { name: 'monto', label: 'Monto ($)', type: 'number', min: '0.01', step: '0.01', required: true },
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
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const addDays = (value, days) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const addOneMonth = value => {
  const [year, month, day] = value.split('-').map(Number);
  const targetMonth = month === 12 ? 1 : month + 1;
  const targetYear = month === 12 ? year + 1 : year;
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
};
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
    const defaultDate = config.entity === 'contrataciones' && field.name === 'fecha_vencimiento'
      ? addOneMonth(today())
      : (field.type === 'date' && field.name.includes('fecha') ? today() : '');
    const value = row?.[field.name] ?? field.defaultValue ?? defaultDate;
    const required = field.required ? 'required' : '';
    if (config.entity === 'contrataciones' && field.name === 'cliente_id') {
      const client = refs.clientes?.find(item => String(item.id_cliente) === String(value));
      const searchValue = client ? `${client.apellido}, ${client.nombre} · DNI ${client.dni}` : '';
      return `<div class="busqueda-socio campo-completo"><label for="socio-busqueda"><span>${escapeValue(field.label)} <b class="campo-obligatorio" aria-hidden="true">*</b></span><span class="busqueda-socio-control"><input id="socio-busqueda" type="search" value="${escapeValue(searchValue)}" placeholder="Ingresá DNI o nombre y apellido" autocomplete="off" required><button type="button" id="buscar-socio" class="boton-secundario">Buscar</button></span></label><input type="hidden" name="cliente_id" value="${escapeValue(value)}"><div id="socio-seleccionado" aria-live="polite"></div><div id="socio-resultados" class="resultados-socio" aria-live="polite"></div></div>`;
    }
    if (['pagos', 'inscripciones_asistencias'].includes(config.entity) && field.name === 'contratacion_id') {
      const contract = refs.contrataciones?.find(item => String(item.id_contratacion) === String(value));
      const client = refs.clientes?.find(item => String(item.id_cliente) === String(contract?.cliente_id));
      const searchValue = client ? `${client.apellido}, ${client.nombre} · DNI ${client.dni}` : '';
      return `<div class="busqueda-socio campo-completo"><label for="socio-busqueda"><span>${escapeValue(field.label)} <b class="campo-obligatorio" aria-hidden="true">*</b></span><span class="busqueda-socio-control"><input id="socio-busqueda" type="search" value="${escapeValue(searchValue)}" placeholder="Ingresá DNI o nombre y apellido" autocomplete="off" required><button type="button" id="buscar-socio" class="boton-secundario">Buscar</button></span></label><input type="hidden" name="contratacion_id" value="${escapeValue(value)}"><div id="socio-seleccionado" aria-live="polite"></div><div id="socio-resultados" class="resultados-socio" aria-live="polite"></div></div>`;
    }
    if (field.lookup) {
      let lookupRows = refs[field.lookup] || [];
      if (!row && config.entity === 'contrataciones' && field.name === 'cliente_id') {
        lookupRows = lookupRows.filter(item => String(item.estado || '').toLocaleLowerCase('es') === 'activo');
      }
      const options = lookupRows.map(item => `<option value="${item[primaryKey(field.lookup)]}" ${String(value)===String(item[primaryKey(field.lookup)])?'selected':''}>${escapeValue(field.display ? field.display(item, refs) : item.nombre)}</option>`).join('');
      return `<label><span>${escapeValue(field.label)}${field.required ? ' <b class="campo-obligatorio" aria-hidden="true">*</b>' : ''}</span><select name="${field.name}" ${required}>${options}</select></label>`;
    }
    if (field.type === 'select') return `<label><span>${escapeValue(field.label)}${field.required ? ' <b class="campo-obligatorio" aria-hidden="true">*</b>' : ''}</span><select name="${field.name}" ${required}>${field.options.map(([v,l])=>`<option value="${escapeValue(v)}" ${String(value)===String(v)?'selected':''}>${escapeValue(l)}</option>`).join('')}</select></label>`;
    return `<label><span>${escapeValue(field.label)}${field.required ? ' <b class="campo-obligatorio" aria-hidden="true">*</b>' : ''}</span><input name="${field.name}" type="${field.type||'text'}" value="${escapeValue(value)}" ${required} ${field.min ? `min="${field.min}"` : ''} ${field.step ? `step="${field.step}"` : ''}></label>`;
  }).join('');
  if (config.entity === 'contrataciones') {
    setupMembershipClientSearch(row);
    setupMembershipDateValidation();
  }
  if (['pagos', 'inscripciones_asistencias'].includes(config.entity)) setupContractSearch(row);
  if (config.entity === 'pagos') setupPaymentAmountValidation();
  if (config.entity === 'clases') setupClassTimeValidation();
  document.querySelector('#record-dialog').showModal();
}

function setupMembershipClientSearch(row) {
  const form = document.querySelector('#record-form');
  const input = form.querySelector('#socio-busqueda');
  const hidden = form.elements.namedItem('cliente_id');
  const results = form.querySelector('#socio-resultados');
  const selected = form.querySelector('#socio-seleccionado');
  const search = form.querySelector('#buscar-socio');
  if (!input || !hidden || !results || !selected || !search) return;

  const currentClient = refs.clientes?.find(item => String(item.id_cliente) === String(hidden.value));
  const renderClient = (client, allowInactive = false) => {
    hidden.value = client.id_cliente;
    input.setCustomValidity('');
    selected.innerHTML = `<div class="socio-encontrado"><strong>${escapeValue(client.apellido)}, ${escapeValue(client.nombre)}</strong><span>DNI ${escapeValue(client.dni)}</span><span>${escapeValue(client.telefono || 'Sin teléfono')} · ${escapeValue(client.correo || 'Sin correo')}</span><small>${escapeValue(client.estado || 'Sin estado')}${String(client.estado).toLowerCase() !== 'activo' && allowInactive ? ' · socio actual de esta membresía' : ''}</small></div>`;
    results.innerHTML = '';
  };
  if (currentClient) renderClient(currentClient, Boolean(row));
  else input.setCustomValidity('Buscá y seleccioná un socio activo.');

  input.addEventListener('input', () => {
    hidden.value = '';
    input.setCustomValidity('Buscá y seleccioná un socio activo.');
    selected.innerHTML = '';
    results.innerHTML = '';
  });
  const runSearch = async () => {
    const query = input.value.trim();
    if (!query) {
      results.innerHTML = '<p>Ingresá un DNI o nombre y apellido.</p>';
      input.setCustomValidity('Ingresá un DNI o nombre y apellido.');
      return;
    }
    search.disabled = true;
    try {
      refs.clientes = await API.listar('clientes');
      const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
      const digits = query.replace(/\D/g, '');
      const normalizedQuery = normalize(query);
      const matches = refs.clientes.filter(client => {
        const dni = String(client.dni || '').replace(/\D/g, '');
        const fullName = normalize(`${client.apellido} ${client.nombre}`);
        const reverseName = normalize(`${client.nombre} ${client.apellido}`);
        return (digits && dni.includes(digits)) || fullName.includes(normalizedQuery) || reverseName.includes(normalizedQuery);
      });
      const active = matches.filter(client => String(client.estado || '').toLocaleLowerCase('es') === 'activo');
      if (active.length === 1) {
        input.value = `${active[0].apellido}, ${active[0].nombre} · DNI ${active[0].dni}`;
        renderClient(active[0]);
        return;
      }
      if (!matches.length) {
        results.innerHTML = '<p>No encontramos un socio con esos datos.</p>';
        return;
      }
      results.innerHTML = matches.map(client => {
        const isActive = String(client.estado || '').toLocaleLowerCase('es') === 'activo';
        return isActive
          ? `<button type="button" data-client-id="${escapeValue(client.id_cliente)}"><strong>${escapeValue(client.apellido)}, ${escapeValue(client.nombre)}</strong><span>DNI ${escapeValue(client.dni)}</span></button>`
          : `<p class="socio-inactivo"><strong>${escapeValue(client.apellido)}, ${escapeValue(client.nombre)}</strong> · DNI ${escapeValue(client.dni)} · Inactivo</p>`;
      }).join('');
      if (!active.length) results.insertAdjacentHTML('afterbegin', '<p>Solo se pueden asignar membresías a socios activos.</p>');
      else if (active.length === 1) {
        input.value = `${active[0].apellido}, ${active[0].nombre} · DNI ${active[0].dni}`;
        renderClient(active[0]);
      } else results.insertAdjacentHTML('afterbegin', '<p>Encontramos varios socios. Elegí uno:</p>');
    } catch (error) {
      results.innerHTML = '<p>No se pudieron buscar los socios. Intentá nuevamente.</p>';
    } finally { search.disabled = false; }
  };
  search.addEventListener('click', runSearch);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); runSearch(); }
  });
  results.addEventListener('click', event => {
    const button = event.target.closest('button[data-client-id]');
    if (!button) return;
    const client = refs.clientes.find(item => String(item.id_cliente) === button.dataset.clientId);
    if (!client || String(client.estado || '').toLocaleLowerCase('es') !== 'activo') return;
    input.value = `${client.apellido}, ${client.nombre} · DNI ${client.dni}`;
    renderClient(client);
  });
}

function setupContractSearch(row) {
  const form = document.querySelector('#record-form');
  const input = form.querySelector('#socio-busqueda');
  const hidden = form.elements.namedItem('contratacion_id');
  const results = form.querySelector('#socio-resultados');
  const selected = form.querySelector('#socio-seleccionado');
  const search = form.querySelector('#buscar-socio');
  if (!input || !hidden || !results || !selected || !search) return;

  const renderClient = client => `<div class="socio-encontrado"><strong>${escapeHtmlText(client.apellido)}, ${escapeHtmlText(client.nombre)}</strong><span>DNI ${escapeHtmlText(client.dni)}</span><span>${escapeHtmlText(client.telefono || 'Sin teléfono')} · ${escapeHtmlText(client.correo || 'Sin correo')}</span><small>${escapeHtmlText(client.estado || 'Sin estado')}</small></div>`;
  const selectContract = (client, contract, loadPlanPrice = false) => {
    const plan = refs.planes?.find(item => String(item.id_plan) === String(contract.plan_id));
    hidden.value = contract.id_contratacion;
    input.setCustomValidity('');
    if (config.entity === 'pagos' && loadPlanPrice) {
      const amount = form.elements.namedItem('monto');
      if (amount && plan) {
        amount.value = plan.precio ?? '';
        amount.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    selected.innerHTML = `${renderClient(client)}<div class="membresia-encontrada"><strong>${escapeHtmlText(plan?.nombre || 'Plan')}</strong><span>Inicio: ${escapeHtmlText(contract.fecha_inicio || '—')} · Vencimiento: ${escapeHtmlText(contract.fecha_vencimiento || '—')}</span><small>Estado: ${escapeHtmlText(contract.estado || 'Sin estado')}</small></div>`;
    results.innerHTML = '';
  };
  const showClientContracts = client => {
    selected.innerHTML = renderClient(client);
    const contracts = (refs.contrataciones || []).filter(item => String(item.cliente_id) === String(client.id_cliente));
    if (!contracts.length) {
      results.innerHTML = '<p>Este socio no tiene membresías registradas.</p>';
      return;
    }
    if (contracts.length === 1) {
      selectContract(client, contracts[0], true);
      return;
    }
    const contractButtons = contracts.map(contract => {
      const plan = refs.planes?.find(item => String(item.id_plan) === String(contract.plan_id));
      return `<button type="button" data-contract-id="${escapeValue(contract.id_contratacion)}"><strong>${escapeHtmlText(plan?.nombre || 'Plan')}</strong><span>${escapeHtmlText(contract.fecha_inicio || '—')} a ${escapeHtmlText(contract.fecha_vencimiento || '—')} · ${escapeHtmlText(contract.estado || 'Sin estado')}</span></button>`;
    }).join('');
    results.innerHTML = `<p>Elegí la membresía:</p>${contractButtons}`;
  };

  const currentContract = refs.contrataciones?.find(item => String(item.id_contratacion) === String(hidden.value));
  const currentClient = refs.clientes?.find(item => String(item.id_cliente) === String(currentContract?.cliente_id));
  if (currentContract && currentClient) selectContract(currentClient, currentContract);
  else input.setCustomValidity('Buscá un socio y seleccioná una de sus membresías.');

  input.addEventListener('input', () => {
    hidden.value = '';
    if (config.entity === 'pagos') {
      const amount = form.elements.namedItem('monto');
      amount.value = '';
      amount.dispatchEvent(new Event('input', { bubbles: true }));
    }
    input.setCustomValidity('Buscá un socio y seleccioná una de sus membresías.');
    selected.innerHTML = '';
    results.innerHTML = '';
  });
  const runSearch = async () => {
    const query = input.value.trim();
    if (!query) {
      results.innerHTML = '<p>Ingresá un DNI o nombre y apellido.</p>';
      input.setCustomValidity('Ingresá un DNI o nombre y apellido.');
      return;
    }
    search.disabled = true;
    try {
      const [clients, contracts, plans] = await Promise.all([API.listar('clientes'), API.listar('contrataciones'), API.listar('planes')]);
      refs.clientes = clients || [];
      refs.contrataciones = contracts || [];
      refs.planes = plans || [];
      const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
      const digits = query.replace(/\D/g, '');
      const normalizedQuery = normalize(query);
      const matches = refs.clientes.filter(client => {
        const dni = String(client.dni || '').replace(/\D/g, '');
        const fullName = normalize(`${client.apellido} ${client.nombre}`);
        const reverseName = normalize(`${client.nombre} ${client.apellido}`);
        return (digits && dni.includes(digits)) || fullName.includes(normalizedQuery) || reverseName.includes(normalizedQuery);
      });
      if (!matches.length) {
        results.innerHTML = '<p>No encontramos un socio con esos datos.</p>';
      } else if (matches.length === 1) {
        input.value = `${matches[0].apellido}, ${matches[0].nombre} · DNI ${matches[0].dni}`;
        showClientContracts(matches[0]);
      } else {
        results.innerHTML = `<p>Encontramos varios socios. Elegí uno:</p>${matches.map(client => `<button type="button" data-client-id="${escapeValue(client.id_cliente)}"><strong>${escapeHtmlText(client.apellido)}, ${escapeHtmlText(client.nombre)}</strong><span>DNI ${escapeHtmlText(client.dni)} · ${escapeHtmlText(client.estado || 'Sin estado')}</span></button>`).join('')}`;
      }
    } catch (error) {
      results.innerHTML = '<p>No se pudieron buscar los socios. Intentá nuevamente.</p>';
    } finally { search.disabled = false; }
  };
  search.addEventListener('click', runSearch);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); runSearch(); }
  });
  results.addEventListener('click', event => {
    const contractButton = event.target.closest('button[data-contract-id]');
    if (contractButton) {
      const contract = refs.contrataciones.find(item => String(item.id_contratacion) === contractButton.dataset.contractId);
      const client = refs.clientes.find(item => String(item.id_cliente) === String(contract?.cliente_id));
      if (contract && client) selectContract(client, contract, true);
      return;
    }
    const clientButton = event.target.closest('button[data-client-id]');
    if (clientButton) {
      const client = refs.clientes.find(item => String(item.id_cliente) === clientButton.dataset.clientId);
      if (client) showClientContracts(client);
    }
  });
}

function escapeHtmlText(value) { return escapeValue(value); }

function setupMembershipDateValidation() {
  const form = document.querySelector('#record-form');
  const start = form.elements.namedItem('fecha_inicio');
  const end = form.elements.namedItem('fecha_vencimiento');
  if (!start || !end) return;
  const validateEndDate = () => {
    const earliest = start.value ? addDays(start.value, 1) : today();
    end.min = earliest > today() ? earliest : today();
    end.setCustomValidity('');
    if (end.value && end.value < today()) end.setCustomValidity('La fecha de vencimiento no puede ser anterior a hoy.');
    else if (start.value && end.value && end.value < start.value) end.setCustomValidity('La fecha de vencimiento no puede ser anterior al inicio.');
    else if (start.value && end.value === start.value) end.setCustomValidity('La fecha de vencimiento debe ser posterior a la fecha de inicio.');
  };
  start.addEventListener('input', validateEndDate);
  start.addEventListener('change', validateEndDate);
  end.addEventListener('input', validateEndDate);
  end.addEventListener('change', validateEndDate);
  validateEndDate();
}

function setupClassTimeValidation() {
  const form = document.querySelector('#record-form');
  const start = form.elements.namedItem('hora_inicio');
  const end = form.elements.namedItem('hora_fin');
  if (!start || !end) return;
  const validateEndTime = () => {
    end.min = start.value || '';
    end.setCustomValidity('');
    if (start.value && end.value && end.value <= start.value) {
      end.setCustomValidity('La hora de fin debe ser posterior a la hora de inicio.');
    }
  };
  start.addEventListener('input', validateEndTime);
  start.addEventListener('change', validateEndTime);
  end.addEventListener('input', validateEndTime);
  end.addEventListener('change', validateEndTime);
  validateEndTime();
}

function setupPaymentAmountValidation() {
  const amount = document.querySelector('#record-form').elements.namedItem('monto');
  if (!amount) return;
  const validateAmount = () => amount.setCustomValidity(Number(amount.value) === 0 && amount.value !== '' ? 'El monto no puede ser 0.' : '');
  amount.addEventListener('input', validateAmount);
  amount.addEventListener('change', validateAmount);
  validateAmount();
}

function closeForm() { document.querySelector('#record-dialog').close(); }

async function saveRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (config.entity === 'contrataciones') {
    const end = form.elements.namedItem('fecha_vencimiento');
    end.dispatchEvent(new Event('input', { bubbles: true }));
    if (!form.reportValidity()) return;
  }
  if (config.entity === 'clases') {
    const end = form.elements.namedItem('hora_fin');
    end.dispatchEvent(new Event('input', { bubbles: true }));
    if (!form.reportValidity()) return;
  }
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
  try { await API.eliminar(config.entity, row[primaryKey(config.entity)]); showToast('Registro eliminado.'); await loadPage(); }
  catch (error) { showToast('No se ha podido eliminar.', true); }
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
