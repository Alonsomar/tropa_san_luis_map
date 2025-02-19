<script>
  import { onMount } from 'svelte';
  import Timeline from './components/Timeline.svelte';
  import Map from './components/Map.svelte';
  import CampInfo from './components/CampInfo.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import { campStore } from './stores/campData';
  import CompassCursor from './components/CompassCursor.svelte';
  import ImageModal from './components/ImageModal.svelte';

  let currentDecade = null;

  function scrollToDecade(decade) {
    const element = document.querySelector(`[data-decade="${decade}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Add Font Awesome CSS
  onMount(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  });
</script>

<main>
  <CompassCursor />
  <ImageModal />
  <header>
    <div class="header-content">
      <div class="title-section">
        <h1>Campamentos de la Tropa San Luis</h1>
        <p class="subtitle">
          Explora la historia de nuestros campamentos desde 1953 hasta la actualidad. 
          Cada punto en esta línea del tiempo representa una aventura, un momento de aprendizaje 
          y una historia que contar.
        </p>
      </div>
      <div class="logo-social-section">
        <img src="../../data/fotos_stl/logo-nobackground.png" alt="Logo" class="logo" />
        <div class="social-icons">
          <a href="https://www.facebook.com/ScoutTropaSanLuis" target="_blank" aria-label="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="https://open.spotify.com/intl-es/artist/03fChLztihH4q9kkEzUw0n?si=VoYeiCQbSNitL9S6E9PchQ" target="_blank" aria-label="Spotify">
            <i class="fab fa-spotify"></i>
          </a>
          <a href="https://www.instagram.com/tropasanluis_stl/" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
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
    top: 0;
    z-index: 1000;
    padding: 1.5rem 2rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(3px);
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  header:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .title-section {
    flex: 1;
  }

  header h1 {
    font-size: 2.5rem;
    font-family: var(--title-font);
    color: var(--primary-color);
    margin: 0;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    text-align: left;
    transition: transform 0.3s ease;
  }

  header h1::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  header:hover h1::after {
    width: 100px;
  }

  .subtitle {
    color: var(--accent-color);
    margin: 1rem 0 0;
    line-height: 1.6;
    opacity: 0.9;
    font-size: 1rem;
    max-width: 600px;
  }

  .logo-social-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .logo {
    height: 80px;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  .social-icons {
    display: flex;
    gap: 1rem;
  }

  .social-icons a {
    color: var(--primary-color);
    font-size: 1.25rem;
    padding: 0.5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .social-icons a:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: var(--card-shadow-hover);
    overflow: auto;
    animation: slideIn 0.3s ease-out;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.05);
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
    header {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    header h1 {
      font-size: 2rem;
      text-align: center;
    }

    header h1::after {
      left: 50%;
      transform: translateX(-50%);
    }

    .subtitle {
      text-align: center;
      margin: 1rem auto 0;
      padding: 0;
    }

    .logo-social-section {
      flex-direction: column;
      gap: 1rem;
    }

    .logo {
      height: 60px;
    }
  }
</style> 