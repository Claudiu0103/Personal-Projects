import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../core/services/album.service';
import { Album } from '../../core/models/album';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { AlbumCardComponent } from './album-card/album-card.component';
import { AlbumSimple } from '../../core/models/album-simple';

@Component({
  selector: 'app-albums',
  standalone: true,
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.scss',
  imports:[CommonModule,AlbumCardComponent]
})
export class AlbumsComponent implements OnInit{

  albums: Album[] = [];

  offset: number = 0;
  limit: number = 20;
  finishedAlbums: boolean = false;
  isLoadingAlbums: boolean = false;

  constructor(private albumService:AlbumService,
        private toastService: ToastService
  ){}

  loadAlbums(): void {
    if(this.finishedAlbums == true) return;
    if(this.isLoadingAlbums == true) return;

    this.isLoadingAlbums = true;
    this.albumService.getPaginateAlbums(this.offset, this.limit).subscribe({
      next: (data: Album[]) => {
          if(data.length == 0) this.finishedAlbums = true;
          this.albums = [...this.albums, ...data];
          this.offset += this.limit;
          this.isLoadingAlbums = false;
      },
      error: () => {
        this.toastService.showError('Failed to load albums!');
        this.isLoadingAlbums = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAlbums();
    this.observeScroll();
  }

  observeScroll() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const threshold = 100;

        if (scrollY + threshold >= totalHeight) {
            this.loadAlbums();
        }
    });
  }

}
