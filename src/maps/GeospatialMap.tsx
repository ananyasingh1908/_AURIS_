import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Incident, CarbonProject, CountryEmission } from '../types';
import { createSeverityIcon, createCarbonProjectIcon, createDraggableCitizenPin } from './mapUtils';
import {
  Layers,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface GeospatialMapProps {
  incidents?: Incident[];
  carbonProjects?: CarbonProject[];
  countryEmissions?: CountryEmission[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  selectedProject?: CarbonProject | null;
  onSelectProject?: (project: CarbonProject) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  isDraggableCitizenPin?: boolean;
  citizenPinPosition?: [number, number];
  onCitizenPinChange?: (lat: number, lng: number) => void;
  flyToCoords?: { lat: number; lng: number; zoom?: number } | null;
  interactive?: boolean;
  highlightCategory?: string | null;
}

// Controller component to smoothly fly map to new targets
const MapController: React.FC<{
  flyToCoords?: { lat: number; lng: number; zoom?: number } | null;
  center?: [number, number];
  zoom?: number;
}> = ({ flyToCoords, center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (flyToCoords) {
      const nextZoom = Math.max(flyToCoords.zoom ?? 14, 3);
      map.flyTo([flyToCoords.lat, flyToCoords.lng], nextZoom, {
        duration: 1.6,
        easeLinearity: 0.25
      });
    }
  }, [flyToCoords, map]);

  useEffect(() => {
    if (center && zoom) {
      const nextZoom = Math.max(zoom, 3);
      map.setView(center, nextZoom);
    }
  }, [center, zoom, map]);

  return null;
};

// Citizen pin click listener
const LocationClickHandler: React.FC<{
  onCitizenPinChange?: (lat: number, lng: number) => void;
}> = ({ onCitizenPinChange }) => {
  useMapEvents({
    click(e) {
      if (onCitizenPinChange) {
        onCitizenPinChange(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  incidents = [],
  carbonProjects = [],
  countryEmissions = [],
  selectedIncident,
  onSelectIncident,
  selectedProject,
  onSelectProject,
  center = [20, 0],
  zoom = 2,
  height = '620px',
  isDraggableCitizenPin = false,
  citizenPinPosition,
  onCitizenPinChange,
  flyToCoords,
  interactive = true,
  highlightCategory
}) => {
  const [mapType, setMapType] = useState<'light' | 'satellite' | 'terrain'>('light');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);

  // OpenStreetMap-based tiles for a free, real-world basemap without API keys
  const lightTiles = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteTiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const terrainTiles = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const currentTiles =
    mapType === 'satellite'
      ? satelliteTiles
      : mapType === 'terrain'
        ? terrainTiles
        : lightTiles;

  // Filter incidents if highlight category is active
  const filteredIncidents = highlightCategory
    ? incidents.filter(
      inc =>
        inc.category.toLowerCase().includes(highlightCategory.toLowerCase()) ||
        inc.department.toLowerCase().includes(highlightCategory.toLowerCase())
    )
    : incidents;

  return (
    <div className="w-full min-w-0 space-y-3">
      {/* On small screens controls are part of the document flow, so they never cover map content. */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-subtle">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">AURIS Geospatial Engine</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Live Layer</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-subtle">
            <Sparkles className="h-3 w-3 text-amber-200" />
            <span>Real-Time Sensor Telemetry</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-subtle">
          <div className="flex flex-wrap items-center gap-1">
            {(['light', 'satellite', 'terrain'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${mapType === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {type === 'light' ? 'Map' : type === 'satellite' ? 'Satellite' : 'Voyager'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 border transition-all ${is3DMode ? 'bg-sky-600 text-white border-sky-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'}`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Active' : '3D View'}</span>
          </button>
        </div>
      </div>

      <div
        className={`relative isolate w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-sm transition-all duration-500 ${is3DMode ? 'perspective-map' : ''
          }`}
        style={{ height }}
      >
      <MapContainer
        center={center}
        zoom={Math.max(zoom, 3)}
        minZoom={3}
        maxZoom={18}
        maxBounds={[
          [-85, -180],
          [85, 180]
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={true}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url={currentTiles}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          maxZoom={19}
        />

        <MapController flyToCoords={flyToCoords} center={center} zoom={zoom} />

        {isDraggableCitizenPin && (
          <LocationClickHandler onCitizenPinChange={onCitizenPinChange} />
        )}

        {/* Citizen Draggable Pin */}
        {isDraggableCitizenPin && citizenPinPosition && (
          <Marker
            position={citizenPinPosition}
            icon={createDraggableCitizenPin()}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                if (onCitizenPinChange) {
                  onCitizenPinChange(position.lat, position.lng);
                }
              }
            }}
          >
            <Popup>
              <div className="p-2 text-xs">
                <span className="font-semibold text-sky-700">Selected Incident Location</span>
                <p className="text-slate-500 mt-1">
                  Lat: {citizenPinPosition[0].toFixed(4)}, Lng: {citizenPinPosition[1].toFixed(4)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click anywhere on the map or drag this pin.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Global Incident Markers */}
        {filteredIncidents.map((incident) => {
          const isSelected = selectedIncident?.id === incident.id;
          return (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={createSeverityIcon(incident.severity, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectIncident) {
                    onSelectIncident(incident);
                  }
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[240px] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${incident.severity === 'Critical'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : incident.severity === 'Warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : incident.severity === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">{incident.reportedAt}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{incident.title}</h4>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{incident.ward ? `${incident.ward}, ` : ''}{incident.city}, {incident.country}</span>
                  </p>

                  {incident.riskScore && (
                    <div className="bg-red-50/80 px-2 py-1 rounded-lg border border-red-200/80 text-[10px] font-bold text-red-800 flex items-center justify-between">
                      <span>Calculated Risk: {incident.riskLevel || 'CRITICAL'}</span>
                      <span>{incident.riskScore}/100</span>
                    </div>
                  )}

                  {incident.evidenceSummary && (
                    <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 font-mono">
                      ↳ Evidence: {incident.evidenceSummary}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500">{incident.department}</span>
                    <button
                      onClick={() => onSelectIncident && onSelectIncident(incident)}
                      className="text-sky-600 font-bold flex items-center hover:text-sky-700 text-xs"
                    >
                      Inspect <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Carbon Projects Markers */}
        {carbonProjects.map((project) => {
          const isSelected = selectedProject?.id === project.id;
          return (
            <Marker
              key={project.id}
              position={[project.latitude, project.longitude]}
              icon={createCarbonProjectIcon(project.type, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectProject) {
                    onSelectProject(project);
                  }
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {project.type}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800">
                      ${project.pricePerCredit.toFixed(2)}/t
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm leading-tight">{project.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {project.cityRegion}, {project.country}
                  </p>
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-semibold text-slate-800">{project.creditsAvailable.toLocaleString()} t</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls - Top Right */}
      <div className="absolute top-4 right-4 z-[400] hidden sm:flex flex-col gap-2">
        {/* Style switch pills */}
        <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 border border-slate-200/90 shadow-subtle">
          <button
            onClick={() => setMapType('light')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${mapType === 'light'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${mapType === 'satellite'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${mapType === 'terrain'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Voyager
          </button>
        </div>

        {/* 3D / Perspective Mode toggle */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 border transition-all ${is3DMode
                ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
            title="Toggle 3D City Elevation Perspective"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Active' : '3D View'}</span>
          </button>
        </div>
      </div>

      {/* Floating Status Pill - Top Left */}
      <div className="absolute top-4 left-4 z-[400] hidden sm:flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-subtle text-xs font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-800">AURIS Geospatial Engine</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Live Layer</span>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-subtle text-[11px] font-bold text-white uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-200" />
          <span>Real-Time Sensor Telemetry</span>
        </div>
      </div>

      {/* Floating Map Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/90 shadow-subtle items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="text-[11px] font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-[11px] font-medium">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span className="text-[11px] font-medium">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-[11px] font-medium">Resolved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span className="text-[11px] font-medium">AI Predicted</span>
        </div>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200/90 bg-white p-2.5 text-xs text-slate-600 shadow-subtle sm:hidden">
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-[11px] font-medium">Critical</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-[11px] font-medium">Warning</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span><span className="text-[11px] font-medium">Normal</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-[11px] font-medium">Resolved</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span className="text-[11px] font-medium">AI Predicted</span></div>
    </div>
  </div>
  );
};
