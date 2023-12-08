window.addEventListener('load',() => {
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

  layers.$2gis.addTo(map);

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const latLng = L.latLng(coords.latitude, coords.longitude);
      map.setView(latLng, 20, { animate: true });
      myIcon = L.icon({ iconUrl: 'meIcon.png', iconSize: [40, 40] });
      L.marker(latLng, { icon: myIcon }).addTo(map);
    },
    (e) => {
      alert(e.message, e.code, e.TIMEOUT, e.PERMISSION_DENIED, e.POSITION_UNAVAILABLE)
      alert(e.code)
      alert(e.TIMEOUT)
      alert(e.PERMISSION_DENIED)
      alert(e.POSITION_UNAVAILABLE)
    },
    { timeout: 5000 }
  );

  const menu = new MaterialMenu(document.querySelector('.mdl-menu'));
  const button = new MaterialButton(document.querySelector('.tiles'));

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

  button.element_.addEventListener('click', () => {
      menu.toggle();
  });

  setTimeout(() => {
    document.querySelector('.load-screen').remove();
    document.querySelector('.loaded').style.visibility = 'visible';
  }, 1000);
})
