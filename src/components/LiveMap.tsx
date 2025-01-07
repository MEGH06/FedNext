import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LiveMapProps {
  startLocation?: [number, number];
  endLocation?: [number, number];
  route?: any;
}

const LiveMap = ({ startLocation, endLocation, route }: LiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only if we have a token
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 9,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add traffic layer
    map.current.on('load', () => {
      map.current?.addSource('traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1'
      });

      map.current?.addLayer({
        'id': 'traffic-data',
        'type': 'line',
        'source': 'traffic',
        'source-layer': 'traffic',
        'paint': {
          'line-color': [
            'match',
            ['get', 'congestion'],
            'low', '#4CAF50',
            'moderate', '#FFC107',
            'heavy', '#FF5722',
            'severe', '#FF0000',
            '#4CAF50'
          ],
          'line-width': 2
        }
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers and route when locations change
  useEffect(() => {
    if (!map.current || !startLocation || !endLocation) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add start marker
    new mapboxgl.Marker({ color: '#4CAF50' })
      .setLngLat(startLocation)
      .addTo(map.current);

    // Add end marker
    new mapboxgl.Marker({ color: '#FF5722' })
      .setLngLat(endLocation)
      .addTo(map.current);

    // Fit bounds to show both markers
    const bounds = new mapboxgl.LngLatBounds()
      .extend(startLocation)
      .extend(endLocation);

    map.current.fitBounds(bounds, {
      padding: 50
    });

    // Draw route if available
    if (route) {
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        });
      } else {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
    }
  }, [startLocation, endLocation, route]);

  return (
    <div className="space-y-4">
      {!mapboxToken && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please enter your Mapbox public token to view the map. You can get one from{' '}
            <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">
              Mapbox
            </a>
          </p>
          <input
            type="text"
            placeholder="Enter Mapbox token"
            className="mt-2 w-full p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />
    </div>
  );
};

export default LiveMap;