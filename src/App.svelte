<script>
  import { onMount } from 'svelte';
  import Timeline from './components/Timeline.svelte';
  import Map from './components/Map.svelte';
  import CampInfo from './components/CampInfo.svelte';
  import { campStore } from './stores/campData';

  let headerVisible = true;
  let lastScrollY = 0;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    headerVisible = currentScrollY <= lastScrollY || currentScrollY < 50;
    lastScrollY = currentScrollY;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<main>
  <header class:hidden={!headerVisible}>
    <h1>Campamentos de la Tropa San Luis</h1>
    <p class="subtitle">
      Explora la historia de nuestros campamentos desde 1953 hasta la actualidad. 
      Cada punto en esta línea del tiempo representa una aventura, un momento de aprendizaje 
      y una historia que contar.
    </p>
  </header>

  <div class="content" class:header-hidden={!headerVisible}>
    <section class="timeline-section">
      <Timeline />
    </section>

    <section class="map-section">
      <Map />
      {#if $campStore.selectedCamp}
        <div class="info-overlay">
          <CampInfo />
        </div>
      {/if}
    </section>
  </div>
</main>

<style>
  main {
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    background: var(--background-color);
  }

  header {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding: 2rem;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    height: auto;
    opacity: 1;
    transform: translateY(0);
  }

  header.hidden {
    height: 0;
    opacity: 0;
    transform: translateY(-100%);
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  h1 {
    font-size: 3.5rem;
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
    font-size: 1.2rem;
    color: var(--accent-color);
    max-width: 800px;
    margin: 2rem auto 0;
    line-height: 1.6;
    opacity: 0.8;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1600px;
    margin: 0 auto;
    height: calc(100vh - 250px);
    transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .content.header-hidden {
    height: calc(100vh - 50px);
  }

  .timeline-section {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .map-section {
    position: relative;
    height: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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

  @media (max-width: 1200px) {
    .content {
      grid-template-columns: 1fr;
      height: auto;
    }

    .timeline-section,
    .map-section {
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