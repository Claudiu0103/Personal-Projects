import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlaylistCardComponent } from '../playlist-card/playlist-card.component';
import { forkJoin, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { PlaylistService } from '../../../core/services/playlist.service';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.service';
import { PlaylistSimple } from '../../../core/models/playlist-simple';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { RoutePaths } from '../../../app.routes';
import { ToastService } from '../../../core/services/toast.service';

interface MyPlaylistsViewModel {
  followed: PlaylistSimple[];
  owned: PlaylistSimple[];
}

@Component({
  selector: 'app-followed-playlists',
  standalone: true,
  imports: [
    CommonModule,
    PlaylistCardComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './followed-playlists.component.html',
  styleUrls: ['./followed-playlists.component.scss']
})
export class FollowedPlaylistsComponent implements OnInit {
  RoutePaths = RoutePaths;

  playlists$!: Observable<PlaylistSimple[]>;
  viewModel$!: Observable<MyPlaylistsViewModel>;

  currentUserId!: number;
  followedIds: number[] = [];

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.userService.getMe().pipe(take(1)).subscribe(user => {
      this.currentUserId = user.id;
    });

    this.viewModel$ = forkJoin({
      followed: this.playlistService.getFollowedPlaylists(),
      owned: this.playlistService.getOwnedPlaylists()
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onFollowToggled(playlistId: number, nowFollowing: boolean): void {
    this.viewModel$ = forkJoin({
      followed: this.playlistService.getFollowedPlaylists(),
      owned: this.playlistService.getOwnedPlaylists()
    });
    if (nowFollowing) {
      this.playlistService.followPlaylist(this.currentUserId, playlistId).subscribe({
        next: () => {
          this.followedIds.push(playlistId);
          this.toastService.showSuccess('Playlist followed');
        },
        error: () => this.toastService.showError('Failed to follow playlist')
      });
    } else {
      this.playlistService.unfollowPlaylist(this.currentUserId, playlistId).subscribe({
        next: () => {
          this.followedIds = this.followedIds.filter(id => id !== playlistId);
          this.toastService.showSuccess('Playlist unfollowed');
        },
        error: () => this.toastService.showError('Failed to unfollow playlist')
      });
    }
  }
}
