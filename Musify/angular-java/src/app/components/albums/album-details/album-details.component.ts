import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Album } from '../../../core/models/album';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../../../core/services/album.service';
import { SongSimple } from '../../../core/models/song-simple';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-album-details',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.scss'
})
export class AlbumDetailsComponent {
  album!: Album | null;
  songs: SongSimple[] = [];
  userRole: string | null = null;



  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.albumService.getAlbumById(id).subscribe({
          next: (album) => (this.album = album),
          error: () => this.toastService.showError('Failed to load album details')
        });

        this.albumService.getSongsForAlbum(id).subscribe({
          next: (songs) => (this.songs = songs),
          error: () => this.toastService.showError('Failed to load songs')
        });
      } else {
        this.toastService.showError('Invalid album id');
      }
    }
  }

  getArtistNames(artists: { name: string }[] = []): string {
    return artists?.map(a => a.name).join(', ') || '';
  }

  goToEdit() {
    if (this.album) {
      this.router.navigate(['/albums', this.album.id, 'edit']);
    }
  }

}
