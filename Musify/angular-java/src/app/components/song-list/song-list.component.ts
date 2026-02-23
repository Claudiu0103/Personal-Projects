import { Component, Input,  Output, EventEmitter } from '@angular/core';
import { SongSimple } from '../../core/models/song-simple';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SongCardComponent } from '../songs/song-card/song-card.component';
@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, SongCardComponent],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss'
})

export class SongListComponent {
  @Input() songs: SongSimple[] = [];

  @Output() songClicked = new EventEmitter<SongSimple>();

  onSongClick(song: SongSimple) {
    this.songClicked.emit(song);
  }

}




