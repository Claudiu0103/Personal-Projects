// src/app/components/playlists/playlist-list/playlists.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UserService } from '../../../core/services/user.service';
import { PlaylistSimple } from '../../../core/models/playlist-simple';
import { PlaylistCardComponent } from '../playlist-card/playlist-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { RoutePaths } from '../../../app.routes';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    PlaylistCardComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: PlaylistSimple[] = [];
  error = '';
  RoutePaths = RoutePaths;

  // infinite scroll
  finishedPlaylists = false;
  isLoadingPlaylists = false;
  offset = 0;
  limit = 20;

  // follow state
  currentUserId!: number;
  followedIds: number[] = [];

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: user => {
        this.currentUserId = user.id;
        this.playlistService.getFollowed(this.currentUserId).subscribe({
          next: followed => {
            this.followedIds = followed.map(p => p.id);
            this.loadPlaylists();
          },
          error: () => {
            this.toastService.showError('Failed to load followed playlists!');
            this.loadPlaylists();
          }
        });
      },
      error: () => {
        this.toastService.showError('Failed to get current user!');
        this.loadPlaylists();
      }
    });

    this.setupScrollObserver();
  }

  loadPlaylists(): void {
    if (this.finishedPlaylists || this.isLoadingPlaylists) return;
    this.isLoadingPlaylists = true;
    this.playlistService.getPublicPaginated(this.offset, this.limit).subscribe({
      next: data => {
        if (data.length === 0) this.finishedPlaylists = true;
        this.playlists.push(...data);
        this.isLoadingPlaylists = false;
        this.offset += this.limit;
      },
      error: () => {
        this.isLoadingPlaylists = false;
        this.toastService.showError('Failed to load playlists!');
      }
    });
  }

  setupScrollObserver(): void {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = 100;
      if (scrollY + threshold >= totalHeight) {
        this.loadPlaylists();
      }
    });
  }

  onFollowToggled(playlistId: number, nowFollowing: boolean): void {
    if (nowFollowing) {
      this.playlistService.followPlaylist(this.currentUserId, playlistId).subscribe({
        next: () => {
          this.followedIds.push(playlistId);
          this.toastService.showSuccess('Playlist followed!');
        },
        error: () => this.toastService.showError('Failed to follow playlist!')
      });
    } else {
      this.playlistService.unfollowPlaylist(this.currentUserId, playlistId).subscribe({
        next: () => {
          this.followedIds = this.followedIds.filter(id => id !== playlistId);
          this.toastService.showSuccess('Playlist unfollowed!');
        },
        error: () => this.toastService.showError('Failed to unfollow playlist!')
      });
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
