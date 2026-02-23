import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlaylistSimple } from '../../../core/models/playlist-simple';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoutePaths } from '../../../app.routes';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss']
})
export class PlaylistCardComponent {
  @Input() playlist!: PlaylistSimple;
  @Input() isFollowed = false;
  @Input() playlistOwnerId?: number;
  @Input() loggedUserId?: number;
  @Output() followToggled = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  goToDetail() {
    this.router.navigate(
      [RoutePaths.playlists, this.playlist.id],
      { state: { playlist: this.playlist } }
    );
  }

  onToggleFollow(event: MouseEvent) {
    event.stopPropagation();
    this.followToggled.emit(!this.isFollowed);
  }
}
