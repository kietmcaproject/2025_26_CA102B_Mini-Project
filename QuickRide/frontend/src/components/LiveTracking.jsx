import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523
};
const OLA_MAPS_API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY
const olaStyleUrl = 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json';

const LiveTracking = ({ routeGeoJSON: propRouteGeoJSON, distance, duration }) => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [routeGeoJSON, setRouteGeoJSON] = useState(propRouteGeoJSON);
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial geolocation load
    const [routeBoundsSet, setRouteBoundsSet] = useState(false); // Track if route bounds have been set

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const originMarker = useRef(null);
    const destMarker = useRef(null);
    const routePopup = useRef(null);

    // Polyline decoder function (for encoded polylines from Ola API)
    const decodePolyline = (encoded) => {
        console.log('Decoding polyline:', encoded.substring(0, 50) + '...');
        let index = 0,
            lat = 0,
            lng = 0;
        const coordinates = [];

        try {
            while (index < encoded.length) {
                let shift = 0,
                    result = 0,
                    byte;

                do {
                    byte = encoded.charCodeAt(index++) - 63;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);

                const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
                lat += dlat;

                shift = 0;
                result = 0;

                do {
                    byte = encoded.charCodeAt(index++) - 63;
                    result |= (byte & 0x1f) << shift;
                    shift += 5;
                } while (byte >= 0x20);

                const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
                lng += dlng;

                coordinates.push([lng * 1e-5, lat * 1e-5]);
            }
            console.log('Decoded coordinates length:', coordinates.length);
            return coordinates;
        } catch (error) {
            console.error('Polyline decoding failed:', error);
            return [];
        }
    };

    useEffect(() => {
        console.log('Syncing routeGeoJSON prop:', propRouteGeoJSON, 'Distance:', distance, 'Duration:', duration);
        setRouteGeoJSON(propRouteGeoJSON);
    }, [propRouteGeoJSON]);

    useEffect(() => {
        console.log('Initializing map...');
        if (map.current) {
            console.log('Map already exists, skipping init.');
            return;
        }

        try {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: olaStyleUrl,
                center: [currentPosition.lng, currentPosition.lat],
                zoom: 15,
                transformRequest: (url, resourceType) => {
                    console.log("MapLibre requesting:", { url, resourceType });
                    if (url.includes('olamaps.io')) {
                        try {
                            const modifiedUrl = new URL(url);
                            modifiedUrl.searchParams.set('api_key', OLA_MAPS_API_KEY);
                            console.log('Modified URL:', modifiedUrl.toString());
                            return { url: modifiedUrl.toString() };
                        } catch (error) {
                            console.error("Error modifying URL:", error);
                            return { url };
                        }
                    }
                    return { url };
                },
            });
            console.log('Map initialized successfully.');

            map.current.addControl(new maplibregl.NavigationControl());
            console.log('Navigation controls added.');

            marker.current = new maplibregl.Marker()
                .setLngLat([currentPosition.lng, currentPosition.lat])
                .addTo(map.current);
            console.log('Current position marker added.');
        } catch (error) {
            console.error('Map initialization failed:', error);
        }

        return () => {
            if (map.current) {
                console.log('Removing map on cleanup.');
                map.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        console.log('Updating current position:', currentPosition);
        if (marker.current) {
            try {
                marker.current.setLngLat([currentPosition.lng, currentPosition.lat]);
                console.log('Marker position updated.');
            } catch (error) {
                console.error('Failed to update marker position:', error);
            }
        }
    }, [currentPosition]);

    useEffect(() => {
        console.log('Starting geolocation tracking...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Initial position received:', { latitude, longitude });
                updatePosition(latitude, longitude);
            },
            (error) => {
                console.error('Initial geolocation failed:', error);
            }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Watched position update:', { latitude, longitude });
                updatePosition(latitude, longitude);
            },
            (error) => {
                console.error('Watch geolocation error:', error);
            }
        );

        const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Interval position update:', { latitude, longitude });
                    updatePosition(latitude, longitude);
                },
                (error) => {
                    console.error('Interval geolocation failed:', error);
                }
            );
        }, 1000);

        return () => {
            console.log('Cleaning up geolocation...');
            navigator.geolocation.clearWatch(watchId);
            clearInterval(intervalId);
        };
    }, []);

    const updatePosition = (lat, lng) => {
        console.log('Position updated:', lat, lng);
        setCurrentPosition({ lat, lng });

        if (map.current && marker.current) {
            const newLngLat = [lng, lat];
            try {
                marker.current.setLngLat(newLngLat);
                if (isInitialLoad || !routeGeoJSON) {
                    map.current.setCenter(newLngLat);
                    console.log('Map centered on user position (initial or no route).');
                    setIsInitialLoad(false);
                } else {
                    console.log('Map not centered, allowing manual interaction.');
                }
            } catch (error) {
                console.error('Failed to apply position update:', error);
            }
        }
    };

    useEffect(() => {
        console.log('RouteGeoJSON changed:', routeGeoJSON, 'Distance:', distance, 'Duration:', duration);
        if (!map.current) {
            console.log('Map not ready yet, skipping route update.');
            return;
        }

        const mapIsLoaded = () => {
            console.log('Map is loaded, processing route...');
            if (!routeGeoJSON) {
                console.log('No routeGeoJSON, removing route elements and popup.');
                if (map.current.getLayer('route-line')) {
                    try {
                        map.current.removeLayer('route-line');
                        console.log('Route layer removed.');
                    } catch (error) {
                        console.error('Failed to remove route layer:', error);
                    }
                }
                if (map.current.getSource('route')) {
                    try {
                        map.current.removeSource('route');
                        console.log('Route source removed.');
                    } catch (error) {
                        console.error('Failed to remove route source:', error);
                    }
                }
                if (originMarker.current) {
                    try {
                        originMarker.current.remove();
                        originMarker.current = null;
                        console.log('Origin marker removed.');
                    } catch (error) {
                        console.error('Failed to remove origin marker:', error);
                    }
                }
                if (destMarker.current) {
                    try {
                        destMarker.current.remove();
                        destMarker.current = null;
                        console.log('Dest marker removed.');
                    } catch (error) {
                        console.error('Failed to remove dest marker:', error);
                    }
                }
                if (routePopup.current) {
                    try {
                        routePopup.current.remove();
                        routePopup.current = null;
                        console.log('Route popup removed.');
                    } catch (error) {
                        console.error('Failed to remove route popup:', error);
                    }
                }
                setRouteBoundsSet(false);
                return;
            }

            let geojson;
            let coordinates;

            if (typeof routeGeoJSON === 'string') {
                console.log('Handling as encoded polyline string.');
                try {
                    coordinates = decodePolyline(routeGeoJSON);
                    if (coordinates.length < 2) {
                        console.warn('Decoded coordinates too short:', coordinates.length);
                        return;
                    }
                } catch (error) {
                    console.error('Error decoding polyline:', error);
                    return;
                }
            } else if (Array.isArray(routeGeoJSON)) {
                console.log('Handling as coordinate array.');
                coordinates = routeGeoJSON;
                if (coordinates.length < 2) {
                    console.warn('Coordinate array too short:', coordinates.length);
                    return;
                }
            } else if (routeGeoJSON.type && (routeGeoJSON.type === 'Feature' || routeGeoJSON.type === 'FeatureCollection' || routeGeoJSON.type === 'LineString')) {
                console.log('Handling as GeoJSON:', routeGeoJSON.type);
                if (routeGeoJSON.type === 'LineString') {
                    geojson = { type: 'Feature', geometry: routeGeoJSON, properties: {} };
                } else if (routeGeoJSON.type === 'Feature') {
                    geojson = routeGeoJSON;
                } else {
                    const f = routeGeoJSON.features && routeGeoJSON.features.find(f => f.geometry && f.geometry.type === 'LineString');
                    geojson = f || routeGeoJSON.features[0];
                    if (!geojson) {
                        console.error('No valid feature in FeatureCollection.');
                        return;
                    }
                }
                coordinates = geojson.geometry.coordinates;
                if (coordinates.length < 2) {
                    console.warn('GeoJSON coordinates too short:', coordinates.length);
                    return;
                }
            } else {
                console.error('Unknown routeGeoJSON format', routeGeoJSON);
                return;
            }

            if (coordinates && coordinates.length >= 2) {
                geojson = {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates },
                    properties: {}
                };
                console.log('Created GeoJSON with coordinates length:', coordinates.length);
            } else if (!geojson) {
                console.error('No valid coordinates found');
                return;
            }

            if (map.current.getSource('route')) {
                try {
                    map.current.getSource('route').setData(geojson);
                    console.log('Route source data updated.');
                } catch (error) {
                    console.error('Failed to update route source data:', error);
                }
            } else {
                try {
                    map.current.addSource('route', { type: 'geojson', data: geojson });
                    console.log('Route source added.');
                } catch (error) {
                    console.error('Failed to add route source:', error);
                    return;
                }
                try {
                    map.current.addLayer({
                        id: 'route-line',
                        type: 'line',
                        source: 'route',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-width': 5, 'line-color': '#1E90FF' }
                    });
                    console.log('Route layer added.');
                } catch (error) {
                    console.error('Failed to add route layer:', error);
                }
            }

            const coords = geojson.geometry.coordinates;
            if (coords && coords.length >= 2) {
                const origin = coords[0];
                const dest = coords[coords.length - 1];
                console.log('Origin coord:', origin, 'Dest coord:', dest);

                if (originMarker.current) {
                    try {
                        originMarker.current.remove();
                        console.log('Existing origin marker removed.');
                    } catch (error) {
                        console.error('Failed to remove existing origin marker:', error);
                    }
                }
                if (destMarker.current) {
                    try {
                        destMarker.current.remove();
                        console.log('Existing dest marker removed.');
                    } catch (error) {
                        console.error('Failed to remove existing dest marker:', error);
                    }
                }

                try {
                    originMarker.current = new maplibregl.Marker({ color: 'green' })
                        .setLngLat(origin)
                        .addTo(map.current);
                    console.log('Origin marker added.');
                } catch (error) {
                    console.error('Failed to add origin marker:', error);
                }
                try {
                    destMarker.current = new maplibregl.Marker({ color: 'red' })
                        .setLngLat(dest)
                        .addTo(map.current);
                    console.log('Dest marker added.');
                } catch (error) {
                    console.error('Failed to add dest marker:', error);
                }

                if (distance != null && duration != null && !isNaN(distance) && !isNaN(duration)) {
                    console.log('Adding route popup with distance:', distance, 'duration:', duration);
                    try {
                        const distanceKm = (distance / 1000).toFixed(2);
                        const durationMin = Math.round(duration / 60);
                        const popupContent = `Distance: ${distanceKm} km<br>Time: ${durationMin} min`;

                        const midIndex = Math.floor(coords.length / 2);
                        const midPoint = coords[midIndex];
                        console.log('Popup midpoint:', midPoint);

                        if (routePopup.current) {
                            try {
                                routePopup.current.remove();
                                console.log('Existing route popup removed.');
                            } catch (error) {
                                console.error('Failed to remove existing popup:', error);
                            }
                        }

                        routePopup.current = new maplibregl.Popup({ offset: 25 })
                            .setLngLat(midPoint)
                            .setHTML(popupContent)
                            .addTo(map.current);
                        console.log('Route popup added:', popupContent);
                    } catch (error) {
                        console.error('Failed to add route popup:', error);
                    }
                } else {
                    console.warn('Distance or duration invalid, skipping popup:', { distance, duration });
                }

                if (!routeBoundsSet) {
                    try {
                        const bounds = coords.reduce((b, c) => b.extend(c), new maplibregl.LngLatBounds(coords[0], coords[0]));
                        map.current.fitBounds(bounds, { padding: 60 });
                        console.log('Map bounds fitted to route.');
                        setRouteBoundsSet(true);
                    } catch (error) {
                        console.error('Failed to fit bounds:', error);
                    }
                } else {
                    console.log('Route bounds already set, allowing manual interaction.');
                }
            } else {
                console.warn('No valid coords for markers/bounds.');
            }
        };

        if (map.current.isStyleLoaded && map.current.isStyleLoaded()) {
            console.log('Style already loaded, calling mapIsLoaded immediately.');
            mapIsLoaded();
        } else {
            console.log('Waiting for map load event.');
            map.current.once('load', () => {
                console.log('Map load event fired.');
                mapIsLoaded();
            });
        }
    }, [routeGeoJSON, distance, duration]);

    return (
        <div ref={mapContainer} style={containerStyle} />
    );
};

export default LiveTracking;

