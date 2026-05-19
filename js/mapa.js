// ── Token Mapbox ──────────────────────────────────────────────────────────────
// Reemplaza este valor con tu token de Mapbox:  https://account.mapbox.com/access-tokens/
mapboxgl.accessToken = window.MAPBOX_TOKEN;

// ── Mapa ──────────────────────────────────────────────────────────────────────
const map = new mapboxgl.Map({
    container: "mapa",
    style: "mapbox://styles/mapbox/light-v11",
    center: [-99.228, 19.520],
    zoom: 11,
});