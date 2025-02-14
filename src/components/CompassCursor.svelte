<script>
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';

  // Configuración del cursor
  const CURSOR_CONFIG = {
    size: 60,
    hideDelay: 1500,
    colors: {
      primary: 'rgba(71, 85, 105, 0.85)',   // Slate-600 con transparencia
      hover: 'rgba(14, 165, 233, 0.95)'     // Sky-500 con transparencia
    },
    zIndex: 9999,
    spring: {
      stiffness: 0.8,
      damping: 0.9
    }
  };

  // Estado del cursor usando springs para animaciones suaves
  const position = spring(
    { x: 0, y: 0 },
    CURSOR_CONFIG.spring
  );

  // Estado local
  let pointer;
  let pointerGroup;
  let isVisible = false;
  let isHovering = false;
  let hideTimeout;
  let lastPosition = { x: 0, y: 0 };

  // Gestión de eventos optimizada con RAF
  let rafId = null;
  const updatePosition = () => {
    if (!pointer) return;
    
    const { x, y } = $position;
    lastPosition = { x, y };

    // Aplicar transformación al contenedor principal para el movimiento
    pointer.style.transform = `translate3d(${x - CURSOR_CONFIG.size/2}px, ${y - CURSOR_CONFIG.size/2}px, 0)`;
    
    rafId = requestAnimationFrame(updatePosition);
  };

  // Gestores de eventos optimizados
  const handleMouseMove = (e) => {
    position.set({ x: e.clientX, y: e.clientY });
    
    if (!isVisible) {
      isVisible = true;
      pointer?.style.setProperty('opacity', '1');
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    hideTimeout = setTimeout(() => {
      isVisible = false;
      pointer?.style.setProperty('opacity', '0');
    }, CURSOR_CONFIG.hideDelay);
  };

  // Optimización de eventos de hover usando event delegation y bubbling
  const handleMouseOver = (e) => {
    const isClickable = e.target.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    if (isClickable && !isHovering) {
      isHovering = true;
      pointer?.classList.add('hover');
    }
  };

  const handleMouseOut = (e) => {
    const isClickable = e.target.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    const relatedIsClickable = e.relatedTarget?.closest('a, button, .clickable, [data-cursor-hover], [role="button"], input[type="button"], input[type="submit"], .nav-link, .btn, circle.camp-marker');
    
    if (isClickable && !relatedIsClickable && isHovering) {
      isHovering = false;
      pointer?.classList.remove('hover');
    }
  };

  // Lifecycle
  onMount(() => {
    // Inicializar posición
    const { innerWidth, innerHeight } = window;
    position.set({ x: innerWidth / 2, y: innerHeight / 2 });
    
    // Iniciar loop de animación
    rafId = requestAnimationFrame(updatePosition);

    // Event listeners con passive para mejor performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
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
  <defs>
    <filter id="cursor-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.25"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g 
    bind:this={pointerGroup}
    id="pointer-group" 
    transform="translate(30,30)"
    filter="url(#cursor-shadow)"
  >
    {#each Array(4) as _, i}
      <g 
        class="arrow-group" 
        transform={`rotate(${i * 90})`}
      >
        <g class="arrow-container">
          <polygon 
            class="arrow" 
            points="0,-24 -3,0 3,0"
          />
        </g>
      </g>
    {/each}
    
    <circle 
      class="center-dot" 
      cx="0" 
      cy="0" 
      r="1.5"
    />
    
    <g class="outer-dots">
      {#each Array(4) as _, i}
        <circle 
          class="outher-dot"
          class:dot1={i === 0}
          class:dot2={i === 1}
          class:dot3={i === 2}
          class:dot4={i === 3}
          cx="0" 
          cy="0" 
          r="12"
        />
      {/each}
    </g>
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
    transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 9999;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    mix-blend-mode: exclusion;
  }

  .arrow,
  .center-dot {
    fill: var(--cursor-color);
    stroke: var(--cursor-color);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
  }

  .outher-dot {
    fill: none;
    stroke: var(--cursor-color);
    stroke-width: 0.75;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.05));
  }

  .arrow-container {
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes ellipsePulse {
    0%, 100% { 
      transform: scale(1.3, 0.5) rotate(0deg);
    }
    50% { 
      transform: scale(0.5, 1.3) rotate(180deg);
    }
  }

  .outher-dot {
    animation: ellipsePulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  .dot1 { animation-delay: 0s; }
  .dot2 { animation-delay: 0.75s; }
  .dot3 { animation-delay: 1.5s; }
  .dot4 { animation-delay: 2.25s; }

  :global(#compass-pointer.hover) {
    --cursor-color: var(--cursor-hover-color);
    transform: scale(1.1);
  }

  :global(#compass-pointer.hover) .arrow-container {
    transform: scale(0.8);
  }

  :global(#compass-pointer.hover) .outher-dot {
    animation-play-state: paused;
    transform: scale(0.8);
    opacity: 0.8;
  }

  /* Asegurarse de que los elementos clickeables tengan el cursor correcto */
  :global(a), 
  :global(button), 
  :global(.clickable), 
  :global([data-cursor-hover]),
  :global([role="button"]),
  :global(input[type="button"]),
  :global(input[type="submit"]),
  :global(.nav-link),
  :global(.btn),
  :global(circle.camp-marker) {
    cursor: none !important;
  }

  @media (pointer: coarse) {
    #compass-pointer {
      display: none;
    }
  }
</style> 