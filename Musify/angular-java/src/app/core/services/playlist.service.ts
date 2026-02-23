import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { Endpoints } from '../endpoints';
import { PlaylistSimple } from '../models/playlist-simple';
import { PlaylistAddSong } from '../models/playlist-add-song';
import { SongSimple } from '../models/song-simple';
import { map } from 'rxjs/operators';
import { CreatePlaylistRequest } from '../models/createPlaylist-request';



@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private publicBase = `${environment.apiUrl}${Endpoints.playlistOperationPublic}`;
  private base = `${environment.apiUrl}${Endpoints.playlistOperation}`;
  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient) { }


  getPublic(): Observable<PlaylistSimple[]> {
    return this.http.get<PlaylistSimple[]>(
      `${environment.apiUrl}${Endpoints.playlistOperationPublic}`,
      { withCredentials: true });
  }

  getPublicPaginated(offset:number, limit:number): Observable<PlaylistSimple[]> {
    return this.http.get<PlaylistSimple[]>(
      `${environment.apiUrl}${Endpoints.paginatePublicPlaylists}?offset=${offset}&limit=${limit}`,
      { withCredentials: true });
  }

  getSongs(playlistId: number): Observable<SongSimple[]> {
    return this.http
      .get<any[]>(`${this.base}/${playlistId}/songs`)
      .pipe(
        map(arr =>
          arr.map(d =>
            new SongSimple({
              id: d.id,
              title: d.title,
              duration: d.duration,
              album: d.album,
              artists: d.artists
            })
          )
        )
      );
  }

  create(payload: CreatePlaylistRequest) {
    return this.http.post<PlaylistSimple>(
      `${environment.apiUrl}${Endpoints.playlistOperation}/create`,
      payload
    );
  }

  addSongToPlaylist(playlistId: number, songId: number) {
    const url = `${environment.apiUrl}${Endpoints.playlistOperation}/${playlistId}/songs`;
    const body = { songIds: [songId] };
    return this.http.post(url, body);
  }


  getPlaylistsByUser(userId: number, isPublic: boolean): Observable<PlaylistAddSong[]> {
    const url = `${environment.apiUrl}${Endpoints.getUserPlaylists(userId, isPublic)}`;
    return this.http.get<PlaylistAddSong[]>(url);
  }

  getFollowedPlaylists(): Observable<PlaylistSimple[]> {
    return this.http.get<PlaylistSimple[]>(`${environment.apiUrl}${Endpoints.followedPlaylists}`, { withCredentials: true });
  }

  getOwnedPlaylists(): Observable<PlaylistSimple[]> {
    return this.http.get<PlaylistSimple[]>(`${environment.apiUrl}${Endpoints.ownedPlaylists}`, { withCredentials: true });
  }


  deletePlaylist(playlistId: number): Observable<void> {
    const url = `${this.apiUrl}${Endpoints.deletePlaylist}/${playlistId}`;
    return this.http.delete<void>(url, { withCredentials: true });
  }

  removeSongFromPlaylist(playlistId: number, songId: number): Observable<void> {
    const url = `${this.apiUrl}${Endpoints.playlistOperation}/${playlistId}/songs/${songId}`;
    return this.http.delete<void>(url, { withCredentials: true });
  }

  getFollowed(userId: number): Observable<PlaylistSimple[]> {
    return this.http.get<PlaylistSimple[]>(
      `${environment.apiUrl}${Endpoints.getFollowed(userId)}`
    );
  }


  followPlaylist(userId: number, playlistId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}${Endpoints.followPlaylist(userId, playlistId)}`,
      {}
    );
  }

  unfollowPlaylist(userId: number, playlistId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}${Endpoints.unfollowPlaylist(userId, playlistId)}`
    );
  }

  getPlaylistById(playlistId: number): Observable<PlaylistSimple> {
    const url = `${this.apiUrl}${Endpoints.getPlaylistById}/${playlistId}`;
    return this.http.get<PlaylistSimple>(url);
  }



}
