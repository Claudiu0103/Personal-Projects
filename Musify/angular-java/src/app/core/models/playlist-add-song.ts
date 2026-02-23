import { UserSimple } from './user-simple';
import { SongSimple } from './song-simple';

export interface PlaylistAddSong {
  id: number;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  owner: UserSimple;
}
