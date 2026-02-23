import { Component, OnInit } from '@angular/core';
import { Artist } from '../../core/models/artist';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../core/services/artist.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ArtistType } from '../../core/models/enums/artist-type.enum';
import { ToastService } from '../../core/services/toast.service';
import { Person } from '../../core/models/person';
import { Album } from '../../core/models/album';
import { ScrollContainerComponent } from '../scroll-container/scroll-container.component';
import { AuthService } from '../../core/services/auth.service';
import { AlbumCardComponent } from '../albums/album-card/album-card.component';
import { SongSimple } from '../../core/models/song-simple';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-artist-info',
  imports: [CommonModule, ScrollContainerComponent, AlbumCardComponent, MatIconModule, MatButtonModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.scss'
})
export class ArtistInfoComponent implements OnInit {

  artist: Artist | null = null;
  readonly artistType = ArtistType;
  artistAlbums: Album[] = [];
  artistSongs: SongSimple[] = [];

  showPersonInfo: boolean = false;
  isAdmin: boolean = false;
  showBandInfo: boolean = false;

  constructor(private route: ActivatedRoute, private artistService: ArtistService, private toastService: ToastService, private router: Router, private authService: AuthService) { }

  goToEdit() {
    if (this.artist?.id) {
      this.router.navigate(['/artist', this.artist.id, 'edit']);
    }
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // get artist by id
      this.artistService.getArtistById(+id).subscribe({
        next: (artist) => {
          this.artist = artist;
        },
        error: (err) => this.toastService.showError('Failed to load artist')
      });

      // get albums for artist
      this.artistService.getArtistAlbums(+id).subscribe({
        next: (albums) => {
          this.artistAlbums = albums;
        },
        error: (err) => this.toastService.showError('Failed to load albums of artist')
      });

      // get songs for artist
      this.artistService.getArtistSongs(+id).subscribe({
        next: (songs) => {
          console.log('Songs:', songs);
          this.artistSongs = songs;
        },
        error: (err) => this.toastService.showError('Failed to load songs of artist')
      });
    }
  }
  togglePersonInfo(): void {
    this.showPersonInfo = !this.showPersonInfo;
  }

  toggleBandInfo(): void {
    this.showBandInfo = !this.showBandInfo;
  }

  getStartDate(): string {
    return this.artist?.startDate?.toString() || 'unknown';
  }

  getEndDate(): string {
    return this.artist?.endDate?.toString() || 'active';
  }

  getBirthday(person: Person | null | undefined): string {
    return person?.birthday ? person.birthday.toLocaleDateString('en-GB') : 'unknown';
  }

  getArtistNames(artists: { name: string }[] = []): string {
    return artists?.map(a => a.name).join(', ') || '';
  }

}
