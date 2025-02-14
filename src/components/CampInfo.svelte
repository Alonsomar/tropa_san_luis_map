<script>
  import { campStore } from '../stores/campData';
  import Photobook from './Photobook.svelte';
  import { fade } from 'svelte/transition';

  $: selectedCamp = $campStore.selectedCamp;
  let campImages = [];
  let loading = false;

  async function fetchCampImages(campId) {
    loading = true;
    try {
      const response = await fetch(`/api/campamento-imagenes/${campId}`);
      const data = await response.json();
      campImages = data.images;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      campImages = [];
    }
    loading = false;
  }

  $: if (selectedCamp) {
    fetchCampImages(selectedCamp.id);
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
    {#if loading}
      <div class="loading">Cargando imágenes...</div>
    {:else}
      <Photobook images={campImages} />
    {/if}
  {:else}
    <div class="placeholder">
      <p>Selecciona un campamento en la línea de tiempo o en el mapa para ver su información</p>
    </div>
  {/if}
</div>

<style>
  .camp-info {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.8rem;
  }

  h3 {
    margin: 0.5rem 0;
    color: var(--text-secondary);
    font-size: 1.2rem;
  }

  p {
    margin: 1rem 0 0;
    line-height: 1.6;
    color: var(--text-primary);
  }

  .placeholder {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    color: var(--text-secondary);
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-style: italic;
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
      font-size: 1.1rem;
    }
  }
</style>
