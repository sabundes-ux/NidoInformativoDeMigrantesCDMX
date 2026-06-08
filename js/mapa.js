function initNimMap() {
    const mapData = window.NIM_MAPBOX_DATA;
    const mapConfig = window.NIM_MAPBOX_CONFIG;
    const token = window.MAPBOX_TOKEN;
    const mapContainer = document.getElementById("mapa");
    const filtersContainer = document.getElementById("categoryFilters");
    const markerCount = document.getElementById("markerCount");
    const panel = document.getElementById("placePanel");
    const warning = document.getElementById("mapWarning");

    if (!mapContainer) {
        return;
    }
    if (!window.mapboxgl) {
        showWarning("No se pudo cargar Mapbox GL JS.");
        return;
    }

    if (!token || token === "PROVIDE_MAPBOX_TOKEN") {
        showWarning("Configura window.MAPBOX_TOKEN en js/secrets.js para ver el mapa.");
        return;
    }

    if (!mapConfig || !mapConfig.source || !mapConfig.layers) {
        showWarning("No se encontró la configuración del mapa. Carga js/mapbox-config.js antes de js/mapa.js.");
        return;
    }

    if (!mapData || !mapData.geojson || !Array.isArray(mapData.geojson.features)) {
        showWarning("No se encontraron marcadores. Carga js/datasets.js antes de js/mapa.js.");
        return;
    }

    mapboxgl.accessToken = token;

    const sourceId = mapConfig.source.id;
    const clusterLayerId = mapConfig.layers.clusters.id;
    const markerLayerId = mapConfig.layers.markers.id;
    const activeCategories = new Set(mapData.categories.map(category => category.id));
    const colorExpression = buildColorExpression(mapData.categories);
    const map = new mapboxgl.Map(mapConfig.map);

    window.nimMap = map;
    renderFilters();
    updateMarkerCount();

    map.on("error", (e) => {
        console.error("Mapbox GL Error interno:", e.error || e);
    });

    if (mapConfig.controls && mapConfig.controls.navigation) {
        map.addControl(
            new mapboxgl.NavigationControl(mapConfig.controls.navigation.options || {}),
            mapConfig.controls.navigation.position || "bottom-right"
        );
    }

    map.on("load", () => {
        map.resize(); // Obliga a ajustar el canvas a las dimensiones inyectadas

        map.addSource(sourceId, {
            type: "geojson",
            data: createVisibleGeojson(),
            cluster: Boolean(mapConfig.source.cluster),
            clusterMaxZoom: mapConfig.source.clusterMaxZoom,
            clusterRadius: mapConfig.source.clusterRadius
        });

        addConfiguredLayer(mapConfig.layers.clusters);
        addConfiguredLayer(mapConfig.layers.clusterCount);
        addConfiguredLayer(mapConfig.layers.markerHalo);
        addConfiguredLayer(mapConfig.layers.markers);

        bindMapInteractions();
        fitMapToMarkers();
    });

    document.addEventListener("click", event => {
        if (event.target.matches("[data-close-panel]")) {
            hidePlacePanel();
        }
    });

    function bindMapInteractions() {
        map.on("click", clusterLayerId, event => {
            const feature = event.features && event.features[0];

            if (!feature) {
                return;
            }

            zoomToCluster(feature);
        });

        map.on("click", markerLayerId, event => {
            const feature = event.features && event.features[0];

            if (!feature) {
                return;
            }

            showPlacePanel(feature.properties);
        });

        bindPointerCursor(clusterLayerId);
        bindPointerCursor(markerLayerId);
    }

    function renderFilters() {
        if (!filtersContainer) {
            return;
        }

        filtersContainer.innerHTML = mapData.categories.map(category => `
            <button
                class="filter-button is-active"
                type="button"
                data-category="${escapeAttribute(category.id)}"
                aria-pressed="true"
            >
                <span class="filter-button__swatch" style="background:${escapeAttribute(category.color)}"></span>
                <span>${escapeHtml(category.label)}</span>
                <span class="filter-button__count">${category.count}</span>
            </button>
        `).join("");

        filtersContainer.addEventListener("click", event => {
            const button = event.target.closest("[data-category]");

            if (!button) {
                return;
            }

            const categoryId = button.dataset.category;

            if (activeCategories.has(categoryId)) {
                activeCategories.delete(categoryId);
                button.classList.remove("is-active");
                button.setAttribute("aria-pressed", "false");
            } else {
                activeCategories.add(categoryId);
                button.classList.add("is-active");
                button.setAttribute("aria-pressed", "true");
            }

            refreshVisibleMarkers();
            updateMarkerCount();
            hidePlacePanel();
        });
    }

    function addConfiguredLayer(layerConfig) {
        if (!layerConfig) {
            return;
        }

        map.addLayer({
            id: layerConfig.id,
            type: layerConfig.type,
            source: sourceId,
            filter: cloneConfig(layerConfig.filter),
            layout: cloneConfig(layerConfig.layout || {}),
            paint: resolvePaint(layerConfig.paint || {})
        });
    }

    function refreshVisibleMarkers() {
        if (!map.isStyleLoaded()) {
            return;
        }

        const source = map.getSource(sourceId);

        if (source) {
            source.setData(createVisibleGeojson());
        }
    }

    function createVisibleGeojson() {
        return {
            type: "FeatureCollection",
            features: getVisibleFeatures()
        };
    }

    function getVisibleFeatures() {
        return mapData.geojson.features.filter(feature => activeCategories.has(feature.properties.category));
    }

    function updateMarkerCount() {
        if (!markerCount) {
            return;
        }

        markerCount.textContent = `${getVisibleFeatures().length} marcadores visibles`;
    }

    function zoomToCluster(feature) {
        const source = map.getSource(sourceId);
        const clusterId = feature.properties.cluster_id;
        const center = feature.geometry.coordinates;

        if (!source || clusterId === undefined) {
            return;
        }

        let didZoom = false;
        const handleZoom = zoom => {
            if (didZoom || !Number.isFinite(zoom)) {
                return;
            }

            didZoom = true;
            map.easeTo({ center, zoom });
        };

        const zoomResult = source.getClusterExpansionZoom(clusterId, (error, zoom) => {
            if (!error) {
                handleZoom(zoom);
            }
        });

        if (typeof zoomResult === "number") {
            handleZoom(zoomResult);
        } else if (zoomResult && typeof zoomResult.then === "function") {
            zoomResult.then(handleZoom).catch(error => {
                console.warn("No se pudo expandir el cluster.", error);
            });
        }
    }

    function showPlacePanel(properties) {
        if (!panel) {
            return;
        }

        const phoneLink = properties.phoneHref
            ? `<a class="place-panel__link" href="${escapeAttribute(properties.phoneHref)}">Llamar</a>`
            : `<span class="place-panel__link is-disabled">Sin telefono</span>`;
        const rows = [
            ["Categoria", properties.categoryLabel],
            ["Tipo", properties.type],
            ["Direccion", properties.address],
            ["Colonia", properties.neighborhood],
            ["Alcaldia", properties.borough],
            ["Telefono", properties.phone],
            ["Horario", properties.schedule]
        ].filter(([, value]) => value);

        panel.innerHTML = `
            <div class="place-panel__header">
                <span class="place-panel__category" style="border-color:${escapeAttribute(properties.color)}">
                    ${escapeHtml(properties.categoryLabel)}
                </span>
                <button class="place-panel__close" type="button" data-close-panel aria-label="Cerrar">x</button>
            </div>
            <h2>${escapeHtml(properties.name)}</h2>
            <dl>
                ${rows.map(([label, value]) => `
                    <div>
                        <dt>${escapeHtml(label)}</dt>
                        <dd>${escapeHtml(value)}</dd>
                    </div>
                `).join("")}
            </dl>
            <div class="place-panel__actions">
                ${phoneLink}
                <a class="place-panel__link" href="${escapeAttribute(properties.mapsUrl)}" target="_blank" rel="noopener noreferrer">
                    Google Maps
                </a>
            </div>
        `;
        panel.classList.remove("is-hidden");
    }

    function hidePlacePanel() {
        if (panel) {
            panel.classList.add("is-hidden");
            panel.innerHTML = "";
        }
    }

    function fitMapToMarkers() {
        const features = mapData.geojson.features;

        if (!features.length) {
            return;
        }

        const bounds = features.reduce((currentBounds, feature) => {
            return currentBounds.extend(feature.geometry.coordinates);
        }, new mapboxgl.LngLatBounds(features[0].geometry.coordinates, features[0].geometry.coordinates));

        map.fitBounds(bounds, {
            padding: 0,
            maxZoom: mapConfig.fitBounds.maxZoom,
            duration: mapConfig.fitBounds.duration
        });
    }

    function bindPointerCursor(layerId) {
        map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
        });
    }

    function buildColorExpression(categories) {
        return [
            "match",
            ["get", "category"],
            ...categories.flatMap(category => [category.id, category.color]),
            "#6b7280"
        ];
    }

    function resolvePaint(paint) {
        const resolvedPaint = cloneConfig(paint);

        Object.keys(resolvedPaint).forEach(key => {
            if (resolvedPaint[key] === "__CATEGORY_COLOR__") {
                resolvedPaint[key] = colorExpression;
            }
        });

        return resolvedPaint;
    }

    function cloneConfig(value) {
        if (value === undefined) {
            return undefined;
        }

        return JSON.parse(JSON.stringify(value));
    }

    function showWarning(message) {
        if (warning) {
            warning.textContent = message;
            warning.hidden = false;
        } else {
            mapContainer.textContent = message;
        }
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;"
        }[character]));
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNimMap);
} else {
    initNimMap();
}
