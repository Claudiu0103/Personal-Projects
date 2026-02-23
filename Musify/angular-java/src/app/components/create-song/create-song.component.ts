import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SongService } from '../../core/services/song.service';
import { ArtistService } from '../../core/services/artist.service';
import { ToastService } from '../../core/services/toast.service';
import { ArtistSimple } from '../../core/models/artist-simple';
import { SongOperation } from '../../core/models/song-operation';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';

@Component({
  selector: 'app-create-song',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-song.component.html',
  styleUrl: './create-song.component.scss'
})
export class CreateSongComponent {

  song: SongOperation = {
    title: '',
    duration: '',
    alternativeTitles: [
      { title: '', language: '' },
      { title: '', language: '' },
      { title: '', language: '' }
    ],
    artistIds: []
  }

  allArtists: ArtistSimple[] = [];
  selectedArtistIds: number[] = [];

  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getListOfArtists().subscribe({
      next: artists => this.allArtists = artists,
      error: () => this.toastService.showError('Failed to load all artists!')
    })
  }

  createSong(): void {
    this.song.artistIds = this.selectedArtistIds;

    const filteredAlternativeTitles = this.song.alternativeTitles.filter(
      altTitle => altTitle.title && altTitle.title.trim() !== ''
    );

    const songToSend: SongOperation = {
      ...this.song,
      alternativeTitles: filteredAlternativeTitles
    }

    this.songService.createSong(songToSend).subscribe({
      next: () => {
        this.toastService.showSuccess("Song created successfully!")
        this.router.navigate([RoutePaths.songs])
      },
      error: () => this.toastService.showError('Failed to create Song!')
    });
  }

}
