import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: 'critical' | 'monitoring' | 'incident';
  subtitle: string;
  activeLinks: number;
}

interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onSelectMarker?: (marker: MapMarker) => void;
}

const defaultMarkers: MapMarker[] = [
  {
    id: 'm-1',
    lat: 18.5204,
    lng: 73.8567,
    title: 'Sector 4 Logistics Hub, Pune',
    category: 'critical',
    subtitle: 'High Threat · Co-located target handset pings & Warehouse',
    activeLinks: 5,
  },
  {
    id: 'm-2',
    lat: 18.9690,
    lng: 72.8205,
    title: 'Front Corp HQ, BKC Mumbai',
    category: 'monitoring',
    subtitle: 'Commercial Shell Company · ₹4.2 Cr transaction conduit',
    activeLinks: 4,
  },
  {
    id: 'm-3',
    lat: 18.6298,
    lng: 73.7997,
    title: 'XYZ Market Yard Incident',
    category: 'incident',
    subtitle: 'Altercation Site · Vehicle MH12AB1234 Departure',
    activeLinks: 3,
  },
  {
    id: 'm-4',
    lat: 15.2993,
    lng: 74.1240,
    title: 'Goa Border Transit Checkpoint',
    category: 'monitoring',
    subtitle: 'Asset Tracking Route · Overnight Toll Crossing',
    activeLinks: 2,
  },
];

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers = defaultMarkers,
  center = [18.5204, 73.8567],
  zoom = 8,
  onSelectMarker,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean, high-legibility carto tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom NIRVIK Pin Icons
    markers.forEach((m) => {
      const isCritical = m.category === 'critical';
      const isIncident = m.category === 'incident';

      const pinColor = isCritical ? '#fd974e' : isIncident ? '#ba1a1a' : '#10232f';
      const haloClass = isCritical ? 'pulse-orange' : '';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${haloClass}" style="background-color: ${pinColor}">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const popupContent = `
        <div style="padding: 4px; min-width: 180px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${pinColor}; margin-bottom: 2px;">
            ${m.category.toUpperCase()} ACTIVITY
          </div>
          <div style="font-weight: 700; color: #10232f; font-size: 13px; line-height: 1.2; margin-bottom: 4px;">
            ${m.title}
          </div>
          <div style="font-size: 11px; color: #43474b; margin-bottom: 6px;">
            ${m.subtitle}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; border-top: 1px solid #dee3e3; padding-top: 4px;">
            <span style="color: #73777c;">Active Links: <b>${m.activeLinks}</b></span>
            <span style="color: #fd974e; font-weight: 600;">Geospatial Cluster</span>
          </div>
        </div>
      `;

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent);

      if (onSelectMarker) {
        marker.on('click', () => onSelectMarker(m));
      }
    });

    // Draw connecting corridor between Pune and Mumbai
    const polyline = L.polyline(
      [
        [18.969, 72.8205],
        [18.5204, 73.8567],
        [15.2993, 74.124],
      ],
      {
        color: '#c3c7cc',
        weight: 2,
        dashArray: '6, 6',
        opacity: 0.8,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [markers, center, zoom, onSelectMarker]);

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-lg">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
