import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SongService } from '../../core/services/song.service';
import { SongSimple } from '../../core/models/song-simple';
import { SongCardComponent } from '../songs/song-card/song-card.component';
import { Song } from '../../core/models/song';
import { SongDetailsModalComponent } from '../songs/song-details-modal/song-details-modal.component';
import { ScrollContainerComponent } from '../scroll-container/scroll-container.component';
import { ToastService } from '../../core/services/toast.service';
import { ArtistService } from '../../core/services/artist.service';
import { ArtistCardComponent } from '../artists/artist-card/artist-card.component';
import { ArtistSimple } from '../../core/models/artist-simple';
import { Album } from '../../core/models/album';
import { AlbumService } from '../../core/services/album.service';
import { AlbumCardComponent } from '../albums/album-card/album-card.component';
import { PlaylistCardComponent } from '../playlists/playlist-card/playlist-card.component';
import { PlaylistService } from '../../core/services/playlist.service';
import { PlaylistSimple } from '../../core/models/playlist-simple';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SongCardComponent, ScrollContainerComponent, 
    SongDetailsModalComponent, ArtistCardComponent, AlbumCardComponent, PlaylistCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  mostWantedSongs: SongSimple[] = [];
  allSongs: SongSimple[] = [];
  selectedSong: Song | null = null;
  artists: ArtistSimple[] = [];
  albums: Album[] = [];
  playlists: PlaylistSimple[] = [];
  isAdmin: boolean = false;

  constructor(
    private playlistService: PlaylistService,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private songService: SongService,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
 
    this.isAdmin = this.authService.getRole() === 'ADMIN';

    this.songService.getMostWantedSongs(25).subscribe({
      next: (songs) => this.mostWantedSongs = songs.map(songData => new SongSimple(songData)),
      error: () => this.toastService.showError('Failed to load most wanted songs!')
    });

    this.artistService.getListOfArtists().subscribe({
      next:(artists:ArtistSimple[])=> this.artists=artists,
      error:() => this.toastService.showError('Failed to load artists')
    });

    this.albumService.getAlbums().subscribe({
      next:(albums:Album[])=> this.albums=albums,
      error:() => this.toastService.showError('Failed to load albums')
    });

    this.playlistService.getPublic().subscribe({
      next:(playlists:PlaylistSimple[])=>this.playlists=playlists,
      error:() => this.toastService.showError('Failed to load playlists')
    })
    
  }

  openSongDetails(songSimple: SongSimple) {
    this.songService.getSongById(songSimple.id).subscribe({
      next: (songData) => this.selectedSong = new Song(songData),
      error: () => this.toastService.showError('Failed to load song details!')
    })
  }

  closeSongDetails() {
    this.selectedSong = null;
  }
}
