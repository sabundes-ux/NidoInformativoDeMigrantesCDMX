
window.NIM_MAPBOX_CONFIG = {
    map: {
        container: "mapa",
        // style: "mapbox://styles/sabundes/cmotaf3s8001601rygfdy5t7p",
        style: 'mapbox://styles/juan-fuentes/cmpu7hxvf003901s41haj5oiy',
        center: [-99.1323, 19.43],
        zoom: 13,
        antialias: true
    },
    controls: {
        navigation: {
            position: "bottom-right",
            options: {
                visualizePitch: true
            }
        }
    },
    source: {
        id: "nim-service-points",
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 54
    },
    fitBounds: {
        maxZoom: 12,
        duration: 0
    },
    layers: {
        clusters: {
            id: "nim-service-clusters",
            type: "circle",
            filter: ["has", "point_count"],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#198F51",
                    20,
                    "#5ec3e8",
                    80,
                    "#F3C11B",
                    200,
                    "#9d1a17"
                    
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    18,
                    20,
                    24,
                    80,
                    31,
                    200,
                    38
                ],
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 3,
                "circle-opacity": 0.94
            }
        },
        clusterCount: {
            id: "nim-service-cluster-count",
            type: "symbol",
            filter: ["has", "point_count"],
            layout: {
                "text-field": ["get", "point_count_abbreviated"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 13
            },
            paint: {
                "text-color": "#ffffff"
            }
        },
        markerHalo: {
            id: "nim-service-marker-halos",
            type: "circle",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 8, 13, 13, 16, 18],
                "circle-color": "#ffffff",
                "circle-opacity": 0.86
            }
        },
        markers: {
            id: "nim-service-markers",
            type: "circle",
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 5, 13, 8, 16, 12],
                "circle-color": "__CATEGORY_COLOR__",
                "circle-opacity": 0.95,
                "circle-stroke-color": "#1d2433",
                "circle-stroke-width": 1
            }
        }
    }
};
