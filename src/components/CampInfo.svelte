<script>
  import { campStore } from '../stores/campData';
  import Photobook from './Photobook.svelte';
  import { fade } from 'svelte/transition';

  $: selectedCamp = $campStore.selectedCamp;
  let campImages = [];

  // Función para generar las rutas de las imágenes
  function generateImagePaths(campId) {
    const formattedId = String(campId).padStart(3, '0');
    // Generamos rutas para 5 posibles imágenes (el máximo mencionado)
    return Array.from({ length: 5 }, (_, i) => 
      `data/fotos_stl/id_${formattedId}/img_${i + 1}.jpg`
    );
  }

  $: if (selectedCamp) {
    campImages = generateImagePaths(selectedCamp.id);
  } else {
    campImages = [];
  }
</script>

<div class="camp-info" transition:fade={{ duration: 300 }}>
  {#if selectedCamp}
    <div class="info-card">
      <h2>{selectedCamp.lugar}</h2>
      <h3>Año: {selectedCamp.año}</h3>
      <p>{selectedCamp.descripcion}</p>
    </div>
    <Photobook images={campImages} />
  {:else}
    <div class="placeholder">
      <p>Selecciona un campamento en la línea de tiempo o en el mapa para ver su información</p>
    </div>
  {/if}
</div>

<style>
  .camp-info {
    padding: 0.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.8);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  h3 {
    margin: 0.5rem 0;
    color: var(--text-secondary);
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.9;
  }

  p {
    margin: 1rem 0 0;
    line-height: 1.6;
    color: var(--text-primary);
    font-size: 1rem;
    opacity: 0.95;
  }

  .placeholder {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    color: var(--text-secondary);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 768px) {
    .camp-info {
      padding: 0.5rem;
    }

    .info-card {
      padding: 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1rem;
    }
  }
</style>
