import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { SongService } from '../../../core/services/song.service';
import { ArtistService } from '../../../core/services/artist.service';
import { ToastService } from '../../../core/services/toast.service';
import { SongOperation } from '../../../core/models/song-operation';
import { Song } from '../../../core/models/song';
import { ArtistSimple } from '../../../core/models/artist-simple';
import { RoutePaths } from '../../../app.routes';


@Component({
  selector: 'app-edit-song',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss'
})
export class EditSongComponent implements OnInit {
  isAdmin: boolean = false;
  songId!: number;
  existingAltTitles: { title: string; language?: string }[] = [];
  newAltTitles: { title: string; language?: string }[] = [];
  allArtists: ArtistSimple[] = [];
  selectedArtistIds: number[] = [];

  song: SongOperation = {
    title: '',
    duration: '',
    alternativeTitles: [],
    artistIds: []
  };

  artistsInput: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private songService: SongService,
    private artistService: ArtistService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ADMIN';

    if (!this.isAdmin) return;

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(Number(idParam))) {
      this.toastService.showError('Invalid song ID!');
      return;
    }

    this.songId = Number(idParam);
    this.loadArtists();

    this.songService.getSongById(this.songId).subscribe({
      next: (songData: Song) => {
        this.song = {
          title: songData.title,
          duration: songData.duration,
          alternativeTitles: songData.alternativeTitles || [],
          artistIds: songData.artists?.map(artist => artist.id) || []
        };
        this.selectedArtistIds = this.song.artistIds;

        this.existingAltTitles = songData.alternativeTitles || [];
        this.newAltTitles = Array.from({ length: 3 }, () => ({ title: '', language: '' }));

        this.artistsInput = this.song.artistIds.join(', ');
      },
      error: () => this.toastService.showError('Failed to load song!')
    });
  }

  loadArtists(): void {
    this.artistService.getListOfArtists().subscribe({
      next: artists => this.allArtists = artists,
      error: () => this.toastService.showError('Failed to load all artists!')
    })
  }

  onSubmit(): void {
    if (!this.songId || isNaN(this.songId)) {
      this.toastService.showError('Invalid song ID!');
      return;
    }

    const filledNewTitles = this.newAltTitles.filter(alt => alt.title?.trim());

    this.song.alternativeTitles = filledNewTitles;
    this.song.artistIds = this.selectedArtistIds;

    this.songService.updateSong(this.songId, this.song).subscribe({
      next: () => {
        this.toastService.showSuccess('Song updated successfully!');
        this.router.navigate([RoutePaths.songs])
      },
      error: () => this.toastService.showError('Failed to update song!')
    });
  }
}