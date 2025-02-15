<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { modalActions } from '../stores/modalStore';
  
  export let images = [];
  
  let loadedImages = [];
  let loading = true;
  let rotations = [];
  
  async function verifyImages() {
    loading = true;
    loadedImages = [];
    
    for (let img of images) {
      try {
        const response = await fetch(img, { method: 'HEAD' });
        if (response.ok) {
          loadedImages.push(img);
        }
      } catch (error) {
        console.log(`Image not found: ${img}`);
      }
    }
    
    rotations = loadedImages.map(() => Math.random() * 10 - 5);
    loading = false;
  }
  
  $: if (images.length > 0) {
    verifyImages();
  }
</script>

<div class="photobook-container" transition:slide={{ duration: 200 }}>
  {#if loading}
    <div class="loading" role="status" aria-live="polite">Cargando imágenes...</div>
  {:else if loadedImages.length === 0}
    <div class="no-images" role="status" aria-live="polite">No hay fotos disponibles para este campamento</div>
  {:else}
    <div class="photobook-preview" role="grid" aria-label="Galería de fotos del campamento">
      {#each loadedImages as img, i}
        <button 
          class="miniatura-button" 
          on:click={() => modalActions.open(loadedImages, i)}
          on:keydown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              modalActions.open(loadedImages, i);
            }
          }}
          style="--rotation: {rotations[i]}deg"
          aria-label="Ver foto {i + 1} de {loadedImages.length}"
        >
          <div class="miniatura-wrapper">
            <img 
              src={img} 
              alt="Foto {i + 1} del campamento" 
              class="miniatura"
              loading="lazy"
              on:error={() => {
                loadedImages = loadedImages.filter(image => image !== img);
                rotations = rotations.filter((_, index) => index !== i);
              }}
            />
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .photobook-container {
    margin-top: 0.5rem;
    padding: 0.5rem;
  }

  .photobook-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
    margin: -1rem;
    padding: 1rem;
  }

  .miniatura-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.3s ease;
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .miniatura-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    transform-style: preserve-3d;
  }

  .miniatura-button:focus {
    outline: none;
  }

  .miniatura-button:focus .miniatura-wrapper::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid var(--color-primary, #4a9eff);
    border-radius: 4px;
    pointer-events: none;
  }

  .miniatura {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    transform: rotate(var(--rotation));
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backface-visibility: hidden;
    transform-origin: center center;
    border: 2px solid white;
  }

  .miniatura-button:hover .miniatura,
  .miniatura-button:focus .miniatura {
    transform: rotate(0) scale(1.08);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  .loading, .no-images {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .photobook-preview {
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.35rem;
    }
  }
</style>
