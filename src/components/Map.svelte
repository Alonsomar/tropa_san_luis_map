<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { campStore } from '../stores/campData';

  let mapContainer;
  let camps = [];

  $: camps = $campStore.camps; // Obtener campamentos del store

  async function drawMap() {
    const width = 800;
    const height = 800;
    const projection = d3.geoMercator().scale(800).center([-60, -35]);
    const path = d3.geoPath().projection(projection);

    const svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Cargar mapa base de Chile
    const response = await fetch('https://raw.githubusercontent.com/caracena/chile-geojson/refs/heads/master/regiones.json');
    const geoData = await response.json();

    svg.append('g')
      .selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#cccccc')
      .attr('stroke', '#333333');

    // Agregar puntos de campamentos
    const points = svg.append('g')
      .selectAll('circle')
      .data(camps)
      .enter()
      .append('circle')
      .attr('cx', d => projection([d.lng, d.lat])[0])
      .attr('cy', d => projection([d.lng, d.lat])[1])
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  }

  onMount(drawMap);
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100%;"></div>
