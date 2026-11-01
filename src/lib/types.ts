export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  guidelines?: string[];
  creatorEmail: string;
  creatorName?: string;
  creatorPhoto?: string;
  volunteersCount: number;
};