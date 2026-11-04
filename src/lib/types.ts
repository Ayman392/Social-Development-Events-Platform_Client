export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  coordinates?: EventCoordinates;
  guidelines?: string[];
  creatorEmail: string;
  creatorName?: string;
  creatorPhoto?: string;
  volunteersCount: number;
};

export type EventCoordinates = {
  latitude: number;
  longitude: number;
};

export function hasValidEventCoordinates(
  coordinates: EventCoordinates | undefined
): coordinates is EventCoordinates {
  return Boolean(
    coordinates &&
      Number.isFinite(coordinates.latitude) &&
      Number.isFinite(coordinates.longitude) &&
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180
  );
}

export type JoinedEventItem = {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  title: string;
  thumbnail: string;
  location: string;
  eventType: string;
  eventDate: string;
  coordinates?: EventCoordinates;
  joinedAt: string;
};