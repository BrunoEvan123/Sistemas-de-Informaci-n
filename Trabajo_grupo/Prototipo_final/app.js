const CLAVE_STORAGE = 'aprimeravista-pedidos-v2';

const CATALOGO = [
  {
    id: 'siempre-tu',
    nombre: 'Siempre tú',
    categoria: 'ramos',
    etiqueta: 'El más querido',
    subtitulo: '12 rosas preservadas · Rosa empolvado',
    precio: 59.00,
    descripcion: 'Doce rosas naturales preservadas en rosa empolvado, abrazadas por un envoltorio marfil y un lazo de satén. Para decir «te elegiría otra vez».'
  },
  {
    id: 'un-abrazo',
    nombre: 'Un abrazo',
    categoria: 'cajas',
    etiqueta: 'Listo para regalar',
    subtitulo: 'Caja sombrerera de 6 rosas blancas',
    precio: 39.00,
    descripcion: 'Seis rosas preservadas en blanco marfil presentadas en caja cilíndrica artesanal con lazo de satén.'
  },
  {
    id: 'jardin-nosotros',
    nombre: 'Jardín de nosotros',
    categoria: 'ramos',
    etiqueta: 'Edición especial',
    subtitulo: 'Rosas e hortensias preservadas',
    precio: 69.00,
    descripcion: 'Composición romántica de rosas pastel, hortensias preservadas y eucalipto natural.'
  },
  {
    id: 'pequeno-amor',
    nombre: 'Pequeño amor',
    categoria: 'detalles',
    etiqueta: 'Un bonito comienzo',
    subtitulo: '3 rosas preservadas · Rosa antiguo',
    precio: 29.00,
    descripcion: 'Un detalle delicado de tres rosas preservadas en tono rosa antiguo con envoltorio de lino.'
  }
];

const DATOS_INICIALES = [
  {
    id: 1042,
    codigo: 'APV-1042',
    tipo: 'Personalizado',
    titulo: 'Para nuestro aniversario',
    nombre: 'Lucía Martín',
    correo: 'lucia.martin@example.com',
    telefono: '612 345 678',
    descripcion: 'Un ramo romántico de 18 rosas en rosa empolvado y malva, con envoltorio marfil y lazo de satén. Es para nuestro aniversario.',
    numFlores: 18,
    paleta: 'Rosa empolvado y malva',
    paletaPropuesta: 'Rosa empolvado y marfil',
    extras: 'Bombones artesanos + Tarjeta con dedicatoria',
    dedicatoria: 'Por todo lo vivido y todo lo que nos queda. Te quiero.',
    fechaEntrega: '2026-11-12',
    prioridad: 'normal',
    precioEstimado: 87.00,
    precioFinal: 91.00,
    estado: 'Contrapropuesta',
    mensajeTaller: 'Hola, Lucía. Las rosas malva no están disponibles para tu fecha. Te propongo combinarlas en rosa empolvado y marfil: el resultado será igual de delicado. Mantengo las 18 flores, el lazo y los bombones.'
  },
  {
    id: 1043,
    codigo: 'APV-1043',
    tipo: 'Personalizado',
    titulo: 'Un cielo azul',
    nombre: 'Lucía Martín',
    correo: 'lucia.martin@example.com',
    telefono: '612 345 678',
    descripcion: 'Ramo especial de 24 rosas preservadas en azul intenso para sorprender en cumpleaños.',
    numFlores: 24,
    paleta: 'Azul intenso',
    paletaPropuesta: '',
    extras: 'Tarjeta con dedicatoria',
    dedicatoria: 'Que nunca te falten motivos para sonreír.',
    fechaEntrega: '2026-10-29',
    prioridad: 'urgente',
    precioEstimado: 109.00,
    precioFinal: 109.00,
    estado: 'No viable',
    mensajeTaller: 'Lucía, no podemos conseguir rosas preservadas en azul intenso ni preparar 24 flores para esa fecha tan próxima. Prefiero ser honesta antes de prometerte algo que no podemos cuidar como merece.'
  },
  {
    id: 1044,
    codigo: 'APV-1044',
    tipo: 'Personalizado',
    titulo: 'Un cumpleaños bonito',
    nombre: 'Marta López',
    correo: 'marta.lopez@example.com',
    telefono: '655 987 321',
    descripcion: 'Caja floral en tonos melocotón y marfil con tarjeta dedicada para el cumpleaños de mi hermana.',
    numFlores: 12,
    paleta: 'Tonos tierra y melocotón',
    paletaPropuesta: '',
    extras: 'Jarrón de cristal + Tarjeta con dedicatoria',
    dedicatoria: 'Feliz vuelta al sol, hermana.',
    fechaEntrega: '2026-11-15',
    prioridad: 'normal',
    precioEstimado: 71.00,
    precioFinal: 71.00,
    estado: 'Pendiente de revisión',
    mensajeTaller: '¡Gracias, Marta! Tu inspiración y tus detalles ya están en el taller. Revisaremos disponibilidad y te responderemos en 1–2 días laborables.'
  }
];

function avisarAlmacenamiento(texto) {
  const el = document.querySelector('#almacenamiento');
  if (el) el.textContent = texto;
}

function cargarPedidos() {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    if (raw === null) {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(DATOS_INICIALES));
      avisarAlmacenamiento('Datos iniciales cargados y guardados en el navegador.');
      return structuredClone(DATOS_INICIALES);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Formato inválido en localStorage');
    avisarAlmacenamiento('Datos recuperados del navegador (persisten al recargar).');
    return parsed;
  } catch (err) {
    console.error(err);
    avisarAlmacenamiento('Error al leer localStorage; usando datos por defecto en memoria.');
    return structuredClone(DATOS_INICIALES);
  }
}

let pedidos = cargarPedidos();

function guardarPedidos() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pedidos));
    avisarAlmacenamiento('Cambios guardados correctamente en este navegador.');
    actualizarBadgeNavegacion();
    return true;
  } catch (err) {
    console.error(err);
    avisarAlmacenamiento('No se pudo guardar en localStorage.');
    return false;
  }
}

function formatoEuro(valor) {
  return Number(valor).toFixed(2).replace('.', ',') + ' €';
}

function siguienteNumeroId() {
  return pedidos.reduce((max, p) => Math.max(max, p.id), 1044) + 1;
}

function actualizarBadgeNavegacion() {
  const badge = document.querySelector('#badge-pedidos');
  if (badge) badge.textContent = String(pedidos.length);
}

function claseBadgeEstado(estado) {
  switch (estado) {
    case 'Confirmado':
    case 'Pagado':
      return 'badge-verde';
    case 'Contrapropuesta':
      return 'badge-ambar';
    case 'No viable':
      return 'badge-rojo';
    default:
      return 'badge-azul';
  }
}

/* =========================================================
   1. PÁGINA INICIO / CATÁLOGO (index.html)
   ========================================================= */
function iniciarInicio() {
  const grid = document.querySelector('#grid-catalogo');
  if (!grid) return;

  function renderCatalogo(categoria = 'todos') {
    const items = categoria === 'todos'
      ? CATALOGO
      : CATALOGO.filter(p => p.categoria === categoria);

    grid.replaceChildren();
    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card-producto';
      card.innerHTML = `
        <div>
          <div class="ilustracion-ramo">
            <span class="pill-tag">${item.etiqueta}</span>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#9E4760" stroke-width="1.4" aria-hidden="true">
              <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"></path>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M12 16.5V22"></path>
            </svg>
          </div>
          <h3>${item.nombre}</h3>
          <p style="font-size:13px; color:var(--text-muted); margin:0;">${item.subtitulo}</p>
        </div>
        <div class="precio-row">
          <span class="precio">${formatoEuro(item.precio)}</span>
          <a href="producto.html?id=${item.id}" class="btn btn-suave btn-sm">Elegir regalo</a>
        </div>
      `;
      grid.append(card);
    });
  }

  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('activo'));
      btn.classList.add('activo');
      renderCatalogo(btn.dataset.categoria);
    });
  });

  renderCatalogo();
}

/* =========================================================
   2. PÁGINA DETALLE PRODUCTO (producto.html)
   ========================================================= */
function iniciarProducto() {
  const formDirecto = document.querySelector('#form-directo');
  if (!formDirecto) return;

  const params = new URLSearchParams(window.location.search);
  const idProd = params.get('id') || 'siempre-tu';
  const prod = CATALOGO.find(p => p.id === idProd) || CATALOGO[0];

  document.querySelector('#crumb-nombre').textContent = prod.nombre;
  document.querySelector('#prod-etiqueta').textContent = prod.etiqueta;
  document.querySelector('#prod-titulo').textContent = prod.nombre;
  document.querySelector('#prod-precio').textContent = formatoEuro(prod.precio);
  document.querySelector('#prod-descripcion').textContent = prod.descripcion;

  const inputCant = document.querySelector('#dir-cantidad');
  const btnComprar = document.querySelector('#btn-comprar-ahora');

  function actualizarBoton() {
    const cant = Math.max(1, parseInt(inputCant.value, 10) || 1);
    btnComprar.textContent = `Comprar ahora ${formatoEuro(prod.precio * cant)} →`;
  }
  inputCant.addEventListener('input', actualizarBoton);
  actualizarBoton();

  formDirecto.addEventListener('submit', (e) => {
    e.preventDefault();
    const cant = parseInt(inputCant.value, 10);
    const dedicatoria = document.querySelector('#dir-dedicatoria').value.trim();
    const errCant = document.querySelector('#error-dir-cantidad');
    errCant.textContent = '';

    if (!Number.isInteger(cant) || cant < 1 || cant > 10) {
      errCant.textContent = 'Selecciona una cantidad entre 1 y 10 arreglos.';
      return;
    }

    const nuevoId = siguienteNumeroId();
    const subtotal = prod.precio * cant;
    const nuevoPedido = {
      id: nuevoId,
      codigo: `APV-${nuevoId}`,
      tipo: 'Catálogo',
      titulo: `${prod.nombre} (x${cant})`,
      nombre: 'Cliente invitado',
      correo: '',
      telefono: '',
      descripcion: prod.subtitulo,
      numFlores: 12 * cant,
      paleta: 'Diseño original de catálogo',
      paletaPropuesta: '',
      extras: dedicatoria ? 'Tarjeta con dedicatoria personalizada' : 'Tarjeta estándar incluida',
      dedicatoria: dedicatoria || 'Con mucho cariño.',
      fechaEntrega: '2026-11-28',
      prioridad: 'normal',
      precioEstimado: subtotal,
      precioFinal: subtotal,
      estado: 'Confirmado',
      mensajeTaller: 'Diseño en stock reservado. Listo para completar datos de entrega y pago.'
    };

    pedidos.unshift(nuevoPedido);
    guardarPedidos();
    window.location.href = `checkout.html?id=${nuevoPedido.id}`;
  });
}

/* =========================================================
   3. PÁGINA PERSONALIZA TU REGALO (personaliza.html)
   ========================================================= */
function iniciarPersonaliza() {
  const form = document.querySelector('#form-personaliza');
  if (!form) return;

  const numFlores = document.querySelector('#num-flores');
  const extraBombones = document.querySelector('#extra-bombones');
  const extraJarron = document.querySelector('#extra-jarron');
  const prioridad = document.querySelector('#prioridad');
  const bloqueJust = document.querySelector('#bloque-justificacion');
  const mensaje = document.querySelector('#mensaje');

  function calcularEstimacion() {
    const flores = Math.min(50, Math.max(3, parseInt(numFlores.value, 10) || 18));
    // Precio base escalado por cantidad de flores
    const precioFlores = 25 + flores * 3;
    const precioBombones = extraBombones.checked ? 8 : 0;
    const precioJarron = extraJarron.checked ? 12 : 0;
    const total = precioFlores + precioBombones + precioJarron;

    document.querySelector('#res-flores-txt').textContent = `${flores} rosas preservadas`;
    document.querySelector('#res-flores-precio').textContent = formatoEuro(precioFlores);
    document.querySelector('#res-bombones-row').hidden = !extraBombones.checked;
    document.querySelector('#res-jarron-row').hidden = !extraJarron.checked;
    document.querySelector('#res-total-estimado').textContent = formatoEuro(total);
    return total;
  }

  [numFlores, extraBombones, extraJarron].forEach(el => {
    el.addEventListener('input', calcularEstimacion);
    el.addEventListener('change', calcularEstimacion);
  });

  prioridad.addEventListener('change', () => {
    bloqueJust.hidden = prioridad.value !== 'urgente';
    mensaje.textContent = '';
  });

  calcularEstimacion();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errores = {};

    const tituloIdea = document.querySelector('#titulo-idea');
    const descripcion = document.querySelector('#descripcion');
    const justificacion = document.querySelector('#justificacion');
    const nombre = document.querySelector('#nombre');
    const correo = document.querySelector('#correo');
    const telefono = document.querySelector('#telefono');
    const fechaEntrega = document.querySelector('#fecha-entrega');
    const acepto = document.querySelector('#acepto-privacidad');

    const floresVal = parseInt(numFlores.value, 10);

    if (!tituloIdea.value.trim()) errores['titulo-idea'] = 'Escribe un nombre para identificar tu regalo.';
    if (descripcion.value.trim().length < 15) errores['descripcion'] = 'Describe tu idea con al menos 15 caracteres.';
    if (!Number.isInteger(floresVal) || floresVal < 3 || floresVal > 50) errores['num-flores'] = 'Elige entre 3 y 50 flores.';
    if (prioridad.value === 'urgente' && justificacion.value.trim().length < 10) {
      errores['justificacion'] = 'Justifica la urgencia con al menos 10 caracteres.';
    }
    if (!nombre.value.trim()) errores['nombre'] = 'Escribe tu nombre y apellidos.';
    if (!correo.value.trim() || !correo.validity.valid) errores['correo'] = 'Introduce un correo electrónico válido.';
    if (telefono.value.trim().length < 7) errores['telefono'] = 'Introduce un teléfono de contacto válido.';
    if (!fechaEntrega.value) errores['fecha-entrega'] = 'Selecciona la fecha deseada de entrega.';
    if (!acepto.checked) errores['acepto-privacidad'] = 'Debes aceptar la política de privacidad para enviar la propuesta.';

    const camposValidados = [
      'titulo-idea', 'descripcion', 'num-flores', 'justificacion',
      'nombre', 'correo', 'telefono', 'fecha-entrega', 'acepto-privacidad'
    ];

    camposValidados.forEach(campo => {
      const errEl = document.querySelector('#error-' + campo);
      const inpEl = document.querySelector('#' + campo);
      if (errEl) errEl.textContent = errores[campo] || '';
      if (inpEl) inpEl.setAttribute('aria-invalid', String(Boolean(errores[campo])));
    });

    const listaErrores = Object.keys(errores);
    if (listaErrores.length > 0) {
      mensaje.textContent = 'Revisa los campos marcados antes de enviar tu solicitud.';
      document.querySelector('#' + listaErrores[0]).focus();
      return;
    }

    const totalEst = calcularEstimacion();
    const extrasLista = [];
    if (extraBombones.checked) extrasLista.push('Bombones artesanos');
    if (extraJarron.checked) extrasLista.push('Jarrón de cristal');
    extrasLista.push('Tarjeta con dedicatoria');

    const nuevoId = siguienteNumeroId();
    const nuevaSolicitud = {
      id: nuevoId,
      codigo: `APV-${nuevoId}`,
      tipo: 'Personalizado',
      titulo: tituloIdea.value.trim(),
      nombre: nombre.value.trim(),
      correo: correo.value.trim(),
      telefono: telefono.value.trim(),
      descripcion: descripcion.value.trim(),
      numFlores: floresVal,
      paleta: document.querySelector('#paleta').value,
      paletaPropuesta: '',
      extras: extrasLista.join(' + '),
      dedicatoria: document.querySelector('#dedicatoria').value.trim(),
      fechaEntrega: fechaEntrega.value,
      prioridad: prioridad.value,
      justificacion: prioridad.value === 'urgente' ? justificacion.value.trim() : '',
      precioEstimado: totalEst,
      precioFinal: totalEst,
      estado: 'Pendiente de revisión',
      mensajeTaller: `¡Gracias, ${nombre.value.trim().split(' ')[0]}! Tu inspiración y tus detalles ya están en el taller. Elena revisará la disponibilidad de las flores y te responderá en 1–2 días laborables.`
    };

    pedidos.unshift(nuevaSolicitud);
    guardarPedidos();
    mensaje.textContent = `¡Solicitud ${nuevaSolicitud.codigo} registrada con éxito! Redirigiendo a Mis pedidos...`;

    setTimeout(() => {
      window.location.href = 'pedidos.html';
    }, 900);
  });
}

/* =========================================================
   4. PÁGINA MIS PEDIDOS (pedidos.html)
   ========================================================= */
function iniciarPedidos() {
  const contenedor = document.querySelector('#lista-pedidos');
  if (!contenedor) return;

  const inputBuscar = document.querySelector('#buscar-pedido');
  const selectEstado = document.querySelector('#filtro-estado-pedido');
  const contador = document.querySelector('#contador-pedidos');

  function renderPedidos() {
    const q = inputBuscar.value.trim().toLowerCase();
    const filtro = selectEstado.value;

    const filtrados = pedidos.filter(p => {
      const coincideTexto = `${p.codigo} ${p.titulo} ${p.nombre} ${p.descripcion}`.toLowerCase().includes(q);
      const coincideEstado = filtro === 'todos' || p.estado === filtro;
      return coincideTexto && coincideEstado;
    });

    contador.textContent = `${pedidos.length} solicitudes registradas en total · ${filtrados.length} visibles.`;
    contenedor.replaceChildren();

    if (filtrados.length === 0) {
      contenedor.innerHTML = `<div class="bloque-form"><p style="margin:0; color:var(--text-muted);">No hay solicitudes que coincidan con tu búsqueda.</p></div>`;
      return;
    }

    filtrados.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card-solicitud';

      const paso1 = 'completado';
      const paso2 = p.estado === 'Pendiente de revisión' ? 'actual' : 'completado';
      const paso3 = p.estado === 'Contrapropuesta' ? 'actual' : (['Confirmado', 'Pagado'].includes(p.estado) ? 'completado' : '');
      const paso4 = p.estado === 'Confirmado' ? 'actual' : (p.estado === 'Pagado' ? 'completado' : '');

      let bloqueComparativa = '';
      if (p.estado === 'Contrapropuesta') {
        bloqueComparativa = `
          <div class="comparativa-box">
            <strong>Propuesta alternativa del taller:</strong><br>
            Paleta original: <em>${p.paleta}</em> → Propuesta: <strong>${p.paletaPropuesta || p.paleta}</strong><br>
            Estimación inicial: ${formatoEuro(p.precioEstimado)} → Precio propuesto: <strong>${formatoEuro(p.precioFinal)}</strong> (+ 4,90 € envío)
          </div>
        `;
      }

      let accionesHtml = '';
      if (p.estado === 'Contrapropuesta') {
        accionesHtml = `
          <button type="button" class="btn btn-primario btn-sm" data-accion="aceptar" data-id="${p.id}">
            Aceptar y confirmar ${formatoEuro(p.precioFinal + 4.9)}
          </button>
        `;
      } else if (p.estado === 'Confirmado') {
        accionesHtml = `
          <a href="checkout.html?id=${p.id}" class="btn btn-primario btn-sm">
            Ir al pago ${formatoEuro(p.precioFinal + 4.9)} →
          </a>
        `;
      } else if (p.estado === 'No viable') {
        accionesHtml = `
          <a href="personaliza.html" class="btn btn-suave btn-sm">Enviar una nueva idea</a>
        `;
      }

      card.innerHTML = `
        <div class="card-solicitud-top">
          <div>
            <span class="etiqueta" style="margin-bottom:4px;">${p.codigo} · ${p.tipo.toUpperCase()}</span>
            <h3>${p.titulo}</h3>
            <p style="font-size:13px; color:var(--text-muted); margin:0;">
              Cliente: <strong>${p.nombre}</strong> · Entrega: ${p.fechaEntrega} · ${p.numFlores} flores (${p.paletaPropuesta || p.paleta})
            </p>
          </div>
          <span class="badge-estado ${claseBadgeEstado(p.estado)}">${p.estado}</span>
        </div>

        <div class="stepper" aria-hidden="true">
          <div class="step-item ${paso1}">1. Solicitud recibida</div>
          <div class="step-item ${paso2}">2. Revisión en taller</div>
          <div class="step-item ${paso3}">3. Confirmación</div>
          <div class="step-item ${paso4}">4. Pago seguro</div>
        </div>

        <p style="font-size:14px; margin:8px 0;">${p.descripcion}</p>
        ${bloqueComparativa}
        <div class="mensaje-taller">
          <strong>Elena · A primera vista:</strong> «${p.mensajeTaller}»
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top:14px;">
          <span style="font-size:14px;">
            Importe diseño: <strong>${formatoEuro(p.precioFinal)}</strong>
            <span style="color:var(--text-soft); font-size:12.5px;">(+ 4,90 € envío)</span>
          </span>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${accionesHtml}
            <button type="button" class="btn btn-peligro btn-sm" data-accion="eliminar" data-id="${p.id}">Eliminar</button>
          </div>
        </div>
      `;

      contenedor.append(card);
    });

    contenedor.querySelectorAll('button[data-accion="aceptar"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const target = pedidos.find(x => x.id === id);
        if (!target) return;
        target.estado = 'Confirmado';
        target.paleta = target.paletaPropuesta || target.paleta;
        target.mensajeTaller = `¡Qué ilusión dar forma a «${target.titulo}»! Has aceptado la propuesta. El diseño y el precio final ya están confirmados: ahora puedes completar el pago.`;
        guardarPedidos();
        renderPedidos();
      });
    });

    contenedor.querySelectorAll('button[data-accion="eliminar"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
        pedidos = pedidos.filter(x => x.id !== id);
        guardarPedidos();
        renderPedidos();
      });
    });
  }

  inputBuscar.addEventListener('input', renderPedidos);
  selectEstado.addEventListener('change', renderPedidos);
  renderPedidos();
}

/* =========================================================
   5. PÁGINA DE PAGO SEGURO (checkout.html)
   ========================================================= */
function iniciarCheckout() {
  const form = document.querySelector('#form-checkout');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = Number(params.get('id'));
  const pedido = pedidos.find(p => p.id === idParam)
    || pedidos.find(p => p.estado === 'Confirmado')
    || pedidos[0];

  if (!pedido) return;

  const envio = 4.90;
  const totalPagar = Number(pedido.precioFinal) + envio;

  document.querySelector('#chk-codigo-etiqueta').textContent = `${pedido.codigo} · ACUERDO CONFIRMADO`;
  document.querySelector('#chk-titulo-regalo').textContent = pedido.titulo;
  document.querySelector('#chk-detalle-regalo').textContent = `${pedido.numFlores} flores · ${pedido.paleta} · ${pedido.extras}`;
  document.querySelector('#chk-precio-base').textContent = formatoEuro(pedido.precioFinal);
  document.querySelector('#chk-total').textContent = formatoEuro(totalPagar);
  document.querySelector('#chk-fecha-texto').textContent = `Entrega prevista: ${pedido.fechaEntrega}`;
  document.querySelector('#btn-pagar-final').textContent = `Pagar ${formatoEuro(totalPagar)} 🔒`;

  if (pedido.nombre && pedido.nombre !== 'Cliente invitado') {
    document.querySelector('#chk-nombre').value = pedido.nombre;
  }
  if (pedido.correo) document.querySelector('#chk-correo').value = pedido.correo;
  if (pedido.telefono) document.querySelector('#chk-telefono').value = pedido.telefono;

  const radiosMetodo = document.querySelectorAll('input[name="metodo"]');
  const camposTarjeta = document.querySelector('#campos-tarjeta');
  radiosMetodo.forEach(r => {
    r.addEventListener('change', () => {
      camposTarjeta.hidden = r.value !== 'Tarjeta';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errores = {};

    const correo = document.querySelector('#chk-correo');
    const nombre = document.querySelector('#chk-nombre');
    const telefono = document.querySelector('#chk-telefono');
    const direccion = document.querySelector('#chk-direccion');
    const cp = document.querySelector('#chk-cp');
    const ciudad = document.querySelector('#chk-ciudad');
    const condiciones = document.querySelector('#chk-condiciones');
    const metodo = document.querySelector('input[name="metodo"]:checked').value;

    if (!correo.value.trim() || !correo.validity.valid) errores['chk-correo'] = 'Introduce un correo válido.';
    if (!nombre.value.trim()) errores['chk-nombre'] = 'Escribe nombre y apellidos.';
    if (telefono.value.trim().length < 7) errores['chk-telefono'] = 'Introduce un teléfono válido.';
    if (direccion.value.trim().length < 5) errores['chk-direccion'] = 'Indica la dirección completa de entrega.';
    if (cp.value.trim().length < 4) errores['chk-cp'] = 'Código postal obligatorio.';
    if (!ciudad.value.trim()) errores['chk-ciudad'] = 'Indica la ciudad de entrega.';

    if (metodo === 'Tarjeta') {
      const tarjeta = document.querySelector('#chk-tarjeta').value.replace(/\s+/g, '');
      const cad = document.querySelector('#chk-caducidad').value.trim();
      const cvc = document.querySelector('#chk-cvc').value.trim();
      if (tarjeta.length < 12) errores['chk-tarjeta'] = 'Introduce al menos 12 dígitos de tarjeta ficticia.';
      if (!/^\d{2}\/\d{2}$/.test(cad)) errores['chk-caducidad'] = 'Formato válido: MM/AA.';
      if (cvc.length < 3) errores['chk-cvc'] = 'CVC de 3 o 4 dígitos.';
    }

    if (!condiciones.checked) errores['chk-condiciones'] = 'Acepta las condiciones de compra para finalizar.';

    [
      'chk-correo', 'chk-nombre', 'chk-telefono', 'chk-direccion',
      'chk-cp', 'chk-ciudad', 'chk-tarjeta', 'chk-caducidad', 'chk-cvc', 'chk-condiciones'
    ].forEach(c => {
      const errEl = document.querySelector('#error-' + c);
      if (errEl) errEl.textContent = errores[c] || '';
    });

    const listaErr = Object.keys(errores);
    const msgEl = document.querySelector('#mensaje-checkout');
    if (listaErr.length > 0) {
      msgEl.textContent = 'Por favor revisa los campos marcados.';
      document.querySelector('#' + listaErr[0]).focus();
      return;
    }

    pedido.nombre = nombre.value.trim();
    pedido.correo = correo.value.trim();
    pedido.telefono = telefono.value.trim();
    pedido.direccionEntrega = `${direccion.value.trim()}, ${cp.value.trim()} ${ciudad.value.trim()}`;
    pedido.metodoPago = metodo;
    pedido.estado = 'Pagado';
    pedido.mensajeTaller = `¡Pago recibido (${formatoEuro(totalPagar)} con ${metodo})! Estamos preparando tu arreglo para enviarlo a ${pedido.direccionEntrega}.`;

    guardarPedidos();
    msgEl.textContent = `¡Pedido ${pedido.codigo} pagado con éxito! Redirigiendo a Mis pedidos...`;

    setTimeout(() => {
      window.location.href = 'pedidos.html';
    }, 1000);
  });
}

/* =========================================================
   6. PANEL DEL TALLER (taller.html)
   ========================================================= */
function iniciarTaller() {
  const bandeja = document.querySelector('#bandeja-taller');
  if (!bandeja) return;

  const inputBuscar = document.querySelector('#buscar-taller');
  const selectFiltro = document.querySelector('#filtro-taller');
  const contador = document.querySelector('#contador-taller');
  const formResp = document.querySelector('#form-respuesta-taller');
  const selectAccion = document.querySelector('#taller-accion');
  const grupoContra = document.querySelector('#grupo-contrapropuesta');

  selectAccion.addEventListener('change', () => {
    grupoContra.hidden = selectAccion.value === 'No viable';
  });

  function abrirGestion(solicitud) {
    formResp.hidden = false;
    document.querySelector('#taller-id').value = solicitud.id;
    document.querySelector('#panel-titulo').textContent = `${solicitud.codigo} · ${solicitud.titulo}`;
    document.querySelector('#panel-subtitulo').textContent = `Cliente: ${solicitud.nombre} (${solicitud.correo || 'Sin correo'}) · Estimación: ${formatoEuro(solicitud.precioEstimado)}`;
    document.querySelector('#taller-paleta').value = solicitud.paletaPropuesta || solicitud.paleta;
    document.querySelector('#taller-fecha').value = solicitud.fechaEntrega;
    document.querySelector('#taller-precio').value = solicitud.precioFinal;
    document.querySelector('#taller-mensaje').value = '';
    document.querySelector('#mensaje-taller-status').textContent = '';
    selectAccion.value = 'Contrapropuesta';
    grupoContra.hidden = false;
  }

  function renderBandeja() {
    const q = inputBuscar.value.trim().toLowerCase();
    const f = selectFiltro.value;

    const visibles = pedidos.filter(p => {
      const matchQ = `${p.codigo} ${p.nombre} ${p.titulo} ${p.descripcion}`.toLowerCase().includes(q);
      const matchF = f === 'todos' || p.estado === f;
      return matchQ && matchF;
    });

    contador.textContent = `${pedidos.length} solicitudes en el taller · ${visibles.length} mostradas.`;
    bandeja.replaceChildren();

    if (visibles.length === 0) {
      bandeja.innerHTML = `<div class="bloque-form"><p style="margin:0; color:var(--text-muted);">No hay solicitudes en esta vista.</p></div>`;
      return;
    }

    visibles.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card-solicitud';
      card.innerHTML = `
        <div class="card-solicitud-top">
          <div>
            <span class="etiqueta" style="margin-bottom:4px;">${p.codigo} · ${p.prioridad === 'urgente' ? 'URGENTE' : 'NORMAL'}</span>
            <h3>${p.titulo}</h3>
            <p style="font-size:13px; color:var(--text-muted); margin:0;">
              ${p.nombre} · Entrega deseada: ${p.fechaEntrega} · ${p.numFlores} flores
            </p>
          </div>
          <span class="badge-estado ${claseBadgeEstado(p.estado)}">${p.estado}</span>
        </div>
        <p style="font-size:13.5px; margin:10px 0;">${p.descripcion}</p>
        <p style="font-size:12.5px; color:var(--text-muted); margin:0 0 12px;">
          Paleta: <strong>${p.paleta}</strong> · Importe actual: <strong>${formatoEuro(p.precioFinal)}</strong>
        </p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-primario btn-sm" data-gestionar="${p.id}">Responder / Gestionar</button>
          <button type="button" class="btn btn-peligro btn-sm" data-borrar="${p.id}">Eliminar</button>
        </div>
      `;
      bandeja.append(card);
    });

    bandeja.querySelectorAll('button[data-gestionar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sol = pedidos.find(x => x.id === Number(btn.dataset.gestionar));
        if (sol) abrirGestion(sol);
      });
    });

    bandeja.querySelectorAll('button[data-borrar]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('¿Eliminar esta solicitud del registro?')) return;
        pedidos = pedidos.filter(x => x.id !== Number(btn.dataset.borrar));
        guardarPedidos();
        renderBandeja();
      });
    });
  }

  formResp.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(document.querySelector('#taller-id').value);
    const sol = pedidos.find(x => x.id === id);
    if (!sol) return;

    const msgInput = document.querySelector('#taller-mensaje');
    const errMsg = document.querySelector('#error-taller-mensaje');
    errMsg.textContent = '';

    if (msgInput.value.trim().length < 10) {
      errMsg.textContent = 'Escribe un mensaje de al menos 10 caracteres para el cliente.';
      msgInput.focus();
      return;
    }

    const accion = selectAccion.value;
    sol.estado = accion;
    sol.mensajeTaller = msgInput.value.trim();

    if (accion !== 'No viable') {
      const nuevaPaleta = document.querySelector('#taller-paleta').value.trim();
      const nuevaFecha = document.querySelector('#taller-fecha').value;
      const nuevoPrecio = parseFloat(document.querySelector('#taller-precio').value);
      if (nuevaPaleta) sol.paletaPropuesta = nuevaPaleta;
      if (nuevaFecha) sol.fechaEntrega = nuevaFecha;
      if (!Number.isNaN(nuevoPrecio) && nuevoPrecio > 0) sol.precioFinal = nuevoPrecio;
    }

    guardarPedidos();
    renderBandeja();
    document.querySelector('#mensaje-taller-status').textContent =
      `Respuesta guardada (${accion}). Ya es visible en «Mis pedidos».`;
  });

  document.querySelector('#btn-restaurar-demo').addEventListener('click', () => {
    if (!confirm('¿Restaurar las solicitudes de ejemplo originales?')) return;
    pedidos = structuredClone(DATOS_INICIALES);
    guardarPedidos();
    renderBandeja();
  });

  inputBuscar.addEventListener('input', renderBandeja);
  selectFiltro.addEventListener('change', renderBandeja);
  renderBandeja();
}

/* Inicialización global */
document.addEventListener('DOMContentLoaded', () => {
  actualizarBadgeNavegacion();
  iniciarInicio();
  iniciarProducto();
  iniciarPersonaliza();
  iniciarPedidos();
  iniciarCheckout();
  iniciarTaller();
});
