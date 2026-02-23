import { Component, EventEmitter, Output, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PlaylistAddSong } from '../../core/models/playlist-add-song';

@Component({
  selector: 'app-add-to-playlist-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './add-to-playlist-dialog.component.html',
  styleUrl: './add-to-playlist-dialog.component.scss'
})
export class AddToPlaylistDialogComponent {
  @Output() playlistSelected = new EventEmitter<number>();
  selectedPlaylistId: number | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public playlists: PlaylistAddSong[]) { }

  submit(): void {
    if (this.selectedPlaylistId !== null) {
      this.playlistSelected.emit(this.selectedPlaylistId);
    }
  }
}
