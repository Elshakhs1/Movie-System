export interface Artist {
  _id?: string;
  name: string;
  bio: string;
  type: string; // 'actor' or 'director'
  dateOfBirth?: Date;
  nationality?: string;
}

export interface CreateArtistRequest {
  name: string;
  bio: string;
  type: string;
}

export interface ArtistResponse {
  status: string;
  data: Artist;
}

export interface ArtistsResponse {
  status: string;
  data: Artist[];
} 