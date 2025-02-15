<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  
  export let images = [];
  
  let showModal = false;
  let selectedImageIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let loadedImages = [];
  let loading = true;
  let modalElement;
  
  // Verificar qué imágenes existen realmente
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
    
    // Generar ángulos aleatorios solo para las imágenes que existen
    rotations = loadedImages.map(() => Math.random() * 10 - 5);
    loading = false;
  }
  
  let rotations = [];
  
  $: if (images.length > 0) {
    verifyImages();
  }
  
  function openModal(index) {
    selectedImageIndex = index;
    showModal = true;
    // Enfocar el modal para manejo de teclado
    setTimeout(() => modalElement?.focus(), 50);
  }
  
  function closeModal() {
    showModal = false;
  }
  
  function nextImage() {
    selectedImageIndex = (selectedImageIndex + 1) % loadedImages.length;
  }
  
  function prevImage() {
    selectedImageIndex = (selectedImageIndex - 1 + loadedImages.length) % loadedImages.length;
  }
  
  function handleKeydown(event) {
    if (!showModal) return;
    
    switch(event.key) {
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'Escape':
        closeModal();
        break;
      case 'Home':
        selectedImageIndex = 0;
        break;
      case 'End':
        selectedImageIndex = loadedImages.length - 1;
        break;
    }
  }
  
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }
  
  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
  }
  
  function handleTouchEnd() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
  }

  // Precargar la siguiente y anterior imagen
  $: if (showModal && loadedImages.length > 0) {
    const nextIdx = (selectedImageIndex + 1) % loadedImages.length;
    const prevIdx = (selectedImageIndex - 1 + loadedImages.length) % loadedImages.length;
    
    new Image().src = loadedImages[nextIdx];
    new Image().src = loadedImages[prevIdx];
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
          on:click={() => openModal(i)}
          on:keydown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openModal(i);
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

{#if showModal && loadedImages.length > 0}
  <div 
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-label="Visor de imágenes"
    bind:this={modalElement}
    tabindex="-1"
    transition:fade={{ duration: 200 }}
    on:click|self={closeModal}
    on:keydown={handleKeydown}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <button 
      class="nav-button prev" 
      on:click={prevImage}
      aria-label="Imagen anterior"
    >
      ←
    </button>
    
    <div class="modal-content">
      <img 
        src={loadedImages[selectedImageIndex]} 
        alt="Foto {selectedImageIndex + 1} del campamento"
        transition:fade={{duration: 150}}
      />
      <div class="image-counter" aria-live="polite">
        Imagen {selectedImageIndex + 1} de {loadedImages.length}
      </div>
    </div>
    
    <button 
      class="nav-button next" 
      on:click={nextImage}
      aria-label="Imagen siguiente"
    >
      →
    </button>
    
    <button 
      class="close-button" 
      on:click={closeModal}
      aria-label="Cerrar visor de imágenes"
    >
      ×
    </button>

    <div class="keyboard-instructions" aria-hidden="true">
      Use las flechas ← → para navegar, Esc para cerrar
    </div>
  </div>
{/if}

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

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.5);
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    font-size: 1.5rem;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .nav-button:hover,
  .nav-button:focus {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
  }

  .prev {
    left: 2rem;
  }

  .next {
    right: 2rem;
  }

  .close-button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .close-button:hover,
  .close-button:focus {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
  }

  .image-counter {
    position: absolute;
    bottom: -3rem;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .keyboard-instructions {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.5rem 1.5rem;
    border-radius: 1rem;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .loading, .no-images {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 768px) {
    .photobook-preview {
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.35rem;
    }

    .nav-button {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
    }

    .prev {
      left: 1rem;
    }

    .next {
      right: 1rem;
    }

    .keyboard-instructions {
      display: none;
    }
  }

  @media (hover: none) {
    .nav-button {
      background: rgba(255, 255, 255, 0.15);
    }
  }
</style>
