import { Component, OnInit } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { SearchResponse } from '../../core/models/search-response';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { SongCardComponent } from '../songs/song-card/song-card.component';
import { ArtistCardComponent } from '../artists/artist-card/artist-card.component';
import { SongListComponent } from '../song-list/song-list.component';
import { SongDetailsModalComponent } from '../songs/song-details-modal/song-details-modal.component';
import { Song } from '../../core/models/song';
import { SongSimple } from '../../core/models/song-simple';
import { ArtistSimple } from '../../core/models/artist-simple';
import { Album } from '../../core/models/album';
import { SongService } from '../../core/services/song.service';
import { ToastService } from '../../core/services/toast.service';
import { AlbumCardComponent } from '../albums/album-card/album-card.component';
import { AuthService } from '../../core/services/auth.service';
import { ScrollContainerComponent } from '../scroll-container/scroll-container.component';

@Component({
  selector: 'app-search-page',
  imports: [
    CommonModule,
    AsyncPipe,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    SongCardComponent,
    ArtistCardComponent,
    SongDetailsModalComponent,
    AlbumCardComponent,
    ScrollContainerComponent
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit{
  searchResults$!: Observable<SearchResponse>;
  currentQuery: string = '';
  selectedSong: Song | null = null;
  isAdmin: boolean = false;
  
  constructor(
    private route: ActivatedRoute, 
    private router:  Router, 
    private searchService: SearchService,
    private songService: SongService, 
    private toastService: ToastService,
    private authService: AuthService
  ) {}

   ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
    
    this.searchResults$ = this.route.queryParamMap.pipe(
    tap(params => {
      this.currentQuery = params.get('q') || '';
    }),
    switchMap(() => {
      if (this.currentQuery.trim().length >= 3) {
        return this.searchService.search(this.currentQuery);
      } else {
        return of({ songs: [], artists: [], albums: [] });
      }
    })
);

  }

  scrollLeft(container: HTMLElement): void {
    container.scrollBy({ left: -container.clientWidth * 0.9, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement): void {
    container.scrollBy({ left: container.clientWidth * 0.9, behavior: 'smooth' });
  }

   openSongDetails(songSimple: SongSimple): void {
    this.songService.getSongById(songSimple.id).subscribe({
      next: (songData) => this.selectedSong = new Song(songData),
      error: () => this.toastService.showError('Failed to load song details!')
    });
  }

  closeSongDetails(): void {
    this.selectedSong = null;
  }

}
