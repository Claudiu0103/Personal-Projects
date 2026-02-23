import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Endpoints } from "../endpoints";
import { environment } from "../../../enviroments/enviroments";
import { ArtistSimple } from "../models/artist-simple";
import { ArtistForAlbum } from "../models/artistForAlbum";
import { Artist } from "../models/artist";
import { Person } from "../models/person";
import { Album } from "../models/album";
import { SongSimple } from "../models/song-simple";

@Injectable({
  providedIn: "root"
})

export class ArtistService {
  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient) { }

  getListOfArtists(): Observable<ArtistSimple[]> {
    return this.http.get<ArtistSimple[]>(
      `${environment.apiUrl}${Endpoints.artists}`,
      { withCredentials: true }
    )
  }

  getPaginateArtists(offset:number, limit:number): Observable<ArtistSimple[]>{
    return this.http.get<ArtistSimple[]>(`${environment.apiUrl}${Endpoints.paginateArtists}?offset=${offset}&limit=${limit}`);
  }

  getListOfArtistsForAlbum(): Observable<ArtistForAlbum[]> {
    return this.http.get<ArtistForAlbum[]>(`${environment.apiUrl}${Endpoints.artists}`, { withCredentials: true })
  }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${environment.apiUrl}${Endpoints.getPersonsForBand}`, { withCredentials: true })
  }

  createArtist(artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(`${this.apiUrl}${Endpoints.artistOperation}`, artist, { withCredentials: true });
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(
      `${environment.apiUrl}${Endpoints.artists}/${id}`,
      { withCredentials: true }
    ).pipe(
      map(data => new Artist(data))
    );
  }
  getArtistAlbums(id: number): Observable<Album[]> {
    const url = `${environment.apiUrl}${Endpoints.artists}/${id}/albums`;
    return this.http.get<Album[]>(url, { withCredentials: true });
  }
  updateArtist(artistId: number, artistData: Artist): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}${Endpoints.updateArtist}/${artistId}`, artistData,
      { withCredentials: true });
  }

  getArtistSongs(id: number): Observable<SongSimple[]> {
    const url = `${environment.apiUrl}${Endpoints.artists}/${id}/songs`;
    return this.http.get<SongSimple[]>(url, { withCredentials: true });
  }
}