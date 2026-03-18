// ================================================================
// 1. CONFIGURACIÓN GLOBAL Y ESTADO
// ================================================================

let seccionActivaElemento = null;

// ================================================================
// 2. HEADER: LÓGICA DE NAVEGACIÓN SUPERIOR Y BANDERAS
// ================================================================

// Controla el indicador azul que se desliza en el menú
function moverIndicador(elemento) {
    const indicador = document.querySelector('.nav-indicator');
    if (elemento && indicador) {
        indicador.style.width = `${elemento.offsetWidth}px`;
        indicador.style.left = `${elemento.offsetLeft}px`;
    }
}

// Manejo del selector de idiomas (Internacional)
function gestionarBanderas(idiomaSeleccionado) {
    const flags = {
        'es': document.getElementById('flag-mx'),
        'en': document.getElementById('flag-en'),
        'fr': document.getElementById('flag-fr')
    };

    if (!flags[idiomaSeleccionado]) return;

    // Mostramos todas y ocultamos la seleccionada
    Object.values(flags).forEach(f => { if(f) f.classList.remove('d-none'); });
    flags[idiomaSeleccionado].classList.add('d-none');

    console.log("Idioma seleccionado:", idiomaSeleccionado);
}

// Acción para el botón de "Inicio" en el Header
function irInicio(elemento, skipHash = false) {
    if (event) event.stopPropagation();

    if (!skipHash) window.location.hash = 'inicio';

    const indicador = document.querySelector('.nav-indicator');
    const cuerpoPagina = document.getElementById('main-content-wrapper');
    const fullContent = document.getElementById('full-page-content');
    const panel = document.getElementById('panel-principal');

    if (indicador && elemento) {
        moverIndicador(elemento);
        seccionActivaElemento = elemento;
    }

    if (cuerpoPagina) cuerpoPagina.style.display = 'block';
    if (fullContent) {
        fullContent.classList.add('d-none');
        fullContent.innerHTML = '';
    }

    document.querySelectorAll('.enlace-puro').forEach(el => el.classList.remove('activo'));

    if(panel) {
        panel.style.justifyContent = "center";
        panel.innerHTML = `
            <div id="mensaje-vacio" class="animate-fade-in">
                <i class="bi bi-info-circle" style="font-size: 4rem; color: #ddd;"></i>
                <h4 class="text-muted mt-3">Bienvenido</h4>
                <p class="text-muted">Seleccione una opción del menú lateral para ver la información detallada.</p>
            </div>`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================================
// 3. BODY: LÓGICA DE SECCIONES DINÁMICAS Y PANELES
// ================================================================

function cambiarSeccion(tipo, elemento, skipHash = false) {
    const indicador = document.querySelector('.nav-indicator');
    const cuerpoPagina = document.getElementById('main-content-wrapper');
    const fullContent = document.getElementById('full-page-content');
    const panel = document.getElementById('panel-principal');

    if (!skipHash) window.location.hash = tipo;

    // Actualizar indicador si la llamada viene del Header (Inicio o Síntesis)
    if (elemento && indicador && !elemento.classList.contains('enlace-puro')) {
        moverIndicador(elemento);
        seccionActivaElemento = elemento;
    }

    // Lógica para secciones de página completa
    if (tipo === 'sintesis') {
        if (cuerpoPagina) cuerpoPagina.style.display = 'none';
        if (fullContent) {
            fullContent.classList.remove('d-none');
            fullContent.innerHTML = renderFullPageSintesis();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (cuerpoPagina) cuerpoPagina.style.display = 'block';
    if (fullContent) fullContent.classList.add('d-none');

    // --- MEJORA: SELECCIÓN AUTOMÁTICA DEL MENÚ LATERAL ---
    document.querySelectorAll('.enlace-puro').forEach(el => el.classList.remove('activo'));

    // Si el elemento es nulo (carga por hash), lo buscamos por su atributo onclick
    if (!elemento) {
        elemento = Array.from(document.querySelectorAll('.enlace-puro')).find(el =>
            el.getAttribute('onclick')?.includes(`'${tipo}'`)
        );
    }

    if (elemento && elemento.classList.contains('enlace-puro')) {
        elemento.classList.add('activo');
    }

    // Renderizado de contenido
    if (panel) {
        panel.style.justifyContent = "start";
        if (tipo === 'contacto') {
            panel.innerHTML = renderContactoHTML();
        } else {
            // Limpiamos el texto para el título del panel
            const nombre = elemento ? elemento.innerText.replace('❯', '').trim() : tipo;
            panel.innerHTML = renderPlaceholderHTML(nombre);
        }
        if (window.innerWidth < 768) panel.scrollIntoView({ behavior: 'smooth' });
    }
}

// ================================================================
// 4. MANEJO DE HISTORIAL Y CARGA
// ================================================================

function procesarHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'inicio') {
        cambiarSeccion(hash, null, true);
    } else {
        const inicioBtn = document.querySelector('.nav-link-inline');
        irInicio(inicioBtn, true);
    }
}

window.addEventListener('hashchange', procesarHash);

window.addEventListener('DOMContentLoaded', () => {
    // Si no hay hash, forzamos la posición del indicador en Inicio
    if (!window.location.hash || window.location.hash === '#inicio') {
        const inicioBtn = document.querySelector('.nav-link-inline');
        moverIndicador(inicioBtn);
        seccionActivaElemento = inicioBtn;
    }
    procesarHash();
});

window.addEventListener('resize', () => {
    if (seccionActivaElemento) moverIndicador(seccionActivaElemento);
});

// ================================================================
// 5. PLANTILLAS DE RENDERIZADO
// ================================================================

function renderContactoHTML() {
    return `
        <div class="animate-slide-down p-4 text-start">
            <div class="d-flex flex-column gap-5 align-items-center align-items-md-start">
                
                <div class="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
                    <div class="foto-marco">
                        <img src="sources/dra-ines.jpg" class="img-contacto" alt="Dra. Inés">
                    </div>
                    <div>
                        <div class="texto-contacto-titulo fw-bold">Coordinación del programa de Doctorado en Ciencias de la Ingeniería</div>
                        <div class="texto-contacto-nombre fs-5">Dra. María Inés Infanzón Rodríguez</div>
                        <a href="mailto:coordinacion_dci@veracruz.tecnm.mx" class="text-primary text-decoration-underline">coordinacion_dci@veracruz.tecnm.mx</a>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
                    <div class="foto-marco">
                        <img src="sources/dra-olaya.jpg" class="img-contacto" alt="Dra. Olaya">
                    </div>
                    <div>
                        <div class="texto-contacto-titulo fw-bold">Jefatura de la División de Estudios de Posgrado e Investigación</div>
                        <div class="texto-contacto-nombre fs-5">Dra. Olaya Pirene Castellanos Onorio</div>
                        <a href="mailto:depi@veracruz.tecnm.mx" class="text-primary text-decoration-underline">depi@veracruz.tecnm.mx</a>
                    </div>
                </div>

                <div class="w-100 text-center mt-4 border-top pt-4">
                    <div class="fw-bold text-uppercase" style="color: #1B396A;">Tecnológico Nacional de México</div>
                    <div class="fw-bold">Instituto Tecnológico de Veracruz</div>
                    <a href="https://www.veracruz.tecnm.mx/" target="_blank" class="text-primary">https://www.veracruz.tecnm.mx/</a>
                </div>

            </div>
        </div>`;
}

function renderPlaceholderHTML(nombre) {
    return `<div class="animate-fade-in py-5 text-center"><h3>${nombre}</h3><p>Contenido en fase de actualización.</p></div>`;
}

function renderFullPageSintesis() {
    return `<div style="min-height: 75vh;" class="py-5 text-center"><h2>Síntesis del Plan de Estudios</h2></div>`;
}