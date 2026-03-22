// ================================================================
// 1. CONFIGURACIÓN GLOBAL Y ESTADO
// ================================================================

let seccionActivaElemento = null;

// ================================================================
// 2. HEADER: LÓGICA DE NAVEGACIÓN SUPERIOR Y BANDERAS
// ================================================================

function moverIndicador(elemento) {
    const indicador = document.querySelector('.nav-indicator');
    if (elemento && indicador) {
        indicador.style.width = `${elemento.offsetWidth}px`;
        indicador.style.left = `${elemento.offsetLeft}px`;
    }
}

function gestionarBanderas(idiomaSeleccionado) {
    const flags = {
        'es': document.getElementById('flag-mx'),
        'en': document.getElementById('flag-en'),
        'fr': document.getElementById('flag-fr')
    };

    if (!flags[idiomaSeleccionado]) return;

    Object.values(flags).forEach(f => { if(f) f.classList.remove('d-none'); });
    flags[idiomaSeleccionado].classList.add('d-none');

    console.log("Idioma seleccionado:", idiomaSeleccionado);
}

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

    if (elemento && indicador && !elemento.classList.contains('enlace-puro') && !elemento.classList.contains('card-replica-btn')) {
        moverIndicador(elemento);
        seccionActivaElemento = elemento;
    }

    // SÍNTESIS
    if (tipo === 'sintesis') {
        if (cuerpoPagina) cuerpoPagina.style.display = 'none';
        if (fullContent) {
            fullContent.classList.remove('d-none');
            fullContent.innerHTML = renderFullPageSintesis();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // LÍNEAS DE INVESTIGACIÓN
    if (tipo === 'lineas') {
        if (cuerpoPagina) cuerpoPagina.style.display = 'none';
        if (fullContent) {
            fullContent.classList.remove('d-none');
            fullContent.innerHTML = renderFullPageLineas();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            const fullContentDiv = document.getElementById('full-page-content');
            if (fullContentDiv) {
                fullContentDiv.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lgac-link')) {
                        e.preventDefault();
                        const id = e.target.getAttribute('data-target');
                        const elemento = document.getElementById(id);
                        if (elemento) {
                            const offset = elemento.offsetTop - 200;
                            window.scrollTo({ top: offset, behavior: 'smooth' });
                        }
                    }
                });
            }
        }, 100);

        return;
    }

    // NÚCLEO ACADÉMICO
    if (tipo === 'nucleoacademico') {
        if (cuerpoPagina) cuerpoPagina.style.display = 'none';
        if (fullContent) {
            fullContent.classList.remove('d-none');
            fullContent.innerHTML = renderFullPageNucleoAcademico();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (cuerpoPagina) cuerpoPagina.style.display = 'block';
    if (fullContent) fullContent.classList.add('d-none');

    document.querySelectorAll('.enlace-puro').forEach(el => el.classList.remove('activo'));

    if (!elemento) {
        elemento = Array.from(document.querySelectorAll('.enlace-puro')).find(el =>
            el.getAttribute('onclick')?.includes(`'${tipo}'`)
        );
    }

    if (elemento && elemento.classList.contains('enlace-puro')) {
        elemento.classList.add('activo');
    }

    let contenido = '';

    if (panel) {
        panel.style.justifyContent = "start";

        switch(tipo) {
            case 'contacto':
                contenido = renderContactoHTML();
                break;
            case 'tutorias':
                contenido = renderTutoriasHTML();
                break;
            case 'etica':
                contenido = renderEticaHTML();
                break;
            case 'tesis':
                contenido = renderTesisHTML();
                break;
            case 'instalaciones':
                contenido = renderInstalacionesHTML();
                break;
            case 'historia':
                contenido = renderHistoriaHTML();
                break;
            case 'objetivos':
                contenido = renderObjetivosHTML();
                break;
            case 'perfil':
                contenido = renderPerfilHTML();
                break;
            case 'productividad':
                contenido = renderProductividadHTML();
                break;
            case 'vinculacion':
                contenido = renderVinculacionHTML();
                break;
            case 'costos':
                contenido = renderCostosHTML();
                break;
            case 'procesos':
                contenido = renderProcesosHTML();
                break;
            case 'redes':
                contenido = renderRedesHTML();
                break;
            case 'retribucion':
                contenido = renderRetribucionHTML();
                break;
            default:
                const nombre = elemento ? elemento.innerText.replace('❯', '').trim() : tipo;
                contenido = renderPlaceholderHTML(nombre);
        }

        panel.innerHTML = contenido;
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
                        <img src="sources/dra-ines.jpeg" class="img-contacto" alt="Dra. Inés">
                    </div>
                    <div>
                        <div class="texto-contacto-titulo fw-bold">Coordinación del programa de Doctorado en Ciencias de la Ingeniería</div>
                        <div class="texto-contacto-nombre fs-5">Dra. María Inés Infanzón Rodríguez</div>
                        <a href="mailto:coordinacion_dci@veracruz.tecnm.mx" class="text-primary text-decoration-underline">coordinacion_dci@veracruz.tecnm.mx</a>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
                    <div class="foto-marco">
                        <img src="sources/dra-olaya.jpeg" class="img-contacto" alt="Dra. Olaya">
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

function renderTutoriasHTML() {
    return `
        <div class="animate-slide-down p-4 text-start">
            <section id="intro-tutorias" class="mb-5 pb-4 border-bottom">
                <h2 class="mb-3">Tutorías & Anuario</h2>
                <p class="text-muted">Conozca a los doctorandos y al profesorado que participan en el desarrollo de las tesis doctorales por cohorte generacional.</p>
            </section>
            <section id="estadisticas-tutorias" class="mb-5 pb-4 border-bottom">
                <h3 class="mb-3" style="color: #1B396A;">📊 Ingreso: Enero 2026</h3>
                <div class="alert alert-info" role="alert">
                    <strong>Número de estudiantes matriculados por cohorte generacional:</strong> 3
                </div>
            </section>
            <section class="tabla-tutorias-container">
                <table class="tabla-tutorias w-100">
                    <thead>
                        <tr>
                            <th colspan="2" style="background-color: #1B396A; color: white; padding: 15px;">Comité de Tesis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/maria-elena.jpg" alt="María Elena Maceda Rodríguez" class="foto-estudiante">
                                <div class="nombre-estudiante">María Elena<br>Maceda Rodríguez</div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2"><strong>Tesis:</strong> Optimización de la cadena de suministro para la producción sostenible de bioetanol de segunda generación.</p>
                                <p class="mb-2"><strong>Directora:</strong> Dra. María Guadalupe Ayala Uremania (ITVer)</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/genaro-mendez.jpg" alt="Genaro Méndez López" class="foto-estudiante">
                                <div class="nombre-estudiante">Genaro Méndez<br>López</div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2"><strong>Tesis:</strong> Optimización Multiobjetivo del Problema de Gestión de Patios de Contenedores mediante Algoritmos Evolutivos.</p>
                                <p class="mb-2"><strong>Director:</strong> Dr. Rafael Rivera López</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/amanda-caracas.jpg" alt="Amanda Caracas Capetillo" class="foto-estudiante">
                                <div class="nombre-estudiante">Amanda Caracas<br>Capetillo</div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2"><strong>Tesis:</strong> Integración de un agente de control adaptivo inteligente en co-simulación de espacios interiores.</p>
                                <p class="mb-2"><strong>Director:</strong> Dr. Abelardo Rodríguez León</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    `;
}

function renderEticaHTML() {
    return `
        <div class="animate-slide-down p-4 text-start" style="line-height: 1.8; color: #333; text-align: justify;">
            <h2 class="fw-bold mb-4 text-uppercase" style="color: var(--azul-tecnm); border-left: 8px solid var(--naranja-convocatoria); padding-left: 15px;">Protocolos de Ética</h2>
            <p class="mb-3">El programa de doctorado se desarrolla en un entorno académico sustentado en principios éticos, de respeto y de responsabilidad institucional.</p>
            <p class="fw-bold mb-4" style="color: var(--azul-tecnm);">Documentos importantes:</p>
            <div class="d-flex flex-column gap-4">
                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>Política de Igualdad de Género y No Discriminación</strong></p>
                    <a href="https://www.tecnm.mx/dir_calidad/gestion_igualdad/TECNM-GIG-PO-01.pdf?a=37" target="_blank" class="text-primary">Ver documento</a>
                </div>
                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>Código de Ética de la Administración Pública Federal</strong></p>
                    <a href="https://www.dof.gob.mx/nota_detalle.php?codigo=5642176&fecha=08/02/2022#gsc.tab=0" target="_blank" class="text-primary">Ver documento</a>
                </div>
            </div>
        </div>`;
}

function renderFullPageLineas() {
    return `
        <div style="min-height: auto; background-color: var(--blanco); padding: 40px;">
            <div class="lineas-container">
                <h1>Líneas de Investigación</h1>
                <div class="lineas-intro">
                    <p>Las Líneas de Generación y Aplicación del Conocimiento (LGAC) del programa de doctorado constituyen el eje académico y científico que orienta la formación de investigadores.</p>
                </div>
                <div class="lgac-list">
                    <p><a href="javascript:void(0)" class="lgac-link" data-target="lgac-1">LGAC 1. Nanociencias y Materiales Avanzados</a></p>
                    <p><a href="javascript:void(0)" class="lgac-link" data-target="lgac-2">LGAC 2. Bioprocesos-Bioenergía</a></p>
                    <p><a href="javascript:void(0)" class="lgac-link" data-target="lgac-3">LGAC 3. Ingeniería e Inteligencia Computacional</a></p>
                    <p><a href="javascript:void(0)" class="lgac-link" data-target="lgac-4">LGAC 4. Termodinámica de procesos</a></p>
                </div>

                <div id="lgac-1" class="lgac-item">
                    <h2>LGAC 1. Nanociencias y Materiales Avanzados</h2>
                    <div class="lgac-section">
                        <h3>Objetivo:</h3>
                        <p>Diseño, caracterización y aplicación de estructuras, dispositivos y sistemas complejos mediante el control de la forma, el tamaño y las propiedades de la materia a escala macro, micro y nanométrica.</p>
                    </div>
                </div>

                <div id="lgac-2" class="lgac-item">
                    <h2>LGAC 2. Bioprocesos-Bioenergía</h2>
                    <div class="lgac-section">
                        <h3>Objetivo:</h3>
                        <p>Desarrollar investigación multidisciplinaria en ciencias e ingenierías de bioprocesos para generar conocimientos y tecnologías sobre productos farmacéuticos, alimentos y fuentes de bioenergía.</p>
                    </div>
                </div>

                <div id="lgac-3" class="lgac-item">
                    <h2>LGAC 3. Ingeniería e Inteligencia Computacional</h2>
                    <div class="lgac-section">
                        <p>En esta línea de investigación se crea el "cerebro" detrás de las máquinas y sistemas del futuro. Desarrollamos e implementamos métodos y algoritmos especializados e inteligentes.</p>
                    </div>
                </div>

                <div id="lgac-4" class="lgac-item">
                    <h2>LGAC 4. Termodinámica de procesos</h2>
                    <div class="lgac-section">
                        <h3>Objetivo:</h3>
                        <p>Aplicar principios básicos de la termodinámica clásica, reversible e irreversible para el diseño óptimo y simulación de procesos biotecnológicos y de alimentos.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFullPageNucleoAcademico() {
    return `
        <div style="min-height: auto; background-color: var(--blanco); padding: 40px;">
            <div class="lineas-container">
                <h1>Núcleo Académico</h1>
                <div class="lineas-intro">
                    <p>El núcleo académico del programa se caracteriza por su alta calidad, solidez y pertinencia, al estar integrado por un grupo de profesores-investigadores con formación en diversas áreas de la ingeniería, la biotecnología, los alimentos, la computación y los procesos industriales, lo que asegura una cobertura integral de las cuatro líneas de generación y aplicación del conocimiento.</p>
                    
                    <p>La planta académica incluye especialistas con formación doctoral nacional e internacional, y una destacada trayectoria científica respaldada por su pertenencia al Sistema Nacional de Investigadoras e Investigadores, con niveles que alcanzan hasta el SNII 3, así como reconocimientos PRODEP. Destacan perfiles con liderazgo en infraestructura científica, como la jefatura de laboratorios nacionales y especializados en nanotecnología y sistemas de liberación controlada, así como experiencia en bioprocesos, bioenergía, ingeniería eléctrica, manufactura, inteligencia computacional y termodinámica de procesos. Esta diversidad disciplinaria, aunada a su productividad académica y vinculación con problemáticas reales, garantiza la idoneidad del núcleo para sustentar las líneas de investigación, brindar una dirección de tesis de alto nivel y formar recursos humanos con una visión científica, ética y orientada a la innovación con impacto regional, nacional e internacional.</p>
                    
                    <p>A continuación, se presenta al núcleo académico con la información de sus credenciales científicas como perfiles ORCID y Google Scholar, para verificación de su productividad global</p>
                </div>
                
                <div class="nucleo-lgac">
                    <h2>LGAC 1: Nanociencias y Materiales Avanzados</h2>
                    <table class="tabla-profesores-lgac">
                        <tbody>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/alberto-servin-martinez.jpeg" alt="Alberto Servín Martínez" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Alberto Servín Martínez</p>
                                    <p><strong>Licenciatura:</strong> Ingeniero Industrial Mecánico</p>
                                    <p><strong>Maestría:</strong> En Ingeniería en Diseño Mecánico</p>
                                    <p><strong>Doctorado:</strong> Ciencias Químicas</p>
                                    <p><strong>Distinciones:</strong> SNII (2), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:alberto.sm@veracruz.tecnm.mx">alberto.sm@veracruz.tecnm.mx</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="#" target="_blank">https://scholar.google.com.mx/citations?user=wZj7NG4AAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 203443</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/cynthia-cano-sarmiento.jpeg" alt="Cynthia Cano Sarmiento" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Cynthia Cano Sarmiento</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Bioquímica</p>
                                    <p><strong>Doctorado:</strong> Ciencias de los Alimentos</p>
                                    <p><strong>Distinciones:</strong> SNII I</p>
                                    <p><strong>Email:</strong> <a href="mailto:cynthia.cs@veracruz.tecnm.mx">cynthia.cs@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> 0000-0002-9079-6748</p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=oEICInAAAAJ&hl=es" target="_blank">https://scholar.google.com/citations?user=oEICInAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 347736</p>
                                </td>
                            </tr>
                                                        <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/martin-hernandez-ordoñez.jpeg" alt="Martín Hernández Ordoñez" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Martín Hernández Ordoñez</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Electrónica</p>
                                    <p><strong>Maestría:</strong> En Ingeniería Eléctrica</p>
                                    <p><strong>Doctorado:</strong> En Ingeniería Eléctrica</p>
                                    <p><strong>Distinciones:</strong> SNII (1)</p>
                                    <p><strong>Email:</strong> <a href="mailto:martin.ho@veracruz.tecnm.mx">martin.ho@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-3740-5736" target="_blank">https://orcid.org/0000-0002-3740-5736</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=noGcWJAAAAJ&hl=es" target="_blank">https://scholar.google.com/citations?user=noGcWJAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 98343</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/jorge-hernandez-zarate.jpeg" alt="Jorge Arturo Hernández Zárate" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Jorge Arturo Hernández Zárate</p>
                                    <p><strong>Licenciatura:</strong> Ingeniero Mecánico Electricista</p>
                                    <p><strong>Maestría:</strong> Ciencias en Ingeniería Mecánica</p>
                                    <p><strong>Doctorado:</strong> En Sistemas Integrados de Manufactura y Estrategias de Calidad</p>
                                    <p><strong>Email:</strong> <a href="mailto:jorge.hz@veracruz.tecnm.mx">jorge.hz@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> 0009-0005-9234-3477</p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 217201</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                                <div class="nucleo-lgac">
                    <h2>LGAC 2: Bioprocesos-Bioenergías</h2>
                    <table class="tabla-profesores-lgac">
                        <tbody>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/daniel-zavala-ortiz.jpeg" alt="Daniel Arturo Zavala Ortiz" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Daniel Arturo Zavala Ortiz</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Bioquímica</p>
                                    <p><strong>Maestría:</strong> Ingeniería Bioquímica</p>
                                    <p><strong>Doctorado:</strong> Biotecnología e Industrias Alimentarias (Revalidado en Ingeniería Química, Universidad de Lorena, Francia)</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:daniel.zo@veracruz.tecnm.mx">daniel.zo@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-9572-4807" target="_blank">https://orcid.org/0000-0002-9572-4807</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=sVm1WsAAAAJ&hl=es&oi=" target="_blank">https://scholar.google.com/citations?user=sVm1WsAAAAJ&hl=es&oi=</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 547175</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/maria-guadalupe-aguilar.jpeg" alt="María Guadalupe Aguilar Uscanga" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> María Guadalupe Aguilar Uscanga</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Industrial Químico</p>
                                    <p><strong>Maestría:</strong> Ciencias en Bioingeniería de Fermentaciones</p>
                                    <p><strong>Doctorado:</strong> Ingeniería de Procesos (Revalidado en Ingeniería Química, Instituto Nacional Politécnico de Toulouse, Francia)</p>
                                    <p><strong>Distinciones:</strong> SNII (3, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:maria.au@veracruz.tecnm.mx">maria.au@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-3875-7928" target="_blank">https://orcid.org/0000-0002-3875-7928</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=QtKoPDUAAAJ&hl=es&oi=" target="_blank">https://scholar.google.com/citations?user=QtKoPDUAAAJ&hl=es&oi=</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong></p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/maria-ines-infanzon.jpeg" alt="María Inés Infanzón Rodríguez" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> María Inés Infanzón Rodríguez</p>
                                    <p><strong>Licenciatura:</strong> Ingeniero Bioquímico</p>
                                    <p><strong>Maestría:</strong> Ciencias en Ingeniería Bioquímica</p>
                                    <p><strong>Doctorado:</strong> Ciencias de los alimentos (TecNM, campus Tepic)</p>
                                    <p><strong>Distinciones:</strong> SNI (1, Química y Biología)</p>
                                    <p><strong>Email:</strong> <a href="mailto:maria.ir@veracruz.tecnm.mx">maria.ir@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-2301-9105" target="_blank">https://orcid.org/0000-0002-2301-9105</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=rDYEaiAAAAJ&hl=es&oi=" target="_blank">https://scholar.google.com/citations?user=rDYEaiAAAAJ&hl=es&oi=</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 510832</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/javier-gomez-rodriguez.jpeg" alt="Javier Gómez Rodríguez" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Javier Gómez Rodríguez</p>
                                    <p><strong>Licenciatura:</strong> Ingeniero Industrial en Electrónica</p>
                                    <p><strong>Maestría:</strong></p>
                                    <p><strong>Doctorado:</strong> En Ingeniería Electrónica (Universite)</p>
                                    <p><strong>Distinciones:</strong> SNI (1, Ingenierías)</p>
                                    <p><strong>Email:</strong> <a href="mailto:javier.gr@veracruz.tecnm.mx">javier.gr@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-7411-3003" target="_blank">https://orcid.org/0000-0002-7411-3003</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=62UnFnkAAAAJ&hl=es" target="_blank">https://scholar.google.com/citations?user=62UnFnkAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 203807</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/olaya-pirene-castellanos.jpeg" alt="Olaya Pirene Castellanos Onorio" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Olaya Pirene Castellanos Onorio</p>
                                    <p><strong>Licenciatura:</strong> Químico Farmacéutico Biólogo</p>
                                    <p><strong>Maestría:</strong> En Ciencias Alimentarias</p>
                                    <p><strong>Doctorado:</strong> Bioquímica, Química y Tecnología de los Alimentos (Escuela Politécnica de Montpellier II, Francia)</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Biología y Química), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:olaya.co@veracruz.tecnm.mx">olaya.co@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0003-3510-2640" target="_blank">https://orcid.org/0000-0003-3510-2640</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=z5-pDYYAAAAJ&hl=es" target="_blank">https://scholar.google.com/citations?user=z5-pDYYAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 105076</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                                <div class="nucleo-lgac">
                    <h2>LGAC 3: Ingeniería e Inteligencia Computacional</h2>
                    <table class="tabla-profesores-lgac">
                        <tbody>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/rafael-rivera-lopez.jpeg" alt="Rafael Rivera López" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Rafael Rivera López</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería en Sistemas Computacionales</p>
                                    <p><strong>Maestría:</strong> Maestría en Ciencias de la Computación</p>
                                    <p><strong>Doctorado:</strong> Doctorado en Ciencias de la Computación</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Ingeniería), Prodep</p>
                                    <p><strong>Email:</strong> <a href="mailto:rafael.rl@veracruz.tecnm.mx">rafael.rl@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-5254-4195" target="_blank">https://orcid.org/0000-0002-5254-4195</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com/citations?user=UoFV9LAAAAJ&hl=es" target="_blank">https://scholar.google.com/citations?user=UoFV9LAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum RIZOMA:</strong> 336746</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/abelardo-rodriguez-leon.jpeg" alt="Abelardo Rodríguez León" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Abelardo Rodríguez León</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería en Sistemas Computacionales</p>
                                    <p><strong>Maestría:</strong> Maestría en Ciencias de la Computación</p>
                                    <p><strong>Doctorado:</strong> Doctorado en Arquitectura y Tecnología de los Sistemas Informáticos</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:abelardo.rl@veracruz.tecnm.mx">abelardo.rl@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-2179-4837" target="_blank">https://orcid.org/0000-0002-2179-4837</a></p>
                                    <p><strong>Perfil</strong> <span class="separador-perfil">Google Scholar:</span> <a href="https://scholar.google.com.mx/citations?user=OE3Bc8QAAAAJ&hl=es" target="_blank">https://scholar.google.com.mx/citations?user=OE3Bc8QAAAAJ&hl=es</a></p>
                                    <p><strong>Curriculum RIZOMA:</strong> 222277</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/francisco-javier-gomez.jpeg" alt="Francisco Javier Gómez González" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Francisco Javier Gómez González</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Industrial en Electrónica</p>
                                    <p><strong>Maestría:</strong> En ciencias en ingeniería eléctrica</p>
                                    <p><strong>Doctorado:</strong> En ingeniería y producción industrial</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:francisco.pg@veracruz.tecnm.mx">francisco.pg@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0001-7798-9601" target="_blank">https://orcid.org/0000-0001-7798-9601</a></p>
                                    <p><strong>Perfil Google Scholar:</strong> <a href="https://scholar.google.com/citations?user=3kTeP7kAAAAJ&hl=es&oi=" target="_blank">https://scholar.google.com/citations?user=3kTeP7kAAAAJ&hl=es&oi=</a></p>
                                    <p><strong>Curriculum RIZOMA:</strong> 831120</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/guillermo-efren-ovando.jpeg" alt="Guillermo Efrén Ovando Chacón" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Guillermo Efrén Ovando Chacón</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Mecánica</p>
                                    <p><strong>Maestría:</strong> Ingeniería Mecánica</p>
                                    <p><strong>Doctorado:</strong> Ingeniería</p>
                                    <p><strong>Distinciones:</strong> SNII (1, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:guillermo.oc@veracruz.tecnm.mx">guillermo.oc@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0003-2441-3021" target="_blank">https://orcid.org/0000-0003-2441-3021</a></p>
                                    <p><strong>Perfil Google Scholar:</strong> <a href="https://scholar.google.com/citations?user=Bh0Z1S4AAAAJ&hl=es&oi=" target="_blank">https://scholar.google.com/citations?user=Bh0Z1S4AAAAJ&hl=es&oi=</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 35336</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                                <div class="nucleo-lgac">
                    <h2>LGAC 4: Termodinámica de Procesos</h2>
                    <table class="tabla-profesores-lgac">
                        <tbody>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/marco-antonio-salgado.jpeg" alt="Marco Antonio Salgado Cervantes" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Marco Antonio Salgado Cervantes</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Bioquímica en Alimentos</p>
                                    <p><strong>Maestría:</strong> En ciencias en alimentos</p>
                                    <p><strong>Doctorado:</strong> Ingeniería de procesos en alimentos</p>
                                    <p><strong>Distinciones:</strong> SNII (3, ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:marco.sc@veracruz.tecnm.mx">marco.sc@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0001-7284-2053" target="_blank">https://orcid.org/0000-0001-7284-2053</a></p>
                                    <p><strong>Perfil Google Scholar:</strong> <a href="https://scholar.google.com/citations?hl=es&user=MDbm_ZYAAAAJ&view_op=list_works&sortby=pubdate" target="_blank">https://scholar.google.com/citations?hl=es&user=MDbm_ZYAAAAJ&view_op=list_works&sortby=pubdate</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 306</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/miguel-angel-garcia.jpeg" alt="Miguel Angel García Alvarado" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Miguel Angel García Alvarado</p>
                                    <p><strong>Licenciatura:</strong> Ingeniero Químico de la Universidad Veracruzana</p>
                                    <p><strong>Maestría:</strong> Ciencias en Alimentos del Instituto Tecnológico de Veracruz</p>
                                    <p><strong>Doctorado:</strong> Ciencias en Ingeniería Química del del Instituto Tecnológico de Celaya</p>
                                    <p><strong>Distinciones:</strong> SNI (3, Ingenierías)</p>
                                    <p><strong>Email:</strong> <a href="mailto:miguel.ga@veracruz.tecnm.mx">miguel.ga@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> <a href="https://orcid.org/0000-0002-4921-411X" target="_blank">https://orcid.org/0000-0002-4921-411X</a></p>
                                    <p><strong>Perfil Google Scholar:</strong> <a href="https://scholar.google.com/citations?hl=es&user=1Th85q0AAAAJ" target="_blank">https://scholar.google.com/citations?hl=es&user=1Th85q0AAAAJ</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 6888</p>
                                </td>
                            </tr>
                            <tr class="fila-profesor">
                                <td class="celda-foto">
                                    <img src="sources/guadalupe-del-carmen-rodriguez.jpeg" alt="Guadalupe del Carmen Rodríguez Jimenes" class="foto-profesor">
                                </td>
                                <td class="celda-info">
                                    <p><strong>Nombre:</strong> Guadalupe del Carmen Rodríguez Jimenes</p>
                                    <p><strong>Licenciatura:</strong> Ingeniería Industrial Química</p>
                                    <p><strong>Maestría:</strong> Ingeniería de Procesos Alimentarios</p>
                                    <p><strong>Doctorado:</strong> Ingeniería de Procesos Alimentarios</p>
                                    <p><strong>Distinciones:</strong> SNII (2, Ingenierías), PRODEP</p>
                                    <p><strong>Email:</strong> <a href="mailto:guadalupe.rj@veracruz.tecnm.mx">guadalupe.rj@veracruz.tecnm.mx</a></p>
                                    <p><strong>ORCID:</strong> 0000-0003-3500-2937</p>
                                    <p><strong>Perfil Google Scholar:</strong> <a href="https://scholar.google.com/citations?user=ici8ofoAAAAJ&hl=es&oi=ao" target="_blank">https://scholar.google.com/citations?user=ici8ofoAAAAJ&hl=es&oi=ao</a></p>
                                    <p><strong>Curriculum (Perfil RIZOMA):</strong> 16104</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    \`;
}
            </div>
        </div>
    `;
}

function renderPlaceholderHTML(nombre) {
    return `<div class="animate-fade-in py-5 text-center"><h3>${nombre}</h3><p>Contenido en fase de actualización.</p></div>`;
}

function renderFullPageSintesis() {
    return `<div style="min-height: 75vh;" class="py-5 text-center"><h2>Síntesis del Plan de Estudios</h2></div>`;
}

function renderTesisHTML() { return renderPlaceholderHTML('Propuestas de Tesis'); }
function renderInstalacionesHTML() { return renderPlaceholderHTML('Instalaciones'); }
function renderHistoriaHTML() { return renderPlaceholderHTML('Historia'); }
function renderObjetivosHTML() { return renderPlaceholderHTML('Objetivos'); }
function renderPerfilHTML() { return renderPlaceholderHTML('Perfil de Egreso'); }
function renderProductividadHTML() { return renderPlaceholderHTML('Productividad Académica'); }
function renderVinculacionHTML() { return renderPlaceholderHTML('Vinculación'); }
function renderCostosHTML() { return renderPlaceholderHTML('Costos'); }
function renderProcesosHTML() { return renderPlaceholderHTML('Procesos Administrativos'); }
function renderRedesHTML() { return renderPlaceholderHTML('Redes Sociales'); }
function renderRetribucionHTML() { return renderPlaceholderHTML('Retribución Social'); }