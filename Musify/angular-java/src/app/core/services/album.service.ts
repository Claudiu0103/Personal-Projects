import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { AlbumSimple } from '../models/album-simple';
import { Endpoints } from '../endpoints';
import { Observable } from 'rxjs';
import { Album } from '../models/album';
import { CreateAlbumRequest } from '../models/createAlbum-request';
import { SongSimple } from '../models/song-simple';
import { UpdateAlbumRequest } from '../models/updateAlbumRequest';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient) { }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${environment.apiUrl}${Endpoints.listOfAlbums}`, { withCredentials: true })
  }

  getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${environment.apiUrl}${Endpoints.getAlbumById}/${id}`, { withCredentials: true, });
  }

  getSongsForAlbum(albumId: number): Observable<SongSimple[]> {
    const url = `${environment.apiUrl}${Endpoints.getSongsForAlbumId}/${albumId}`;
    return this.http.get<SongSimple[]>(url, { withCredentials: true });
  }

  getPaginateAlbums(offset: number, limit: number): Observable<Album[]> {
    return this.http.get<Album[]>(
      `${environment.apiUrl}${Endpoints.paginateAlbums}?offset=${offset}&limit=${limit}`,
      { withCredentials: true });
  }

  createAlbum(album: CreateAlbumRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${Endpoints.albumOperation}`, album, { withCredentials: true });
  }

  updateAlbumTitle(albumId: number, newAlbumTitle: string): Observable<Album> {
    const url = `${this.apiUrl}${Endpoints.updateAlbumTitle}/${albumId}`;
    const params = { newAlbumTitle };
    return this.http.put<Album>(url, null, { params, withCredentials: true });
  }

  updateAlbumDetails(albumId: number, updateAlbumDTO: UpdateAlbumRequest): Observable<Album> {
    const url = `${this.apiUrl}${Endpoints.updateAlbumDetails}/${albumId}`;
    return this.http.put<Album>(url, updateAlbumDTO, { withCredentials: true });
  }
}
