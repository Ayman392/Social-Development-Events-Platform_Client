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
  joinedAt: string;
};