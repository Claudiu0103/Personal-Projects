export interface CreatePlaylistRequest {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  ownerId: number;
}
