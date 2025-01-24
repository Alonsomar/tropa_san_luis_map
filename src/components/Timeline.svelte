<script>
  import { onMount } from 'svelte';
  import { campStore } from '../stores/campData';

  // Props
  export let height = '100%';
  export let width = '100%';

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

  onMount(() => {
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

    // Observar cada elemento del timeline
    document.querySelectorAll('.timeline-step').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  });

  const TROPA_INICIO = 1952;
  
  // Calcular altura relativa basada en el año, comenzando desde 1952
  function getRelativePosition(año) {
    const startYear = TROPA_INICIO;
    const endYear = new Date().getFullYear();
    const totalYears = endYear - startYear;
    return ((parseInt(año) - startYear) * 100); // 200px por año
  }

  // Agregar año de fundación
  const fundacionEvent = {
    año: TROPA_INICIO,
    lugar: "Fundación de la Tropa San Luis",
    tipo: "fundacion"
  };

  // Ajustar el cálculo de altura para la línea de tiempo
  function getTimelineHeight() {
    if (!sortedCamps.length) return '200vh';
    const lastYear = Math.max(...sortedCamps.map(c => parseInt(c.año)));
    const years = lastYear - TROPA_INICIO;
    return `${(years * 100) + 600}px`; // 200px por año y más padding
  }
</script>

<div class="timeline-container" style="height: {height}; width: {width};">
  <div class="timeline-wrapper" style="min-height: {getTimelineHeight()};">
    <div class="timeline-background"></div>
    <div class="timeline-line-container">
      <div class="timeline-line"></div>
    </div>
    
    <!-- Evento de Fundación -->
    <div 
      class="timeline-step fundacion visible"
      style="top: 10px"
    >
      <div class="timeline-point fundacion"></div>
      <div class="timeline-content fundacion">
        <div class="year-badge fundacion">{TROPA_INICIO}</div>
        <h4>Fundación de la Tropa San Luis</h4>
        <p class="fundacion-text">Inicio de una gran aventura</p>
      </div>
    </div>

    <!-- Décadas -->
    {#each Object.entries(decades) as [decade, camps]}
      <div 
        class="decade-marker"
        style="top: {getRelativePosition(decade)}px"
      >
        <span class="decade-label">{decade}s</span>
        <div class="decade-line"></div>
      </div>
    {/each}

    <!-- Campamentos -->
    {#each sortedCamps as camp, index}
      <div 
        class="timeline-step"
        class:active={selectedYear === camp.año}
        class:visible={visibleYears.has(camp.año)}
        class:right={index % 2 === 0}
        style="top: {getRelativePosition(camp.año)}px"
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
</div>

<style>
  .timeline-container {
    position: relative;
    overflow-y: auto;
    padding: 2rem;
    background: var(--gray-100);
    border-radius: 12px;
    height: 100%;
  }

  .timeline-wrapper {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem;
  }

  .timeline-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, var(--gray-100) 0%, transparent 70%);
    pointer-events: none;
  }

  .timeline-line-container {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    transform: translateX(-50%);
  }

  .timeline-line {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--timeline-gradient);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(241, 50, 50, 0.2);
  }

  .timeline-step {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 120px;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    filter: blur(10px);
  }

  .timeline-step.visible {
    opacity: 1;
    filter: blur(0);
  }

  .timeline-point {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary-color);
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(241, 50, 50, 0.2);
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
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: var(--card-shadow);
    width: calc(50% - 4rem);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
  }

  .timeline-content.fundacion {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
  }

  .timeline-step.right .timeline-content {
    left: calc(50% + 3rem);
  }

  .timeline-step:not(.right) .timeline-content {
    right: calc(50% + 3rem);
    text-align: right;
  }

  .year-badge {
    display: inline-block;
    background: var(--primary-light);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    box-shadow: 0 2px 4px rgba(241, 50, 50, 0.2);
  }

  .year-badge.fundacion {
    background: white;
    color: var(--primary-color);
  }

  .timeline-content h4 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .fundacion-text {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .decade-marker {
    position: absolute;
    left: 0;
    width: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .decade-label {
    position: absolute;
    left: -100px;
    background: var(--gray-200);
    padding: 0.4rem 1rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: var(--text-color);
    font-weight: 600;
    transform: translateY(-50%);
    box-shadow: var(--card-shadow);
    
  }

  .decade-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: var(--gray-300);
    opacity: 0.5;
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
      width: calc(100% - 100px);
      left: 80px !important;
      right: auto !important;
      text-align: left !important;
    }

    .decade-label {
      left: 0;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
  }
</style> 