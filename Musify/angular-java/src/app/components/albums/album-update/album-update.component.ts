import { Component } from '@angular/core';
import { UpdateAlbumRequest } from '../../../core/models/updateAlbumRequest';
import { AlbumService } from '../../../core/services/album.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RoutePaths } from '../../../app.routes';

@Component({
  selector: 'app-album-update',
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule],
  templateUrl: './album-update.component.html',
  styleUrl: './album-update.component.scss'
})
export class AlbumUpdateComponent {
  originalTitle!: string;
  title!: string
  id!: number
  album: UpdateAlbumRequest = {
    description: '',
    genre: '',
    releaseDate: '',
    label: ''
  };

  constructor(
    private albumService: AlbumService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router

  ) { }
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(this.id)) {
      this.albumService.getAlbumById(this.id).subscribe({
        next: (albumData) => {
          this.originalTitle = albumData.title;
          this.title = albumData.title;
          this.album.description = albumData.description;
          this.album.genre = albumData.genre;
          this.album.releaseDate = albumData.releaseDate;
          this.album.label = albumData.label;
        },
        error: () => this.toastService.showError('Failed to load album details')
      });
    } else {
      this.toastService.showError('Invalid album ID');
    }
  }

  updateAlbum(form: NgForm): void {
    if (form.invalid) {
      this.toastService.showError('Please fill out all required fields!');
      return;
    }
    if (this.title !== this.originalTitle) {
      this.albumService.updateAlbumTitle(this.id, this.title).subscribe({
        next: () => {
          this.updateAlbumDetails();
        },
        error: () => this.toastService.showError('Failed to update album title')
      });
    } else {
      this.updateAlbumDetails();
    }

  }

  private updateAlbumDetails(): void {
    this.albumService.updateAlbumDetails(this.id, this.album).subscribe({
      next: () => {
        this.toastService.showSuccess('Album updated successfully');
        this.router.navigate([RoutePaths.albums, this.id])

      },
      error: () => this.toastService.showError('Failed to update album details')
    });
  }


}
