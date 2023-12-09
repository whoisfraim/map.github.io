const removeLoadScreen = () => {
  setTimeout(() => {
    document.querySelector('.load-screen').remove();
    document.querySelector('.loaded').style.visibility = 'visible';
  }, 1000);
}

const initMap = () => {
  const mapContainer = document.querySelector('.map');

  const map = L.map(mapContainer, {
    center: [45.05853056136878, 38.97168592724484],
    zoom: 11,
    renderer: L.canvas(),
  });

  const layers = {
    $2gis: L.tileLayer('http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
      subdomains:['mt0','mt1','mt2','mt3'],
      reuseTiles: true,
      updateWhenIdle: false
    }),
    $google: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains:['mt0','mt1','mt2','mt3'],
      reuseTiles: true,
      updateWhenIdle: false
    }),
  }

  const geolocationLayers = {
    me: null,
    radius: null,
  };

  layers.$2gis.addTo(map);

  return { map, layers, geolocationLayers };
};

const getMeMarker = (pos) => L.circleMarker(pos, { radius: 25, color: '#536dfe', stroke: false, fillOpacity: 0.3 });
const getMeRadiusMarker = (pos) => L.circleMarker(pos, { radius: 10, color: '#ff1744', stroke: false, fillOpacity: 1 });

window.addEventListener('load',() => {
  const { map, layers, geolocationLayers } = initMap();

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const pos = L.latLng(coords.latitude, coords.longitude);

      if (geolocationLayers.me || geolocationLayers.radius) {
        map.removeLayer(geolocationLayers.me);
        map.removeLayer(geolocationLayers.radius);
      }

      geolocationLayers.radius = getMeMarker(pos).addTo(map);
      geolocationLayers.me = getMeRadiusMarker(pos).addTo(map);

      map.setView(pos, 20, { animate: true });

      removeLoadScreen();
    },
    () => {
      alert('Не удалось получиться местоположение!')
      removeLoadScreen();
    },
    { timeout: 5000, enableHighAccuracy: true, },
  );

  const menu = new MaterialMenu(document.querySelector('.mdl-menu'));
  const $tilesButton = document.querySelector('.tiles');

  menu.element_.addEventListener('click', e => {
    if (e.target.hasAttribute('data-layer')) {
      switch (e.target.getAttribute('data-layer')) {
        case '$2gis':
          map.removeLayer(layers.$google);
          layers.$2gis.addTo(map)
          break
        case '$google':
          map.removeLayer(layers.$2gis);
          layers.$google.addTo(map)
          break
      }
    }
  });

  $tilesButton.addEventListener('click', () => {
      menu.toggle();
  });
})
