import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Endpoints } from "../endpoints";
import { environment } from "../../../enviroments/enviroments";
import { SongSimple } from "../models/song-simple";
import { Song } from "../models/song";
import { SongForAlbum } from "../models/songForAlbum";
import { SongOperation } from '../models/song-operation';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private http: HttpClient) { }

  getAllSongsForAlbum(): Observable<SongForAlbum[]> {
    return this.http.get<SongForAlbum[]>(`${environment.apiUrl}${Endpoints.songsForAlbum}`, { withCredentials: true })
  }

  getMostWantedSongs(limit: number = 10): Observable<SongSimple[]> {
    return this.http.get<SongSimple[]>(
      `${environment.apiUrl}${Endpoints.mostWantedSongs}?limit=${limit}`,
      { withCredentials: true }
    )
  }

  getAllSongs(): Observable<SongSimple[]> {
    return this.http.get<SongSimple[]>(
      `${environment.apiUrl}${Endpoints.listOfSongs}`,
      { withCredentials: true });
  }

  getPaginateSongs(offset:number, limit:number): Observable<SongSimple[]> {
    return this.http.get<SongSimple[]>(
      `${environment.apiUrl}${Endpoints.paginateSongs}?offset=${offset}&limit=${limit}`,
      { withCredentials: true });
  }



  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(
      `${environment.apiUrl}${Endpoints.songs}/${id}`,
      { withCredentials: true }
    )
  }

  createSong(song: SongOperation): Observable<any> {
    return this.http.post(`${environment.apiUrl}${Endpoints.songs}`, song, { withCredentials: true });
  }

  updateSong(songId: number, songData: SongOperation): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}${Endpoints.updateSong}/${songId}`, songData,
      { withCredentials: true });
  }
}