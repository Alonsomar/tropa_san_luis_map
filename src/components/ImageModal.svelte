<script>
  import { onMount } from 'svelte';
  import { modalStore, modalActions } from '../stores/modalStore';
  import { fade } from 'svelte/transition';

  let modalElement;
  let touchStartX = 0;
  let touchEndX = 0;

  function handleKeydown(event) {
    switch(event.key) {
      case 'ArrowRight':
        modalActions.next();
        break;
      case 'ArrowLeft':
        modalActions.prev();
        break;
      case 'Escape':
        modalActions.close();
        break;
      case 'Home':
        modalStore.update(s => ({ ...s, currentIndex: 0 }));
        break;
      case 'End':
        modalStore.update(s => ({ ...s, currentIndex: s.images.length - 1 }));
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
        modalActions.prev();
      } else {
        modalActions.next();
      }
    }
  }

  // Precargar imágenes
  $: if ($modalStore.isOpen && $modalStore.images.length > 0) {
    const nextIdx = ($modalStore.currentIndex + 1) % $modalStore.images.length;
    const prevIdx = ($modalStore.currentIndex - 1 + $modalStore.images.length) % $modalStore.images.length;
    
    new Image().src = $modalStore.images[nextIdx];
    new Image().src = $modalStore.images[prevIdx];
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $modalStore.isOpen}
  <div 
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    on:click|self={modalActions.close}
    on:keydown={() => {}}
    bind:this={modalElement}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label="Visor de imágenes"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <button 
      class="nav-button prev" 
      on:click={modalActions.prev}
      aria-label="Imagen anterior"
    >
      ←
    </button>
    
    <div class="modal-content">
      <img 
        src={$modalStore.images[$modalStore.currentIndex]} 
        alt="Foto {$modalStore.currentIndex + 1} de {$modalStore.images.length}"
        transition:fade={{duration: 150}}
      />
      <div class="image-counter" aria-live="polite">
        Imagen {$modalStore.currentIndex + 1} de {$modalStore.images.length}
      </div>
    </div>
    
    <button 
      class="nav-button next" 
      on:click={modalActions.next}
      aria-label="Imagen siguiente"
    >
      →
    </button>
    
    <button 
      class="close-button" 
      on:click={modalActions.close}
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
  .modal-backdrop {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
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

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 768px) {
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