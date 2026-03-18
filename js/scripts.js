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

    // Agregar clase activo (AQUÍ es donde se pone azul)
    if (elemento && elemento.classList.contains('enlace-puro')) {
        elemento.classList.add('activo');
    }

    // Renderizado de contenido
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
                // Para secciones sin render específico, usar placeholder
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

function renderTutoriasHTML() {
    return `
        <div class="animate-slide-down p-4 text-start">
        
            <!-- INTRODUCCIÓN -->
            <section id="intro-tutorias" class="mb-5 pb-4 border-bottom">
                <h2 class="mb-3">Tutorías & Anuario</h2>
                <p class="text-muted">
                    Conozca a los doctorandos y al profesorado que participan en el desarrollo de las tesis 
                    doctorales por cohorte generacional. A continuación se presenta la relación de directores 
                    de tesis y de tutores o tutoras responsables del acompañamiento académico en los trabajos 
                    de investigación en el desarrollo del trabajo profesional.
                </p>
            </section>

            <!-- ESTADÍSTICAS -->
            <section id="estadisticas-tutorias" class="mb-5 pb-4 border-bottom">
                <h3 class="mb-3" style="color: #1B396A;">📊 Ingreso: Enero 2026</h3>
                <div class="alert alert-info" role="alert">
                    <strong>Número de estudiantes matriculados por cohorte generacional:</strong> 3
                </div>
            </section>

            <!-- TABLA CON ESTUDIANTES -->
            <section class="tabla-tutorias-container">
                <table class="tabla-tutorias w-100">
                    <thead>
                        <tr>
                            <th colspan="2" style="background-color: #1B396A; color: white; padding: 15px;">
                                Comité de Tesis
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <!-- ESTUDIANTE 1: MAR��A ELENA -->
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/maria-elena.jpg" alt="María Elena Maceda Rodríguez" class="foto-estudiante">
                                <div id="maria-elena-sect" class="nombre-estudiante">
                                    María Elena<br>Maceda Rodríguez
                                </div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2">
                                    <strong>Tesis:</strong> Optimización de la cadena de suministro para la 
                                    producción sostenible de bioetanol de segunda generación.
                                </p>
                                <p class="mb-2">
                                    <strong>Directora:</strong> Dra. María Guadalupe Ayala Uremania (ITVer)
                                </p>
                                <p class="mb-2">
                                    <strong>Codirectores:</strong> Daniel Arturo Zavala Ortiz (ITVer), 
                                    Alicia Pérez Paz (Universidad de Vigo)
                                </p>
                                <p class="mb-2">
                                    <strong>Revisores:</strong> Dra. María Inés Infanzón Rodríguez (ITVer), 
                                    Dr. Galo Rafael Uñea García (ITOrizaba), Dr. Eduardo Roldán Reyes (ITOrizaba), 
                                    Dr. José Manuel Domínguez González (Universidad de Vigo)
                                </p>
                                <p class="mb-0">
                                    <strong>Tutor:</strong> Dra. Guadalupe del Carmen Rodríguez Jimenez
                                </p>
                            </td>
                        </tr>

                        <!-- ESTUDIANTE 2: GENARO -->
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/genaro-mendez.jpg" alt="Genaro Méndez López" class="foto-estudiante">
                                <div id="genaro-mendez-sect" class="nombre-estudiante">
                                    Genaro Méndez<br>López
                                </div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2">
                                    <strong>Tesis:</strong> Optimización Multiobjetivo del Problema de Gestión 
                                    de Patios de Contenedores mediante Algoritmos Evolutivos asistidos por 
                                    Aprendizaje Automático.
                                </p>
                                <p class="mb-2">
                                    <strong>Director:</strong> Dr. Rafael Rivera López (Instituto Tecnológico de Veracruz)
                                </p>
                                <p class="mb-2">
                                    <strong>Codirector:</strong> Dr. José Antonio Gamez Martín 
                                    (Universidad de Castilla-La Mancha, España)
                                </p>
                                <p class="mb-2">
                                    <strong>Revisores:</strong> Dr. Francisco Javier Gómez González (ITVer), 
                                    Dr. Martín Hernández Ordoñez (ITVer), Dr. Marco Antonio Cruz Chávez 
                                    (Universidad Autónoma del Estado de Morelos)
                                </p>
                                <p class="mb-0">
                                    <strong>Tutor:</strong> Dr. Rafael Rivera López
                                </p>
                            </td>
                        </tr>

                        <!-- ESTUDIANTE 3: AMANDA -->
                        <tr>
                            <td class="celda-foto">
                                <img src="sources/amanda-caracas.jpg" alt="Amanda Caracas Capetillo" class="foto-estudiante">
                                <div id="amanda-caracas-sect" class="nombre-estudiante">
                                    Amanda Caracas<br>Capetillo
                                </div>
                            </td>
                            <td class="celda-info">
                                <p class="mb-2">
                                    <strong>Tesis:</strong> Integración de un agente de control adaptivo 
                                    inteligente en co-simulación de espacios interiores para la regulación 
                                    de islas de calor.
                                </p>
                                <p class="mb-2">
                                    <strong>Director:</strong> Dr. Abelardo Rodríguez León (ITVer)
                                </p>
                                <p class="mb-2">
                                    <strong>Codirectores:</strong> Dra. Erika Susana Rosas Olivos (DISCA - 
                                    Universidad Politécnica de Valencia, España), Dr. Guillermo E. Ovando Chacón (ITVer)
                                </p>
                                <p class="mb-2">
                                    <strong>Revisores:</strong> Dr. Ricardo F. Martínez González (ITVer), 
                                    Dr. Javier Gómez Rodríguez (ITVer)
                                </p>
                                <p class="mb-0">
                                    <strong>Tutor:</strong> Dr. Alberto Servín Martínez
                                </p>
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
            
            <h2 class="fw-bold mb-4 text-uppercase" style="color: var(--azul-tecnm); border-left: 8px solid var(--naranja-convocatoria); padding-left: 15px;">
                Protocolos de Ética
            </h2>

            <p class="mb-3">
                El programa de doctorado se desarrolla en un entorno académico sustentado en principios éticos, de respeto y de responsabilidad institucional. El Tecnológico Nacional de México y las instituciones que lo integran cuentan con un sólido marco normativo orientado a garantizar la igualdad, la integridad académica y el adecuado desarrollo de las actividades de investigación. Entre estos instrumentos se encuentran el Sistema de Gestión de Igualdad de Género y No Discriminación, certificado bajo la Norma Mexicana NMX-R-025-SCFI-2015, así como diversas políticas, códigos y reglamentos que promueven el respeto a los derechos humanos, la igualdad sustantiva y la no discriminación dentro de la comunidad académica.
            </p>

            <p class="mb-3">
                Este marco se complementa con códigos de ética y de conducta, el reglamento de estudiantes, y con la operación de comités institucionales responsables de prevenir, atender y sancionar posibles conductas contrarias a estos principios. En conjunto, estas disposiciones aseguran que el trabajo doctoral se realice en un ambiente de profesionalismo, transparencia, equidad y acompañamiento académico responsable, brindando a las y los doctorantes las condiciones institucionales necesarias para desarrollar su investigación con rigor científico y en un entorno respetuoso e incluyente.
            </p>

            <p class="fw-bold mb-4" style="color: var(--azul-tecnm);">Por lo anterior, en el TecNM se cuenta con:</p>

            <div class="d-flex flex-column gap-4">
                
                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>1.- Una Política de Igualdad de Género y No Discriminación del Tecnológico Nacional de México</strong>, en donde se establece el compromiso con la promoción y ejercicio de los derechos humanos para toda persona que integra los Institutos, Unidades, Centros y Oficinas centrales, garantizando (en el ámbito de competencia, facultades y responsabilidades), el principio de igualdad sustantiva entre mujeres y hombres así como el derecho fundamental a la no discriminación en los procesos y condiciones laborales y escolares, quedando prohibido el maltrato, violencia y segregación a cualquier persona de la comunidad por parte de las autoridades o entre la misma comunidad en cualquier forma de distinción, exclusión o restricción que se encuentre basada en el origen étnico o nacional, color de piel, apariencia física, cultura, sexo, género, edad, discapacidad, condición social o económica, condiciones de salud, embarazo, lengua, religión, opiniones, preferencias sexuales, estado civil, situación migratoria, situación familiar, antecedentes penales, responsabilidades familiares o cualquier otra que tenga por objeto impedir o anular el reconocimiento o el ejercicio de los derechos humanos laborales, escolares de la comunidad, o impida la igualdad real de oportunidades.</p>
                    <a href="https://www.tecnm.mx/dir_calidad/gestion_igualdad/TECNM-GIG-PO-01.pdf?a=37" target="_blank" class="text-primary break-word small font-monospace text-decoration-none">https://www.tecnm.mx/dir_calidad/gestion_igualdad/TECNM-GIG-PO-01.pdf?a=37</a>
                </div>

                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>2.- Un Código de Ética de la Administración Pública Federal</strong>, que tiene por objeto establecer los principios, valores, reglas de integridad y compromisos que deben ser conocidos y aplicados por todas las personas servidoras públicas, para propiciar ambientes laborales adecuados, fomentar su actuación ética y responsable, y erradicar conductas que representen actos de corrupción; así como establecer las obligaciones y mecanismos institucionales para la implementación del Código de ética, así como las instancias para denunciar su incumplimiento.</p>
                    <a href="https://www.dof.gob.mx/nota_detalle.php?codigo=5642176&fecha=08/02/2022#gsc.tab=0" target="_blank" class="text-primary break-word small font-monospace text-decoration-none">https://www.dof.gob.mx/nota_detalle.php?codigo=5642176&fecha=08/02/2022#gsc.tab=0</a>
                </div>

                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>3.- Un Código de Conducta del Tecnológico Nacional de México</strong>, que contiene un catálogo de conductas éticas que orientan la actuación de las personas, a fin de que se conduzcan en su quehacer cotidiano bajo los estatutos de profesionalismo, honradez, lealtad, imparcialidad, integridad, rendición de cuentas, eficacia y eficiencia.</p>
                    <a href="https://www.tecnm.mx/archivos/anexos/TecNM_GIG_CC_01_Codigo_de_Conducta_del_TecNM_2023.pdf?pdf=000000" target="_blank" class="text-primary break-word small font-monospace text-decoration-none">https://www.tecnm.mx/archivos/anexos/TecNM_GIG_CC_01_Codigo_de_Conducta_del_TecNM_2023.pdf?pdf=000000</a>
                </div>

                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-2"><strong>4.- Un Reglamento de Estudiantes del Tecnológico Nacional de México</strong>, que tiene por objeto establecer los derechos y obligaciones de la comunidad estudiantil, así como regular las conductas prohibidas, el procedimiento sancionador, el recurso de revisión y su interpretación.</p>
                    <a href="https://www.tecnm.mx/dir_calidad/gestion_igualdad/Reglamento_de_Estudiantes_del_TecNM.pdf?a=37" target="_blank" class="text-primary break-word small font-monospace text-decoration-none">https://www.tecnm.mx/dir_calidad/gestion_igualdad/Reglamento_de_Estudiantes_del_TecNM.pdf?a=37</a>
                </div>

                <div class="p-3 bg-light border rounded shadow-sm">
                    <p class="mb-3"><strong>5.- Un Comité de Ética y de Prevención de Conflictos de Interés (CEPCI) a nivel central</strong>, conformado por personas integrantes de la comunidad educativa en los puestos de Presidencia (y su suplente), Secretaria Ejecutiva (y su suplente), Secretaria Técnica (y su suplente), Persona consejera (para casos de acoso y hostigamiento sexual), Persona asesora (para casos de discriminación y acoso laboral), y tres Miembros propietarios (y sus suplentes). El Comité se rige de acuerdo con los siguientes protocolos para atender denuncias de acoso y hostigamiento sexual y actos de discriminación y acoso laboral, que impliquen a personal docente-docente, docente- administrativo, administrativo-administrativo, estudiante-docente, y estudiante-administrativo:</p>
                    
                    <ul class="ps-3 mb-0" style="list-style-type: disc;">
                        <li class="mb-2">
                            Protocolo para la prevención, atención y sanción del hostigamiento y acoso sexuales. <br>
                            <a href="https://www.tecnm.mx/dir_personal/cepci/lineamientos/DOF-PROTOCOLO%20HS%20AS.pdf" target="_blank" class="text-primary small font-monospace">https://www.tecnm.mx/dir_personal/cepci/lineamientos/DOF-PROTOCOLO%20HS%20AS.pdf</a>
                        </li>
                        <li class="mb-2">
                            Protocolo de actuación de los comités de ética para la atención de denuncias y la prevención de actos de discriminación. <br>
                            <a href="https://www.tecnm.mx/dir_personal/cepci/lineamientos/DOF%20Protocolo%20de%20Actuacion%20de%20Atencion%20a%20denuncias.pdf" target="_blank" class="text-primary small font-monospace">https://www.tecnm.mx/dir_personal/cepci/lineamientos/DOF%20Protocolo%20de%20Actuacion%20de%20Atencion%20a%20denuncias.pdf</a>
                        </li>
                        <li>
                            Manual de atención de denuncias de los comités de ética <br>
                            <a href="https://www.tecnm.mx/dir_personal/cepci/lineamientos/Manual_de_atencion_de_denuncias_en_los_CE.pdf" target="_blank" class="text-primary small font-monospace">https://www.tecnm.mx/dir_personal/cepci/lineamientos/Manual_de_atencion_de_denuncias_en_los_CE.pdf</a>
                        </li>
                    </ul>
                </div>

            </div>

            <p class="mt-4 mb-3">
                En el caso de denuncias que involucran conflictos entre estudiantes, el Reglamento de estudiantes establece que el Comité Académico (en licenciatura), el Consejo de Posgrado (en maestría) o el Claustro Doctoral (en doctorado) son los órganos colegiados que conocerán las posibles faltas o conductas prohibidas de las/los estudiantes y propondrán las sanciones a el/la Directora/a, una vez hayan documentado y analizado las evidencias del hecho y el expediente de las o los estudiantes involucrados, sostenido una audiencia con las/los involucrados, y analizado las evidencias y pruebas presentadas para emitir la propuesta de sanción.
            </p>

            <p>
                Con el objeto de prevenir todo tipo de violencia, la Coordinación del Sistema de Igualdad Laboral y No Discriminación, con el apoyo del Comité de ética y prevención de conflictos de interés y el Departamento de Comunicación y Difusión, mantienen programas de divulgación constante de la existencia del Sistema de Igualdad y del Subcomité, así como de temas relacionados con la igualdad laboral, igualdad de género, prevención de la violencia, derechos humanos, a través de la página web, redes sociales y carteles en los lugares más visibles y concurridos de la institución, así como la organización de cursos, conferencias y eventos especiales (Día de la Mujer, Día de la Mujer y la Niña en la Ciencia, 16 días de activismo por el Día Internacional de la eliminación de la violencia contra la mujer), convocatorias a portar vestimenta color naranja los Días Naranja (25 de cada mes), entre otros. Cabe mencionar que la institución mantiene una colaboración constante con el Instituto Municipal de las Mujeres de Veracruz (INMUVER) para los eventos de promoción y sensibilización en estos temas.
            </p>

        </div>`;
}

function renderPlaceholderHTML(nombre) {
    return `<div class="animate-fade-in py-5 text-center"><h3>${nombre}</h3><p>Contenido en fase de actualización.</p></div>`;
}

function renderFullPageSintesis() {
    return `<div style="min-height: 75vh;" class="py-5 text-center"><h2>Síntesis del Plan de Estudios</h2></div>`;
}

// Funciones stub para las demás secciones
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