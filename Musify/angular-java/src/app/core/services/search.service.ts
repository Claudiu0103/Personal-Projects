import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { SearchResponse } from '../models/search-response';
import { Endpoints } from '../endpoints';
import { environment } from '../../../enviroments/enviroments';
import { registerLocaleData } from '@angular/common';
import { SongSimple } from '../models/song-simple';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchResults = new BehaviorSubject<SearchResponse>({ songs: [], artists: [], albums: [] });
  public searchResults$ = this.searchResults.asObservable();

  private cache = new Map<string, SearchResponse>();
  private currentQuery = '';

  constructor(private http: HttpClient) { }

  search(query: string, limit?: number): Observable<SearchResponse> {

    const key = query.trim().toLowerCase();
    
    if (!key || key.length < 3) {
      const empty = { songs: [], artists: [], albums: [] };
      this.searchResults.next(empty);
      return of(empty);
    }

    if (this.cache.has(key)) {
      const cachedResults = this.cache.get(key)!;
      const limitedResults = limit
        ? {
            songs: cachedResults.songs.slice(0, limit),
            artists: cachedResults.artists.slice(0, limit),
            albums: cachedResults.albums.slice(0, limit)
          }
        : cachedResults;

      this.searchResults.next(limitedResults); 

      return of(limitedResults);
    }

    const songParams = new HttpParams().set('title', query);
    const artistParams = new HttpParams().set('name', query);
    const albumParams = new HttpParams().set('title', query);

    const songs$ = this.http.get<any[]>(`${environment.apiUrl}${Endpoints.searchSongs}`,
       {params: songParams, withCredentials: true}).pipe(
      catchError(() => of([]))
    );

    const artists$ = this.http.get<any[]>(`${environment.apiUrl}${Endpoints.searchArtist}`,
       {params: artistParams, withCredentials: true}).pipe(
      catchError(() => of([]))
    );

    const albums$ = this.http.get<any[]>(`${environment.apiUrl}${Endpoints.searchAlbums}`,
       {params: albumParams, withCredentials: true}).pipe(
      catchError(() => of([]))
    );

    return forkJoin([songs$, artists$, albums$]).pipe(
      map(([songsData, artistsData, albumsData]) => {
        return {
          songs: songsData.map(d => new SongSimple(d)),
          artists: artistsData,
          albums: albumsData
        };
      }),
      tap(fullResults => {
        this.cache.set(key, fullResults);
        if (limit) {
          this.searchResults.next({
            songs: fullResults.songs.slice(0, limit),
            artists: fullResults.artists.slice(0, limit),
            albums: fullResults.albums.slice(0, limit)
          });
        } else {
          this.searchResults.next(fullResults);
        }
      }),
      map(fullResults => {
        if (limit) {
          return {
            songs: fullResults.songs.slice(0, limit),
            artists: fullResults.artists.slice(0, limit),
            albums: fullResults.albums.slice(0, limit)
          };
        }
        return fullResults;
      })
    );
  }
}
