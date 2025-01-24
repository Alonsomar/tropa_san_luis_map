<script>
  import { campStore } from '../stores/campData';

  $: selectedCamp = $campStore.selectedCamp;
</script>

<div class="camp-info">
  {#if selectedCamp}
    <h2>{selectedCamp.lugar}</h2>
    <h3>Año: {selectedCamp.año}</h3>
    <p>{selectedCamp.descripcion}</p>
    {#if selectedCamp.imagenes && selectedCamp.imagenes.length > 0}
      <div class="images-container">
        {#each selectedCamp.imagenes as imagen}
          <img src={imagen} alt={`Campamento en ${selectedCamp.lugar}`} />
        {/each}
      </div>
    {/if}
  {:else}
    <div class="placeholder">
      <p>Selecciona un campamento en la línea de tiempo para ver su información</p>
    </div>
  {/if}
</div>

<style>
  .camp-info {
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 100%;
    overflow-y: auto;
  }

  h2 {
    color: var(--primary-color, #3498db);
    margin: 0 0 0.5rem 0;
  }

  h3 {
    color: #666;
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
  }

  .images-container {
    margin-top: 1rem;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #666;
  }
</style> 