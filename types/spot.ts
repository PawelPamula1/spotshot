export interface Spot {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  author: {
    userId: number;
    authorName: string;
  };
}
