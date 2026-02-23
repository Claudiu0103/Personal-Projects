import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongSimple } from '../../../core/models/song-simple';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlaylistDialogComponent } from '../../add-to-playlist-dialog/add-to-playlist-dialog.component';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { PlaylistSimple } from '../../../core/models/playlist-simple';
import { User } from '../../../core/models/user';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss'
})
export class SongCardComponent {
  @Input() song!: SongSimple;
  @Output() clicked = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private playlistService: PlaylistService,
    private userService: UserService,
    private toast: ToastService
  ) {}

  onClick(): void {
    this.clicked.emit();
  }
  /*
  openAddToPlaylistDialog(): void {
    this.userService.getMe().subscribe({
      next: (user: User) => {
        this.playlistService.getPlaylistsByUser(user.id).subscribe({
          next: (playlists: PlaylistSimple[]) => {
            const dialogRef = this.dialog.open(AddToPlaylistDialogComponent, {
              data: { playlists }
            });

            dialogRef.componentInstance.playlistSelected.subscribe((playlistId: number) => {
              this.addToPlaylist(playlistId);
              dialogRef.close();
            });
          },
          error: () => this.toast.showError('Could not fetch playlists')
        });
      },
      error: () => this.toast.showError('Could not fetch user info')
    });
  }

  private addToPlaylist(playlistId: number): void {
    this.playlistService.addSongToPlaylist(playlistId, this.song.id).subscribe({
      next: () => this.toast.showSuccess('Song added to playlist!'),
      error: () => this.toast.showError('Could not add song to playlist')
    });
  }
  */
}
