import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlaylistService } from '../../../core/services/playlist.service';
import { SongSimple } from '../../../core/models/song-simple';
import { PlaylistSimple } from '../../../core/models/playlist-simple';
import { AuthService } from '../../../core/services/auth.service';
import { SongService } from '../../../core/services/song.service';
import { Song } from '../../../core/models/song';
import { ToastService } from '../../../core/services/toast.service';
import { SongDetailsModalComponent } from '../../songs/song-details-modal/song-details-modal.component';

import { SongCardComponent } from '../../songs/song-card/song-card.component';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, SongDetailsModalComponent, SongCardComponent],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit {
  playlistId!: number;
  playlistName = '';
  songs: SongSimple[] = [];
  error = '';
  @Output() songClicked = new EventEmitter<SongSimple>();
  isAdmin: boolean = false;
  selectedSong: Song | null = null;

  playlist!: PlaylistSimple;

  loggedUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private svc: PlaylistService,
    private authService: AuthService,
    private songService: SongService,
    private toastService: ToastService,
    private location: Location,
    private playlistService: PlaylistService
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.getRole() === 'ADMIN';

    const state = this.location.getState() as { playlist?: PlaylistSimple };

    this.loggedUserId = this.authService.getUserId();

    this.playlistId = Number(this.route.snapshot.paramMap.get('id'));

    this.playlistName = history.state?.name ?? '';

    if (!this.playlistName) {
      this.svc.getPublic().subscribe({
        next: (list: PlaylistSimple[]) => {
          this.playlistName = list.find(p => p.id === this.playlistId)?.name ?? `#${this.playlistId}`;
        },
        error: () => { }
      });
    }

    this.svc.getSongs(this.playlistId).subscribe({
      next: list => this.songs = list,
      error: err => this.error = err.message
    });

    if (state.playlist) {
      this.playlist = state.playlist;
    } else {
      this.svc.getPlaylistById(this.playlistId).subscribe({
    next: playlist => {
      console.log('Fetched playlist:', playlist);
      this.playlist = playlist;
      this.playlistName = playlist.name;
      this.songs = playlist.songs;
    },
    error: err => {
      console.error('Error loading playlist:', err);
      this.toastService.showError('Failed to load playlist: ' + (err.message || err.status));
    }
  });

    }
  }

  onSongClick(song: SongSimple) {
    this.openSongDetails(song);
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

  onDeletePlaylist() {
    this.playlistService.deletePlaylist(this.playlistId).subscribe({
      next: () => {
        this.toastService.showSuccess('Playlist deleted successfully!');
        this.location.back();
      },
      error: (err) => {
        this.toastService.showError('Error deleting the Playlist!');
      },
    });
  }

  onSongRemoved() {
    this.svc.getSongs(this.playlistId).subscribe({
      next: list => this.songs = list,
      error: err => this.error = err.message
    });
  }

}
