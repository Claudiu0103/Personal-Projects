import { Component, OnInit } from '@angular/core';
import { SongService } from '../../core/services/song.service';
import { SongSimple } from '../../core/models/song-simple';
import { SongListComponent } from '../song-list/song-list.component';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { SongDetailsModalComponent } from '../songs/song-details-modal/song-details-modal.component';
import { Song } from '../../core/models/song';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss',
  imports: [SongListComponent, CommonModule, SongDetailsModalComponent]
})

export class SongsComponent implements OnInit {

  songs: SongSimple[] = [];
  selectedSong: Song | null = null;
  isAdmin: boolean = false;

  offset:number =0;
  limit:number = 20;
  finishedSongs:boolean=false;
  isLoadingSongs:boolean=false;

  constructor(private songService: SongService, private toastService: ToastService, private authService: AuthService) { }

  loadSongs(): void{
    if(this.finishedSongs==true)
      return;
    if(this.isLoadingSongs==true)
      return;
    this.isLoadingSongs=true;
    this.songService.getPaginateSongs(this.offset, this.limit).subscribe({
      next: (data: SongSimple[]) => {
        if(data.length==0)
          this.finishedSongs=true;
        this.songs = [...this.songs, ...data.map(songData => new SongSimple(songData))];
        this.offset+=this.limit;
        this.isLoadingSongs=false;
      },
      error: () => {
        this.toastService.showError('Failed to load songs!');
        this.isLoadingSongs=false;
      },
    });
  }
  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
    this.loadSongs();
    this.observeScroll();
  }

  observeScroll() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const threshold = 100;

        if (scrollY + threshold >= totalHeight) {
            this.loadSongs();
        }
    });
  }



  openSongDetails(songSimple: SongSimple) {
    this.songService.getSongById(songSimple.id).subscribe({
      next: (songData) => this.selectedSong = new Song(songData),
      error: () => this.toastService.showError('Failed to load song details!')
    });
  }

  closeSongDetails() {
    this.selectedSong = null;
  }

}
