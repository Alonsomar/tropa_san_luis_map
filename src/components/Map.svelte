<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { campStore } from '../stores/campData';

  let mapContainer;
  let svg;
  let projection;
  let path;
  
  // Dimensiones del mapa
  const width = 800;
  const height = 600;

  $: selectedCamp = $campStore.selectedCamp;

  onMount(async () => {
    // Configurar proyección del mapa
    projection = d3.geoMercator()
      .center([-70, -33]) // Centrado en Chile
      .scale(1000)
      .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    // Crear SVG
    svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    try {
      // Cargar datos geográficos de Chile (GeoJSON)
      const response = await fetch('data/Regional.geojson');
      const data = await response.json();
      
      // Dibujar el mapa
      svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'region')
        .attr('fill', '#ddd')
        .attr('stroke', '#fff');

      // Añadir puntos de campamentos
      updateCampPoints();
    } catch (error) {
      console.error('Error cargando el mapa:', error);
    }
  });

  function updateCampPoints() {
    // Limpiar puntos existentes
    svg.selectAll('.camp-point').remove();

    // Añadir nuevos puntos
    svg.selectAll('.camp-point')
      .data($campStore.camps)
      .enter()
      .append('circle')
      .attr('class', 'camp-point')
      .attr('cx', d => projection([d.coordenadas.lng, d.coordenadas.lat])[0])
      .attr('cy', d => projection([d.coordenadas.lng, d.coordenadas.lat])[1])
      .attr('r', d => d === selectedCamp ? 8 : 4)
      .attr('fill', d => d === selectedCamp ? '#ff0000' : '#3498db')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
  }

  // Actualizar puntos cuando cambia el campamento seleccionado
  $: if (svg && selectedCamp) {
    updateCampPoints();
  }
</script>

<div class="map-container" bind:this={mapContainer}>
</div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
  }

  :global(.region) {
    transition: fill 0.3s ease;
  }

  :global(.region:hover) {
    fill: #bbb;
  }

  :global(.camp-point) {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  :global(.camp-point:hover) {
    r: 8;
  }
</style> 