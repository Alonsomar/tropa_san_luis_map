<script>
  import { onMount } from 'svelte';
  import Timeline from './components/Timeline.svelte';
  import Map from './components/Map.svelte';
  import CampInfo from './components/CampInfo.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import { campStore } from './stores/campData';
  import CompassCursor from './components/CompassCursor.svelte';

  let currentDecade = null;

  function scrollToDecade(decade) {
    const element = document.querySelector(`[data-decade="${decade}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<main>
  <CompassCursor />
  <header>
    <h1>Campamentos de la Tropa San Luis</h1>
    <p class="subtitle">
      Explora la historia de nuestros campamentos desde 1953 hasta la actualidad. 
      Cada punto en esta línea del tiempo representa una aventura, un momento de aprendizaje 
      y una historia que contar.
    </p>
  </header>

  <div class="content-wrapper">
    <Sidebar {currentDecade} onDecadeSelect={scrollToDecade} />
    
    <div class="main-content">
      <div class="timeline-section">
        <Timeline bind:currentDecade />
      </div>
      
      <div class="fixed-section">
        <div class="map-container">
          <Map />
          {#if $campStore.selectedCamp}
            <div class="info-overlay">
              <CampInfo />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
    background: var(--background-color);
  }

  header {
    position: relative;
    z-index: 1000; /* Por encima del mapa */
    padding: 4rem 2rem;
    text-align: center;
    border-bottom: 1px solid var(--gray-200);
    backdrop-filter: blur(3px);
    background: rgba(255, 255, 255, 0.1);
  }

  header h1 {
    font-family: var(--title-font);
    color: var(--primary-color); /* Color principal: azul */
    margin-bottom: 1.5rem;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  header h1::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 2px;
  }

  .subtitle {
    color: var(--accent-color); /* Usamos el acento oscuro para el texto secundario */
    max-width: 800px;
    margin: 2rem auto 0;
    line-height: 1.6;
    opacity: 0.8;
  }

  .content-wrapper {
    display: flex;
    position: relative;
  }

  .main-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .timeline-section {
    position: relative;
    z-index: 1000;
  }

  .fixed-section {
    position: sticky;
    top: 2rem;
    height: calc(100vh - 4rem);
  }

  .map-container {
    background: none;
    border-radius: 12px;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .info-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 300px;
    max-height: calc(100% - 2rem);
    background: white;
    border-radius: 8px;
    box-shadow: var(--card-shadow-hover);
    overflow: auto;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    position: relative;
  }

  h1::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 2px;
  }

  .subtitle {
    color: var(--accent-color);
    max-width: 800px;
    margin: 2rem auto 0;
    line-height: 1.6;
    opacity: 0.8;
  }

  @media (max-width: 1200px) {
    .content-wrapper {
      flex-direction: column;
    }

    .main-content {
      grid-template-columns: 1fr;
    }

    .timeline-section,
    .fixed-section {
      height: 70vh;
    }

    .info-overlay {
      width: calc(100% - 2rem);
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .subtitle {
      font-size: 1rem;
      padding: 0 1rem;
    }
  }
</style> 