<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { campStore } from '../stores/campData';
  import regionesData from '../../data/regiones.json';

  let mapContainer;
  let camps = [];
  let geoData;
  let zoom; // Variable para el zoom de D3

  // Reactividad: cuando cambie el store, se actualiza la variable local
  $: camps = $campStore.camps;

  async function drawMap() {
    // Usamos el tamaño real del contenedor si está disponible
    const width = mapContainer.clientWidth || 800;
    const height = mapContainer.clientHeight || 800;

    // Definir proyección y generador de caminos
    const projection = d3.geoMercator()
      .scale(800)
      .center([-60, -35]);
    const path = d3.geoPath().projection(projection);

    // Crear el SVG y un grupo para contener todos los elementos (regiones y marcadores)
    const svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const g = svg.append('g');

    // Crear el tooltip (se creará antes de los marcadores para asegurar su disponibilidad)
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

    // Cargar los datos geográficos (regiones de Chile)
    geoData = regionesData;

    // Dibujar las regiones dentro de un grupo específico
    const regionsGroup = g.append('g')
      .attr('class', 'regions')
      .selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#cccccc')
      .attr('stroke', '#333333')
      .attr('stroke-width', 0.5);

    // Crear el grupo para los marcadores de campamentos
    const markersGroup = g.append('g')
      .attr('class', 'markers');

    // Dibujar cada campamento con un círculo
    const markers = markersGroup.selectAll('circle')
      .data(camps, d => d.id)
      .join('circle')
      .attr('cx', d => projection([d.lng, d.lat])[0])
      .attr('cy', d => projection([d.lng, d.lat])[1])
      .attr('r', 0) // Inicia con radio 0 para efecto de aparición
      .attr('fill', 'red')
      .attr('stroke', 'black')
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
        // Resalta la región que contiene el campamento
        highlightRegion(d, regionsGroup);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition().duration(200)
          .attr('r', 5);
        tooltip.transition().duration(200).style('opacity', 0);
        removeRegionHighlight(regionsGroup);
      })
      .on('click', function(event, d) {
        // Al hacer click, centra y acerca el mapa hacia el campamento
        const coords = projection([d.lng, d.lat]);
        zoomToLocation(svg, g, coords, width, height);
        campStore.selectCamp(d);
      });

    // Transición de aparición de los marcadores
    markers.transition().duration(1000).attr('r', 5);

    // Configurar zoom y pan
    zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Agregar un botón de “Reset Zoom” en la esquina superior derecha
    d3.select(mapContainer)
      .append('button')
      .attr('class', 'reset-button')
      .text('Reset Zoom')
      .style('position', 'absolute')
      .style('top', '10px')
      .style('right', '10px')
      .style('padding', '5px 10px')
      .on('click', () => {
         svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      });
  }

  // Función que resalta la región donde se encuentra el campamento
  function highlightRegion(camp, regionsGroup) {
    regionsGroup.each(function(feature) {
      if (d3.geoContains(feature, [camp.lng, camp.lat])) {
        d3.select(this)
          .transition().duration(200)
          .attr('fill', '#ffcc00');
      }
    });
  }

  // Función para quitar el resaltado de las regiones
  function removeRegionHighlight(regionsGroup) {
    regionsGroup.transition().duration(200)
      .attr('fill', '#cccccc');
  }

  // Función para centrar y hacer zoom en la ubicación seleccionada
  function zoomToLocation(svg, g, coords, width, height) {
    const scale = 4; // Valor de zoom objetivo (se puede ajustar)
    const translate = [width / 2 - scale * coords[0], height / 2 - scale * coords[1]];
    svg.transition().duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  onMount(() => {
    drawMap();
  });
</script>

<style>
  /* Aseguramos que el contenedor del mapa tenga position: relative para los elementos absolutos (tooltip y botón) */
  :host {
    position: relative;
  }
  
  :global(.tooltip) {
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  :global(.reset-button) {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

<!-- El contenedor del mapa ocupa el 100% del espacio disponible -->
<div bind:this={mapContainer} style="width: 100%; height: 100%;"></div>
