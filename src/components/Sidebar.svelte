<script>
  import { campStore } from '../stores/campData';

  export let currentDecade;
  export let onDecadeSelect;

  $: decades = [...new Set($campStore.camps.map(camp => 
    Math.floor(parseInt(camp.año) / 10) * 10
  ))].sort();

  function handleDecadeClick(decade) {
    onDecadeSelect(decade);
  }
</script>

<aside class="sidebar">
  <nav>
    {#each decades as decade}
      <button
        class="decade-button"
        class:active={currentDecade === decade}
        on:click={() => handleDecadeClick(decade)}
      >
        <span class="decade-dot"></span>
        <span class="decade-label">{decade}s</span>
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 120px;
    background: none;
    border-right: 1px solid var(--gray-200);
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 2rem 0;
    z-index: 1000;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .decade-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    transition: all 0.3s ease;
  }

  .decade-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gray-300);
    transition: all 0.3s ease;
  }

  .decade-label {
    font-size: 0.9rem;
    color: var(--gray-500);
    transition: all 0.3s ease;
  }

  .decade-button:hover .decade-dot,
  .decade-button.active .decade-dot {
    background: var(--primary-color);
    transform: scale(1.5);
  }

  .decade-button:hover .decade-label,
  .decade-button.active .decade-label {
    color: var(--primary-color);
    font-weight: 600;
  }
</style> 