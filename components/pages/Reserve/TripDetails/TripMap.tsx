"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, X, Loader2 } from "lucide-react";
import type { LocationData } from "./tripSchema";
import { reverseGeocode, type GeocodeResult } from "@/lib/geocoding";

export interface ActiveSearchState {
  field: "pickupLocation" | "destination";
  query: string;
  suggestions: GeocodeResult[];
  isLoading: boolean;
}

interface TripMapProps {
  pickup: LocationData | null;
  destination: LocationData | null;
  activeSearch?: ActiveSearchState | null;
  onSelectSuggestion?: (field: "pickupLocation" | "destination", location: LocationData) => void;
  onMapClickLocation?: (field: "pickupLocation" | "destination", location: LocationData) => void;
  onCloseSearch?: () => void;
  className?: string;
}

export default function TripMap({
  pickup,
  destination,
  activeSearch,
  onSelectSuggestion,
  onMapClickLocation,
  onCloseSearch,
  className = "",
}: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet Map (OpenStreetMap with Dark luxury theme)
  useEffect(() => {
    let isMounted = true;

    if (!mapContainerRef.current) return;

    // Dynamically import leaflet to prevent SSR window reference errors
    import("leaflet").then((LModule) => {
      if (!isMounted || !mapContainerRef.current) return;
      const L = LModule.default || LModule;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialCenter: [number, number] = pickup
        ? [pickup.lat, pickup.lng]
        : destination
        ? [destination.lat, destination.lng]
        : [34.0522, -118.2437]; // Los Angeles default

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: pickup && destination ? 11 : 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Add zoom control at top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add official OpenStreetMap standard tile layer (normal clean white map)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Handle map click to pin exact point on map
      map.on("click", async (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        const targetField = activeSearch?.field || (pickup ? "destination" : "pickupLocation");

        // Reverse geocode clicked location
        const resolvedAddress = await reverseGeocode(lat, lng);
        const finalAddress = resolvedAddress || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        onMapClickLocation?.(targetField, {
          address: finalAddress,
          lat,
          lng,
        });
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers, Polyline, and Bounds when pickup or destination coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapReady) return;

    import("leaflet").then((LModule) => {
      const L = LModule.default || LModule;

      const createBadgeIcon = (letter: string, color: string) => {
        return L.divIcon({
          className: "custom-osm-marker",
          html: `
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: ${color};
              color: #ffffff;
              font-family: var(--font-inter), sans-serif;
              font-weight: 700;
              font-size: 11px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #C5A059;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            ">
              ${letter}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -18],
        });
      };

      // 1. Pickup Marker (A - Emerald / Gold)
      if (pickup && typeof pickup.lat === "number" && typeof pickup.lng === "number") {
        const latLng: [number, number] = [pickup.lat, pickup.lng];
        const popupContent = `
          <div style="font-family: sans-serif; color: #141414; padding: 2px;">
            <strong style="color: #775A19; font-size: 11px; text-transform: uppercase;">Pickup (A)</strong>
            <p style="margin: 3px 0 0; font-size: 12px; font-weight: 500;">${pickup.address}</p>
          </div>
        `;

        if (!pickupMarkerRef.current) {
          const marker = L.marker(latLng, {
            icon: createBadgeIcon("A", "#10B981"),
            draggable: true,
          })
            .bindPopup(popupContent)
            .addTo(map);

          marker.on("dragend", async () => {
            const pos = marker.getLatLng();
            const addr = await reverseGeocode(pos.lat, pos.lng);
            onMapClickLocation?.("pickupLocation", {
              address: addr || `Location at ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
              lat: pos.lat,
              lng: pos.lng,
            });
          });

          pickupMarkerRef.current = marker;
        } else {
          pickupMarkerRef.current.setLatLng(latLng);
          pickupMarkerRef.current.getPopup().setContent(popupContent);
        }
      } else if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }

      // 2. Destination Marker (B - Crimson / Gold)
      if (destination && typeof destination.lat === "number" && typeof destination.lng === "number") {
        const latLng: [number, number] = [destination.lat, destination.lng];
        const popupContent = `
          <div style="font-family: sans-serif; color: #141414; padding: 2px;">
            <strong style="color: #775A19; font-size: 11px; text-transform: uppercase;">Destination (B) - Drag to adjust</strong>
            <p style="margin: 3px 0 0; font-size: 12px; font-weight: 500;">${destination.address}</p>
          </div>
        `;

        if (!destMarkerRef.current) {
          const marker = L.marker(latLng, {
            icon: createBadgeIcon("B", "#EF4444"),
            draggable: true,
          })
            .bindPopup(popupContent)
            .addTo(map);

          marker.on("dragend", async () => {
            const pos = marker.getLatLng();
            const addr = await reverseGeocode(pos.lat, pos.lng);
            onMapClickLocation?.("destination", {
              address: addr || `Location at ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
              lat: pos.lat,
              lng: pos.lng,
            });
          });

          destMarkerRef.current = marker;
        } else {
          destMarkerRef.current.setLatLng(latLng);
          destMarkerRef.current.getPopup().setContent(popupContent);
        }
      } else if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }

      // 3. Draw Connecting Line (Golden route line between A and B)
      if (pickup && destination) {
        const lineCoords: [number, number][] = [
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng],
        ];

        if (!polylineRef.current) {
          polylineRef.current = L.polyline(lineCoords, {
            color: "#C5A059",
            weight: 3,
            opacity: 0.8,
            dashArray: "6, 8",
          }).addTo(map);
        } else {
          polylineRef.current.setLatLngs(lineCoords);
        }

        // Fit map bounds to show both points
        const bounds = L.latLngBounds(lineCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        if (polylineRef.current) {
          polylineRef.current.remove();
          polylineRef.current = null;
        }

        if (pickup) {
          map.setView([pickup.lat, pickup.lng], 13, { animate: true });
        } else if (destination) {
          map.setView([destination.lat, destination.lng], 13, { animate: true });
        }
      }
    });
  }, [pickup, destination, isMapReady]);

  // Handle clicking a suggestion on the map
  const handleSelect = (s: GeocodeResult) => {
    if (!activeSearch) return;
    onSelectSuggestion?.(activeSearch.field, {
      address: s.address,
      lat: s.lat,
      lng: s.lng,
    });

    // Fly to selected suggestion immediately
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([s.lat, s.lng], 14, { animate: true });
    }
  };

  const showSuggestionsOverlay =
    activeSearch &&
    (activeSearch.isLoading || (activeSearch.suggestions && activeSearch.suggestions.length > 0));

  return (
    <div
      className={`relative w-full flex-1 md:min-h-[440px] min-h-[340px] overflow-hidden ${className}`}
    >
      <div ref={mapContainerRef} className="w-full h-full min-h-[340px] md:min-h-[440px] z-0" />

      {/* Clean Floating Suggestions Overlay on the Map (desktop only; mobile uses the form dropdown) */}
      {showSuggestionsOverlay && (
        <div className="hidden lg:block absolute top-3 left-3 right-3 max-w-[360px] z-[500] bg-white text-gray-900 rounded-[8px] shadow-lg p-3 border border-gray-200 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-700" />
              <span className="text-gray-900 font-inter font-[600] text-[13px]">
                {activeSearch.field === "pickupLocation" ? "Pickup Suggestions" : "Destination Suggestions"}
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseSearch}
              className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-0.5"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeSearch.isLoading ? (
            <div className="py-3 flex items-center justify-center gap-2 text-gray-500 font-inter text-[12px]">
              <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
              <span>Searching locations...</span>
            </div>
          ) : (
            <ul className="space-y-1 max-h-52 overflow-auto custom-scroll">
              {activeSearch.suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className="p-2 rounded-[6px] hover:bg-gray-100 group cursor-pointer transition-colors"
                >
                  <p className="text-gray-900 font-inter font-[600] text-[12px] truncate leading-tight">
                    {s.address}
                  </p>
                  {s.subtitle && (
                    <p className="text-gray-500 font-inter text-[11px] truncate mt-0.5">
                      {s.subtitle}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2 pt-1.5 border-t border-gray-100 text-center">
            <span className="text-[10px] text-gray-400 font-inter">
              Click a suggestion or click anywhere on the map directly.
            </span>
          </div>
        </div>
      )}

      {/* Clean Floating Info Overlays for Selected Points */}
      {(pickup || destination) && (
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-[400] flex flex-wrap gap-2 justify-between items-end">
          {pickup && (
            <div className="bg-white/95 text-gray-900 text-[11px] md:text-[12px] font-medium font-inter px-3 py-1.5 rounded-[6px] shadow-md border border-gray-200 flex items-center gap-2 max-w-[240px]">
              <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                A
              </div>
              <span className="truncate">{pickup.address}</span>
            </div>
          )}

          {destination && (
            <div className="bg-white/95 text-gray-900 text-[11px] md:text-[12px] font-medium font-inter px-3 py-1.5 rounded-[6px] shadow-md border border-gray-200 flex items-center gap-2 max-w-[240px] ml-auto">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                B
              </div>
              <span className="truncate">{destination.address}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
