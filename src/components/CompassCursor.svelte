<script>
  import { onMount, onDestroy } from 'svelte';

  // Configuración simplificada del cursor
  const CURSOR_CONFIG = {
    size: 60,
    hideDelay: 500,
    colors: {
      primary: 'rgba(71, 85, 105, 0.85)',
      hover: 'rgba(14, 165, 233, 0.95)'
    }
  };

  let pointer;
  let isVisible = false;
  let isHovering = false;
  let hideTimeout;

  // Función simplificada de actualización de posición
  function updatePosition(x, y) {
    if (!pointer) return;
    pointer.style.transform = `translate3d(${x - CURSOR_CONFIG.size/2}px, ${y - CURSOR_CONFIG.size/2}px, 0)`;
  }

  // Manejadores de eventos optimizados
  function handleMouseMove(e) {
    updatePosition(e.clientX, e.clientY);
    
    if (!isVisible) {
      isVisible = true;
      pointer?.style.setProperty('opacity', '1');
    }

    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      isVisible = false;
      pointer?.style.setProperty('opacity', '0');
    }, CURSOR_CONFIG.hideDelay);
  }

  function handleMouseOver(e) {
    const isClickable = e.target.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    if (isClickable && !isHovering) {
      isHovering = true;
      pointer?.classList.add('hover');
    }
  }

  function handleMouseOut(e) {
    const isClickable = e.target.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    const relatedIsClickable = e.relatedTarget?.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    
    if (isClickable && !relatedIsClickable && isHovering) {
      isHovering = false;
      pointer?.classList.remove('hover');
    }
  }

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
  });

  onDestroy(() => {
    if (hideTimeout) clearTimeout(hideTimeout);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
  });
</script>

<svg 
  bind:this={pointer}
  id="compass-pointer"
  viewBox="0 0 60 60"
  width={CURSOR_CONFIG.size}
  height={CURSOR_CONFIG.size}
  aria-hidden="true"
>
  <g transform="translate(30,30)">
    {#each Array(4) as _, i}
      <polygon 
        class="arrow" 
        points="0,-24 -3,0 3,0"
        transform={`rotate(${i * 90})`}
      />
    {/each}
    
    <circle class="center-dot" cx="0" cy="0" r="1.5"/>
    
    <circle class="outer-circle" cx="0" cy="0" r="12" />
  </g>
</svg>

<style>
  :global(body) {
    cursor: none !important;
    -webkit-tap-highlight-color: transparent;
  }

  :global(a), :global(button), :global(.clickable), :global([data-cursor-hover]) {
    cursor: none !important;
  }

  #compass-pointer {
    --cursor-color: var(--primary-color, rgba(71, 85, 105, 0.85));
    --cursor-hover-color: var(--accent-color, rgba(14, 165, 233, 0.95));
    
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    z-index: 9999;
    transition: 
      opacity 0.3s ease,
      transform 0.1s ease;
    mix-blend-mode: exclusion;
  }

  .arrow,
  .center-dot {
    fill: var(--cursor-color);
    transition: fill 0.2s ease;
  }

  .outer-circle {
    fill: none;
    stroke: var(--cursor-color);
    stroke-width: 0.75;
    transition: 
      stroke 0.2s ease,
      transform 0.2s ease;
  }

  :global(#compass-pointer.hover) {
    --cursor-color: var(--cursor-hover-color);
    transform: scale(1.1);
  }

  :global(#compass-pointer.hover) .outer-circle {
    transform: scale(0.9);
  }
</style> 