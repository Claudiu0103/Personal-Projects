import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';

import { Song } from '../../../core/models/song';
import { UserService } from '../../../core/services/user.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { AddToPlaylistDialogComponent } from '../../add-to-playlist-dialog/add-to-playlist-dialog.component';
import { PlaylistAddSong } from '../../../core/models/playlist-add-song';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-song-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './song-details-modal.component.html',
  styleUrls: ['./song-details-modal.component.scss']
})
export class SongDetailsModalComponent {
  @Input() song!: Song;
  @Input() isAdmin: boolean = false;
  @Input() existingSongIds: number[] = [];
  @Input() playlistId?: number;
  @Input() playlistOwnerId?: number;
  @Input() loggedUserId?: number;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() songRemoved = new EventEmitter<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private playlistService: PlaylistService,
    private toastService: ToastService
  ) { }

  onClose() {
    this.close.emit();
    this.audio.pause();
  }

  onEdit(): void {
    this.router.navigate(['/songs', this.song.id, 'edit']);
  }

  get showAddButton(): boolean {
    const inPlaylist = this.existingSongIds.includes(this.song.id);
    const isPlaylistRoute = this.router.url.includes('/playlists');
    return !inPlaylist && !isPlaylistRoute;
  }

  openAddToPlaylistDialog() {
    this.userService.getMe().pipe(
      switchMap(user =>
        forkJoin({
          public: this.playlistService.getPlaylistsByUser(user.id, true),
          private: this.playlistService.getPlaylistsByUser(user.id, false)
        }).pipe(
          map(result => [
            ...result.public,
            ...result.private
          ])
        )
      )
    ).subscribe({
      next: (allPlaylists: PlaylistAddSong[]) => {
        const ref = this.dialog.open(AddToPlaylistDialogComponent, {
          data: allPlaylists,
          width: '400px'
        });

        ref.componentInstance.playlistSelected
          .pipe(take(1))
          .subscribe((playlistId: number) => {
            this.playlistService.addSongToPlaylist(playlistId, this.song.id).subscribe({
              next: ()  => this.toastService.showSuccess('Song added to playlist!'),
              error: () => this.toastService.showError('Failed to add song to playlist!')
            });
            ref.close();
          });
      },
      error: err => {
        this.toastService.showError('Could not load playlists!');
      }
    });
  }

  removeFromPlaylist() {
    if (!this.playlistId || !this.song?.id) return;

    this.playlistService.removeSongFromPlaylist(this.playlistId, this.song.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Song removed from playlist!');
        this.songRemoved.emit();
        this.close.emit();
      },
      error: () => {
        this.toastService.showError('Failed to remove song from playlist!');
      }
    });
  }

  audio = new Audio('assets/EasterEgg.mp3');
  isPlaying = false;

  playButton(){
    if(!this.isPlaying)
    {
      this.audio.play().catch(error => {
      console.error('Failed to play audio:', error);
    })
    }
    else{
      this.audio.pause();
    }
    this.isPlaying = !this.isPlaying;
  }
}
