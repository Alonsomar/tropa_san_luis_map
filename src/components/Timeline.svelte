<script>
  import { onMount } from 'svelte';
  import { campStore } from '../stores/campData';
  import * as d3 from 'd3';

  // Props
  export let height = '100%';
  export let width = '80%';

  let timelineContainer;
  let selectedYear = null;
  let visibleYears = new Set();

  // Ordenar campamentos por año y agrupar por década
  $: sortedCamps = $campStore.camps.sort((a, b) =>
    parseInt(a.año) - parseInt(b.año)
  );

  $: decades = sortedCamps.reduce((acc, camp) => {
    const decade = Math.floor(parseInt(camp.año) / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(camp);
    return acc;
  }, {});

  function selectCamp(camp) {
    selectedYear = camp.año;
    campStore.selectCamp(camp);
  }

  // Calcular todas las décadas desde 1950 hasta la actualidad
  function getAllDecades() {
    const startDecade = 1950; // Para incluir la fundación en 1952
    const currentYear = new Date().getFullYear();
    const endDecade = Math.floor(currentYear / 10) * 10;

    let decades = [];
    for (let decade = startDecade; decade <= endDecade; decade += 10) {
      decades.push(decade);
    }
    return decades;
  }

  $: allDecades = getAllDecades();

  // Modificar el cálculo de posición para alinear todo correctamente
  function getRelativePosition(año) {
    const startYear = 1950;
    return ((parseInt(año) - startYear) * 120); // Espaciado de 120px por año
  }

  function getTimelineHeight() {
    const currentYear = new Date().getFullYear();
    const years = currentYear - 1950;
    return `${(years * 120) + 600}px`; // Ajuste de padding
  }

  // Posición de los campamentos dentro de cada década
  function getCampPosition(campYear, decadeYear) {
    return (parseInt(campYear) - parseInt(decadeYear)) * 120;
  }

  // Agrupar campamentos por década
  function getCampsInDecade(decade) {
    return sortedCamps.filter(camp => {
      const campDecade = Math.floor(parseInt(camp.año) / 10) * 10;
      return campDecade === decade;
    });
  }

  // Agregar año de fundación
  const TROPA_INICIO = 1952;
  const fundacionEvent = {
    año: TROPA_INICIO,
    lugar: "Fundación de la Tropa San Luis",
    tipo: "fundacion"
  };

  onMount(() => {
    // Observer para los pasos del timeline (ya existía)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const year = entry.target.dataset.year;
        if (entry.isIntersecting) {
          visibleYears = new Set([...visibleYears, year]);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.timeline-step').forEach(el => {
      observer.observe(el);
    });

    // --- Generar las tres líneas de la timeline con un sutil "ruido" ---
    // Asumimos que timelineContainer es el div con clase "timeline-container"
    // Y que dentro del contenedor de la línea tenemos el SVG que ahora tiene la clase "timeline-lines"
    const svgLines = document.querySelector('.timeline-line-container .timeline-lines');
    // Usamos el alto del contenedor (puedes ajustar si es necesario)
    const containerHeight = timelineContainer.clientHeight;
    const svgWidth = 20; // ancho arbitrario para dibujar las líneas
    const svgHeight = containerHeight;
    svgLines.setAttribute('width', svgWidth);
    svgLines.setAttribute('height', svgHeight);
    svgLines.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    // Usamos D3 para generar las líneas. Usamos una línea base vertical.
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    // Configuraciones para las tres líneas:
    const lineConfigs = [
      { baseline: 3, color: '#f13232', amplitude: 1.5, frequency: 0.02, phase: Math.random() * Math.PI * 2 },
      { baseline: 6, color: '#d42020', amplitude: 1.6, frequency: 0.018, phase: Math.random() * Math.PI * 7 },
    ];

    // Generamos datos de puntos a intervalos regulares
    const points = d3.range(0, svgHeight + 1, 5).map(y => ({ y }));

    // Para cada configuración, generar la línea
    lineConfigs.forEach(config => {
      const lineData = points.map(p => {
        const jitter = (Math.random() - 0.5) * 0.5; // jitter sutil
        return {
          x: config.baseline + config.amplitude * Math.sin(config.frequency * p.y + config.phase) + jitter,
          y: p.y
        };
      });
      d3.select(svgLines)
        .append('path')
        .attr('d', lineGenerator(lineData))
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', 1.6);
    });

    return () => observer.disconnect();
  });
</script>

<div class="timeline-container" bind:this={timelineContainer} style="height: {height}; width: {width};">
  <div class="timeline-wrapper" style="min-height: {getTimelineHeight()};">
    <div class="timeline-line-container">
      <!-- Reemplazamos la línea original por un SVG para las 3 líneas -->
      <svg class="timeline-lines"></svg>
    </div>
    
    <!-- Evento de Fundación -->
    <div 
      class="timeline-step fundacion visible"
      style="top: {getRelativePosition(1952)}px"
    >
      <div class="timeline-point fundacion"></div>
      <div class="timeline-content fundacion">
        <div class="year-badge fundacion">{TROPA_INICIO}</div>
        <h4>Fundación de la Tropa San Luis</h4>
        <p class="fundacion-text">Inicio de una gran aventura</p>
      </div>
    </div>

    <!-- Décadas -->
    {#each allDecades as decade}
      <div 
        class="decade-marker" 
        data-decade={decade} 
        style="top: {getRelativePosition(decade)}px"
      >
        <div 
          class="decade-background" 
          style="top: {getCampPosition(decade + 5, decade)}px"
        >
          {decade}s
        </div>
        <div class="decade-header">
          <span class="decade-year">{decade}s</span>
          <div class="decade-line"></div>
        </div>
        
        <!-- Campamentos de esta década -->
        {#each getCampsInDecade(decade) as camp, index}
          <div 
            class="timeline-step"
            class:active={selectedYear === camp.año}
            class:visible={visibleYears.has(camp.año)}
            class:right={index % 2 === 0}
            style="top: {getCampPosition(camp.año, decade)}px"
            data-year={camp.año}
            on:click={() => selectCamp(camp)}
            on:keydown={e => e.key === 'Enter' && selectCamp(camp)}
            tabindex="0"
            role="button"
            aria-label="Campamento en {camp.lugar} del año {camp.año}"
          >
            <div class="timeline-point"></div>
            <div class="timeline-content">
              <div class="year-badge">{camp.año}</div>
              <h4>{camp.lugar}</h4>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .timeline-container {
    position: relative;
    z-index: 1000;
    overflow-y: auto;
    padding: 2rem;
    border-radius: 12px;
    height: 100%;
    backdrop-filter: blur(3px);
    background: rgba(255, 255, 255, 0.1);
  }

  .timeline-wrapper {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 0;
  }

  .timeline-line-container {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    /* Conservamos el ancho original para la posición, aunque el SVG interno tenga ancho mayor */
    width: 6px;
    transform: translateX(-50%);
  }

  /* Eliminamos el estilo original de .timeline-line, pues ahora usamos el SVG */

  .timeline-step {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
    height: 80px;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    filter: blur(10px);
    display: flex;
    align-items: center;
    z-index: 1; 
  }

  .timeline-step.visible {
    opacity: 1;
    filter: blur(0);
  }

  .timeline-point {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    border: 4px solid white;
    box-shadow: 0 0 0 6px rgba(2, 123, 168, 0.2); 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
  }

  .timeline-point.fundacion {
    width: 24px;
    height: 24px;
    background: white;
    border: 4px solid var(--primary-color);
    box-shadow: 0 0 0 8px rgba(241, 50, 50, 0.1);
  }

  .timeline-content {
    position: absolute;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: calc(50% - 60px);
    transition: all 0.3s ease;
  }

  .timeline-content.fundacion {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
  }

  .timeline-step.right .timeline-content {
    left: calc(50% + 40px);
  }

  .timeline-step:not(.right) .timeline-content {
    right: calc(50% + 40px);
  }

  .year-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: var(--secondary-color); /* Utilizamos el color secundario (rojo) */
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .year-badge.fundacion {
    background: white;
    color: var(--primary-color);
  }

  .timeline-content h4 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .timeline-content p {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .fundacion-text {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  /* Estilos para las líneas de las décadas y demás elementos del timeline */
  .decade-background {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    background: repeating-linear-gradient(
      45deg,
      rgba(241, 50, 50, 0.03),
      rgba(241, 50, 50, 0.03) 10px,
      transparent 10px,
      transparent 20px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.7;
    font-size: 0;
  }

  .decade-marker {
    position: absolute;
    width: 100%;
    z-index: 1;
  }

  .decade-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }

  .decade-year {
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    background: var(--primary-color); /* Azul para las décadas */
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    min-width: 120px;
    text-align: center;
    position: relative;
    z-index: 3;
  }

  .decade-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(
      to right,
      var(--primary-color),
      transparent
    );
    opacity: 0.3;
  }

  /* Hover effects */
  .timeline-step:hover .timeline-point,
  .timeline-step.active .timeline-point {
    transform: translate(-50%, -50%) scale(1.3);
    background: var(--primary-light);
    box-shadow: 0 0 0 8px rgba(241, 50, 50, 0.1);
  }

  .timeline-step:hover .timeline-content,
  .timeline-step.active .timeline-content {
    transform: translateY(-50%) scale(1.02);
    box-shadow: var(--card-shadow-hover);
  }

  @media (max-width: 768px) {
    .timeline-wrapper {
      padding: 2rem 1rem;
    }

    .timeline-content {
      width: calc(100% - 80px) !important;
      left: 60px !important;
      right: auto !important;
      text-align: left !important;
    }

    .year-badge {
      font-size: 0.65rem;
    }

    .decade-year {
      font-size: 1rem;
      padding: 0.2rem 0.5rem;
    }
  }
</style>
