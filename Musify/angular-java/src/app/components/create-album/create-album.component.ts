import { Component } from '@angular/core';
import { AlbumService } from '../../core/services/album.service';
import { CreateAlbumRequest } from '../../core/models/createAlbum-request';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SongForAlbum } from '../../core/models/songForAlbum';
import { SongService } from '../../core/services/song.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { ArtistService } from '../../core/services/artist.service';
import { ArtistForAlbum } from '../../core/models/artistForAlbum';
import { ArtistSimple } from '../../core/models/artist-simple';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';

@Component({
  selector: 'app-create-album',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './create-album.component.html',
  styleUrl: './create-album.component.scss'
})
export class CreateAlbumComponent {

  album: CreateAlbumRequest = {
    title: '',
    description: '',
    genre: '',
    releaseDate: '',
    label: '',
    artistId: null,
    songIdList: []
  };

  allArtists: ArtistForAlbum[] = [];
  allSongs: SongForAlbum[] = [];
  selectedSongIds: number[] = [];
  selectedArtistId = null;

  constructor(
    private albumService: AlbumService,
    private songService: SongService,
    private toastService: ToastService,
    private artistService: ArtistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSongs();
    this.loadArtists();
  }

  loadSongs(): void {
    this.songService.getAllSongsForAlbum().subscribe({
      next: songs => this.allSongs = songs,
      error: () => this.toastService.showError(
        'Failed to load all songs!'
      )
    });
  }
  loadArtists(): void {
    this.artistService.getListOfArtists().subscribe({
      next: artists => this.allArtists = artists,
      error: () => this.toastService.showError(
        'Failed to load all artists!'
      )
    })
  }


  createAlbum(): void {
    if (
      !this.album.title.trim() ||
      !this.album.genre.trim() ||
      !this.album.releaseDate.trim() ||
      this.album.artistId === null
    ) {
      this.toastService.showError('Failed to create Album!');
      return;
    }

    const today = new Date();
    const enteredDate = new Date(this.album.releaseDate);
    if (enteredDate > today) {
      this.toastService.showError('Release date cannot be in the future!');
      return;
    }

    this.album.songIdList = this.selectedSongIds;

    this.albumService.createAlbum(this.album).subscribe({
      next: () => {
        this.toastService.showSuccess("Album created successfully!");
        this.router.navigate([RoutePaths.albums]);
      },
      error: () => this.toastService.showError('Failed to create Album!')
    });
  }
}
