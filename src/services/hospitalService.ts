export interface NearbyHospital {
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const fetchNearbyHospitals = async (
  lat: number,
  lng: number,
  radiusMeters = 5000
): Promise<NearbyHospital[]> => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return [];
  }

  const radius = Math.max(500, Math.min(radiusMeters, 25000));
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: `data=${encodeURIComponent(query)}`
  });

  if (!response.ok) {
    throw new Error('Failed to fetch nearby hospitals');
  }

  const data = await response.json();
  const elements = Array.isArray(data?.elements) ? data.elements : [];

  const mappedHospitals: Array<NearbyHospital | null> = elements.map(
    (element: any): NearbyHospital | null => {
      const name =
        element?.tags?.name ||
        element?.tags?.['name:en'] ||
        element?.tags?.hospital ||
        'Hospital';

      const hospitalLat = typeof element?.lat === 'number' ? element.lat : element?.center?.lat;
      const hospitalLng = typeof element?.lon === 'number' ? element.lon : element?.center?.lon;

      if (!Number.isFinite(hospitalLat) || !Number.isFinite(hospitalLng)) {
        return null;
      }

      return {
        name,
        lat: hospitalLat,
        lng: hospitalLng,
        distanceKm: haversineKm(lat, lng, hospitalLat, hospitalLng)
      };
    }
  );

  const hospitals = mappedHospitals.filter(
    (hospital: NearbyHospital | null): hospital is NearbyHospital => hospital !== null
  );

  return hospitals
    .filter((hospital: NearbyHospital) => hospital.distanceKm <= radius / 1000)
    .sort((a: NearbyHospital, b: NearbyHospital) => a.distanceKm - b.distanceKm)
    .slice(0, 10);
};
