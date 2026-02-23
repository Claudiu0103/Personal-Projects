import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { PlaylistService } from '../../core/services/playlist.service';
import { ToastService } from '../../core/services/toast.service';
import { UserService } from '../../core/services/user.service';

import { CreatePlaylistRequest } from '../../core/models/createPlaylist-request';
import { PlaylistSimple } from '../../core/models/playlist-simple';
import { User } from '../../core/models/user';
import { PlaylistType } from '../../core/models/enums/playlist-type.enum';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';
import { Location } from '@angular/common';


@Component({
  selector: 'app-create-playlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {

  loadingUser = true;
  submitting = false;
  error = '';

  playlistTypes = Object.values(PlaylistType);

  playlist: CreatePlaylistRequest = {
    name: '',
    type: PlaylistType.PUBLIC,
    ownerId: 0
  };

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private toast: ToastService,
    private router:Router,
    private location:Location
  ) { }

  ngOnInit(): void {
    console.log('CreatePlaylistComponent loaded');
    this.userService.getMe().subscribe({
      next: (me: User) => {
        this.playlist.ownerId = me.id;
        this.loadingUser = false;
      },
      error: () => {
        this.loadingUser = false;
        this.error = 'Can\'t load current user!';
        this.toast.showError(this.error);
      }
    });
  }

  createPlaylist(form: NgForm): void {
    if (form.invalid || this.submitting) return;

    this.submitting = true;
    this.error = '';

    this.playlistService.create(this.playlist).subscribe({
      next: (_resp: PlaylistSimple) => {
        this.submitting = false;
        this.toast.showSuccess('Playlist created successfully!');
        form.resetForm({ type: PlaylistType.PUBLIC });
        this.location.back();
        
      },
      error: (err) => {
        this.submitting = false;
        const msg = err?.error?.message || err.message || 'Failed to create Playlist!';
        this.error = msg;
        this.toast.showError(msg);
      }
    });
  }
}
