const removeLoadScreen = () => {
  setTimeout(() => {
    document.querySelector('.load-screen').remove();
    document.querySelector('.loaded').style.visibility = 'visible';
  }, 1000);
};

const renderSearchResult = (data) => {
  const $ul = document.querySelector('.mdl-list');

  if (!data.length) return $ul.innerHTML = '';

  $ul.innerHTML = data.map((address) => {
    return `
      <li class="mdl-list__item">
        <div class="mdl-list__item-primary-content">
          ${address.name}
        </div>
        <div>
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
            <span
                data-pos="[${address.center.lat}, ${address.center.lng}]"
                class="material-symbols-outlined">location_on</span>
          </button>
        </div>
        <div>
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
      </li>
    `
  }).join('');
}

const requestGeocodeByQuery = throttle((geocoder, query) => {
  if (!query) return renderSearchResult([]);

  geocoder.suggest(query, (data) => {
    renderSearchResult(data)
  })
}, 1000);

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

  const geocoder = L.Control.Geocoder.photon({
    defaultMarkGeocode: false,
    showUniqueResult: true,
  });

  return { map, layers, geolocationLayers, geocoder };
};

const getMeMarker = (pos) => L.circleMarker(pos, { radius: 25, color: '#536dfe', stroke: false, fillOpacity: 0.3 });
const getMeRadiusMarker = (pos) => L.circleMarker(pos, { radius: 10, color: '#ff1744', stroke: false, fillOpacity: 1 });

window.addEventListener('load',() => {
  const {
    map,
    layers,
    geolocationLayers,
    geocoder,
  } = initMap();

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
  const $searchButton = document.querySelector('.search');
  const $searchDialog = document.querySelector('.search-content');
  const $searchInput = document.querySelector('#search-input');

  if (!$searchDialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

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

  $tilesButton.addEventListener('click', (e) => menu.toggle());

  $searchButton.addEventListener('click', () => {
    $searchDialog.showModal()
  });

  $searchDialog.addEventListener('click', function ({ target, stopPropagation }) {
    if (target.nodeName === 'DIALOG') {
      target.close()
    } else if (target.nodeName === 'SPAN') {
      const pos = JSON.parse(target.getAttribute('data-pos'));
      map.setView(pos, 20, { animate: true });
      $searchDialog.close();
    }
  });

  $searchInput.addEventListener('input', ({ target }) => {
    requestGeocodeByQuery(geocoder, target.value);
  })
})

function throttle(func, ms) {
  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
