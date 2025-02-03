<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { campStore } from '../stores/campData';
  import regionesData from '../../data/regiones.json';

  let mapContainer;
  let camps = [];
  let geoData;
  let zoom; // Variable para el zoom de D3

  // Reactividad: actualiza "camps" y "selectedCamp" cuando cambia el store
  $: camps = $campStore.camps;
  // Usamos la sintaxis reactiva para tener la selección actualizada
  $: selectedCamp = $campStore.selectedCamp;

  async function drawMap() {
    // Usamos el tamaño real del contenedor o valores por defecto
    const width = mapContainer.clientWidth || 800;
    const height = mapContainer.clientHeight || 800;

    // Definir proyección y generador de caminos
    const projection = d3.geoMercator()
      .scale(800)
      .center([-60, -35]);
    const path = d3.geoPath().projection(projection);

    // Crear el SVG y el grupo principal
    const svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const g = svg.append('g');

    // Crear el tooltip para mostrar información de cada campamento
    const tooltip = d3.select(mapContainer)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(255,255,255,0.9)')
      .style('padding', '5px 10px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('font-size', '0.8rem')
      .style('opacity', 0);

    // Usar los datos geográficos (regiones de Chile)
    geoData = regionesData;

    // Dibujar las regiones con un estilo pastel y trazos suaves
    const regionsGroup = g.append('g')
      .attr('class', 'regions')
      .selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#eef6f7')
      .attr('stroke', '#c0d6df')
      .attr('stroke-width', 1);

    // Grupo para los marcadores (círculos)
    const markersGroup = g.append('g')
      .attr('class', 'markers');

    // Dibujar cada campamento con un círculo
    const markers = markersGroup.selectAll('circle')
      .data(camps, d => d.id)
      .join('circle')
      .attr('cx', d => projection([d.lng, d.lat])[0])
      .attr('cy', d => projection([d.lng, d.lat])[1])
      .attr('r', 0) // Comienza con radio 0 para efecto de aparición
      .attr('fill', '#f13232')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
         d3.select(this)
           .transition().duration(200)
           .attr('r', 8);
         tooltip.transition().duration(200).style('opacity', 0.9);
         tooltip.html(`<strong>${d.lugar}</strong><br/>Año: ${d.año}`)
           .style('left', (event.pageX + 10) + 'px')
           .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
         // Si este marcador NO es el seleccionado, vuelve a su radio normal
         if (!selectedCamp || selectedCamp.id !== d.id) {
           d3.select(this)
             .transition().duration(200)
             .attr('r', 5);
         }
         tooltip.transition().duration(200).style('opacity', 0);
      })
      .on('click', function(event, d) {
         // Si se hace click en el mismo marcador ya seleccionado, se deselecciona
         if (selectedCamp && selectedCamp.id === d.id) {
           campStore.reset(); // deselecciona
           markersGroup.selectAll('circle')
             .transition().duration(200)
             .attr('r', 5)
             .classed('selected', false);
         } else {
           const coords = projection([d.lng, d.lat]);
           zoomToLocation(svg, g, coords, width, height);
           campStore.selectCamp(d);
           // Marcar visualmente este marcador como seleccionado
           markersGroup.selectAll('circle')
             .classed('selected', false)
             .transition().duration(200)
             .attr('r', 5); // reinicia los no seleccionados
           d3.select(this)
             .classed('selected', true)
             .transition().duration(200)
             .attr('r', 9);
         }
      });

    // Transición de aparición de los marcadores (radio de 0 a 5)
    markers.transition().duration(1000)
      .attr('r', 5);

    // Configurar zoom y pan
    zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Panel de controles de navegación (opcional, si ya lo habíamos implementado)
    const controls = d3.select(mapContainer)
      .append('div')
      .attr('class', 'map-controls')
      .style('position', 'absolute')
      .style('bottom', '10px')
      .style('right', '10px')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('gap', '4px');

    controls.append('button')
      .attr('class', 'zoom-in')
      .text('+')
      .on('click', () => {
         svg.transition().duration(750)
            .call(zoom.scaleBy, 1.2);
      });
    controls.append('button')
      .attr('class', 'zoom-out')
      .text('–')
      .on('click', () => {
         svg.transition().duration(750)
            .call(zoom.scaleBy, 0.8);
      });
    controls.append('button')
      .attr('class', 'reset-button')
      .text('Reiniciar zoom')
      .on('click', () => {
         svg.transition().duration(750)
           .call(zoom.transform, d3.zoomIdentity);
      });
  }

  // Función para centrar y hacer zoom en la ubicación seleccionada
  function zoomToLocation(svg, g, coords, width, height) {
    const scale = 4; // Zoom deseado
    const translate = [
      width / 2 - scale * coords[0],
      height / 2 - scale * coords[1]
    ];
    svg.transition().duration(750)
       .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  onMount(() => {
    drawMap();
  });
</script>

<style>
  :host {
    position: relative;
  }

  :global(.tooltip) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  :global(.map-controls button) {
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 1rem;
  }

  /* Estilo para el marcador seleccionado */
  :global(.selected) {
    stroke: #fff;
    stroke-width: 3;
  }
</style>

<!-- El contenedor del mapa ocupa el 100% del espacio disponible -->
<div bind:this={mapContainer} style="width: 100%; height: 100%;"></div>
