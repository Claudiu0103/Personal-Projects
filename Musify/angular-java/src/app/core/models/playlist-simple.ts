import { UserSimple } from './user-simple';
import { SongSimple } from './song-simple';

export interface PlaylistSimple {
  id: number;
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  owner: UserSimple;
  followers: UserSimple[];
  songs: SongSimple[];
  duration: string;
}
