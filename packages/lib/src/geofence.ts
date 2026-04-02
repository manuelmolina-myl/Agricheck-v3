export interface Location {
  lat: number;
  lng: number;
}

export interface Geofence {
  center: Location;
  radiusMeters: number;
}

export interface GeofenceResult {
  inside: boolean;
  distance: number;
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine.
 * Retorna distancia en metros.
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (point1.lat * Math.PI) / 180;
  const phi2 = (point2.lat * Math.PI) / 180;
  const deltaPhi = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLambda = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Verifica si una ubicación está dentro de un geofence circular.
 */
export function isInsideGeofence(location: Location, geofence: Geofence): GeofenceResult {
  const distance = calculateDistance(location, geofence.center);

  return {
    inside: distance <= geofence.radiusMeters,
    distance: Math.round(distance)
  };
}
