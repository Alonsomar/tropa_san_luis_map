<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { campStore } from '../stores/campData';
  import regionesData from '../../data/regiones.json';

  let mapContainer;
  let camps = [];
  let geoData;
  let zoom; // D3 zoom
  let initialTransform;

  // Variables globales para acceder al SVG, grupo principal, etc.
  let svg, g, markersGroup, projection;

  // Reactividad: obtenemos la lista de campamentos y el campamento seleccionado
  $: camps = $campStore.camps;
  $: selectedCamp = $campStore.selectedCamp;

  async function drawMap() {
    const width = mapContainer.clientWidth || 800;
    const height = mapContainer.clientHeight || 800;

    // Configurar la proyección y el generador de caminos
    projection = d3.geoMercator()
      .scale(800)
      .center([-60, -35]);
    const path = d3.geoPath().projection(projection);

    // Crear el SVG y el grupo principal
    svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    g = svg.append('g');

    // Crear el tooltip (igual que antes)
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

    // Cargar los datos geográficos
    geoData = regionesData;

    // Dibujar las regiones
    g.append('g')
      .attr('class', 'regions')
      .selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#f4f5d1')
      .attr('stroke', '#01577b')
      .attr('stroke-width', .4);

    // Crear el grupo para los marcadores y guardarlo globalmente
    markersGroup = g.append('g')
      .attr('class', 'markers');

    const markers = markersGroup.selectAll('circle')
      .data(camps, d => d.id)
      .join('circle')
      .attr('cx', d => projection([d.lng, d.lat])[0])
      .attr('cy', d => projection([d.lng, d.lat])[1])
      .attr('r', 0) // Efecto de aparición
      .attr('fill', '#f13232')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('class', 'clickable camp-marker')
      .on('mouseover', function(event, d) {
         d3.select(this)
           .transition().duration(200)
           .attr('r', 8);
         tooltip.transition().duration(200).style('opacity', 0.9);
         tooltip.html(`<strong>${d.lugar}</strong><br/>Año: ${d.año}`)
           .style('left', (event.clientX + 10) + 'px')
           .style('top', (event.clientY - 28) + 'px');
      })
      .on('mouseout', function(event, d) {
         if (!selectedCamp || selectedCamp.id !== d.id) {
           d3.select(this)
             .transition().duration(200)
             .attr('r', 5);
         }
         tooltip.transition().duration(200).style('opacity', 0);
      })
      .on('click', function(event, d) {
         if (selectedCamp && selectedCamp.id === d.id) {
           campStore.reset();
           markersGroup.selectAll('circle')
             .transition().duration(200)
             .attr('r', 5)
             .classed('selected', false);
         } else {
           const coords = projection([d.lng, d.lat]);
           zoomToLocation(svg, g, coords, width, height);
           campStore.selectCamp(d);
           markersGroup.selectAll('circle')
             .classed('selected', false)
             .transition().duration(200)
             .attr('r', 5);
           d3.select(this)
             .classed('selected', true)
             .transition().duration(200)
             .attr('r', 9);
         }
      });

    markers.transition().duration(1000)
      .attr('r', 5);

    // Configurar D3 Zoom y deshabilitar el zoom por scroll
    zoom = d3.zoom()
      .scaleExtent([1, 8])
      .filter(event => event.type !== "wheel")
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // **Configurar la posición inicial del mapa:**
    const defaultScale = 1; // Escala inicial (ajústala si lo deseas)
    const targetX = width * 0.75;  // Queremos que el punto central se ubique al 75% del ancho (lado derecho)
    const targetY = height / 2;      // Centrado verticalmente
    // Usamos como referencia el centro de la proyección ([-60, -35])
    const defaultCoords = projection([-60, -35]);
    const initialTranslate = [
      targetX - defaultScale * defaultCoords[0],
      targetY - defaultScale * defaultCoords[1]
    ];
    initialTransform = d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(defaultScale);
    svg.call(zoom.transform, initialTransform);

    // Panel de controles de zoom, con z-index alto para la interactividad
    const controls = d3.select(mapContainer)
      .append('div')
      .attr('class', 'map-controls')
      .style('position', 'absolute')
      .style('bottom', '10px')
      .style('right', '10px')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('gap', '4px')
      .style('z-index', 10);

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
           .call(zoom.transform, initialTransform);
      });
  }

  function zoomToLocation(svg, g, coords, width, height) {
    const scale = 4;
    const targetX = width * 0.75;  // Queremos que el punto quede en el 75% del ancho
    const targetY = height / 2;      // Centrado verticalmente
    const translate = [
      targetX - scale * coords[0],
      targetY - scale * coords[1]
    ];
    svg.transition().duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  // Bloque reactivo para centrar el zoom al cambiar la selección
  $: if (selectedCamp && svg && g) {
    const width = mapContainer.clientWidth || 800;
    const height = mapContainer.clientHeight || 800;
    const coords = projection([selectedCamp.lng, selectedCamp.lat]);
    zoomToLocation(svg, g, coords, width, height);
    markersGroup.selectAll('circle')
      .classed('selected', d => selectedCamp && d.id === selectedCamp.id)
      .transition().duration(200)
      .attr('r', d => (selectedCamp && d.id === selectedCamp.id) ? 9 : 5);
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
    background-color: rgba(237, 242, 239, 0.7);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 1rem;
  }

  /* Estilo para el marcador seleccionado: borde con color acento oscuro */
  :global(.selected) {
    stroke: #212738;
    stroke-width: 2;
  }

  /* Asegurarnos que los marcadores no tengan cursor por defecto */
  :global(.camp-marker) {
    cursor: none !important;
  }

  /* Contenedor del mapa: ocupará toda la pantalla y se posiciona como fondo */
  .map-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    background: transparent;
  }
</style>

<!-- Utilizamos la clase "map-background" para que el mapa sea fondo -->
<div bind:this={mapContainer} class="map-background"></div>
