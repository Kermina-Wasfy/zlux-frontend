import type { LocationData } from "@/components/pages/Reserve/TripDetails/tripSchema";

export interface GeocodeResult extends LocationData {
  id: string;
  subtitle?: string;
  city?: string;
  country?: string;
}

// In-memory cache for recent queries to save bandwidth
const cache = new Map<string, GeocodeResult[]>();
const reverseCache = new Map<string, string>();

let lastRequestTime = 0;

/**
 * 100% Dynamic, Unrestricted Worldwide Geocoding using OpenStreetMap data.
 * Searches any street, city, airport, hotel, or landmark across the entire globe with zero hardcoded limits.
 */
export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const lower = trimmed.toLowerCase();
  if (cache.has(lower)) {
    return cache.get(lower) || [];
  }

  // 1. Primary Global Search: Photon Geocoder (Worldwide OpenStreetMap data by Komoot)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
    const res = await fetch(photonUrl, { headers: { Accept: "application/json" } });

    if (res.ok) {
      const json = await res.json();
      if (json.features && Array.isArray(json.features) && json.features.length > 0) {
        interface PhotonFeature {
          geometry: { coordinates: [number, number] }; // [lng, lat]
          properties: {
            osm_id?: number;
            name?: string;
            street?: string;
            housenumber?: string;
            locality?: string;
            district?: string;
            city?: string;
            county?: string;
            state?: string;
            country?: string;
            postcode?: string;
          };
        }

        const photonResults: GeocodeResult[] = json.features.map((f: PhotonFeature, index: number) => {
          const p = f.properties;
          const [lng, lat] = f.geometry.coordinates;

          const streetPart = [p.housenumber, p.street].filter(Boolean).join(" ");
          const mainName = p.name || streetPart || p.city || trimmed;

          const addressComponents = [
            mainName,
            streetPart && streetPart !== mainName ? streetPart : null,
            p.district || p.locality,
            p.city,
            p.state,
            p.country,
          ].filter(Boolean);

          const fullAddress = addressComponents.join(", ");
          const subtitle = [p.city || p.county, p.state, p.country].filter(Boolean).join(", ");

          return {
            id: `photon-${p.osm_id || index}`,
            address: fullAddress,
            subtitle: subtitle !== fullAddress ? subtitle : undefined,
            city: p.city || p.county,
            country: p.country,
            lat,
            lng,
          };
        });

        if (photonResults.length > 0) {
          cache.set(lower, photonResults);
          return photonResults;
        }
      }
    }
  } catch {
    // If Photon request fails, proceed to Nominatim fallback
  }

  // 2. Global Fallback Search: OpenStreetMap Nominatim
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < 500) {
    await new Promise((resolve) => setTimeout(resolve, 500 - timeSinceLast));
  }
  lastRequestTime = Date.now();

  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: "json",
      addressdetails: "1",
      limit: "6",
    });

    const nomUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
    const response = await fetch(nomUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ZLUX-Chauffeur-App/1.0",
      },
    });

    if (response.ok) {
      interface NominatimItem {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
        address?: {
          city?: string;
          town?: string;
          state?: string;
          country?: string;
        };
      }

      const data: NominatimItem[] = await response.json();

      const nomResults: GeocodeResult[] = data.map((item) => {
        const addr = item.address || {};
        const subtitle = [addr.city || addr.town, addr.state, addr.country].filter(Boolean).join(", ");

        return {
          id: `nom-${item.place_id}`,
          address: item.display_name,
          subtitle: subtitle || item.display_name,
          city: addr.city || addr.town,
          country: addr.country,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
      });

      cache.set(lower, nomResults);
      return nomResults;
    }
  } catch {
    // Return empty if both network searches fail
  }

  return [];
}

/**
 * Reverse geocodes exact coordinates anywhere in the world into a street address.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (reverseCache.has(cacheKey)) {
    return reverseCache.get(cacheKey) || null;
  }

  // 1. Try Photon reverse
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.features && json.features.length > 0) {
        const p = json.features[0].properties;
        const street = [p.housenumber, p.street].filter(Boolean).join(" ");
        const parts = [p.name || street, p.locality || p.district, p.city, p.state, p.country].filter(Boolean);
        const address = parts.join(", ");
        if (address) {
          reverseCache.set(cacheKey, address);
          return address;
        }
      }
    }
  } catch {
    // Fallback to nominatim
  }

  // 2. Fallback to Nominatim reverse
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "ZLUX-Chauffeur-App/1.0",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const address = data.display_name || null;
      if (address) {
        reverseCache.set(cacheKey, address);
        return address;
      }
    }
  } catch {
    // Fail silently
  }

  return null;
}
