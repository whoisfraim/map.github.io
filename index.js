const mapContainer = document.querySelector('#map');

const map = L.map(mapContainer, {
  center: [51.505, -0.09],
  zoom: 13,
  prefereCanvas: true,
  animate: true
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

navigator.geolocation.getCurrentPosition(({ coords }) => {
  const latLng = L.latLng(coords.latitude, coords.longitude);
  map.setView(latLng, 15);
});
