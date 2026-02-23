import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Artist } from '../../../core/models/artist';
import { ArtistService } from '../../../core/services/artist.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { ArtistType } from '../../../core/models/enums/artist-type.enum';
import { DateDTO } from '../../../core/models/dateDTO';
import { Person } from '../../../core/models/person';
import { RoutePaths } from '../../../app.routes';


@Component({
  selector: 'app-edit-artists',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './edit-artists.component.html',
  styleUrl: './edit-artists.component.scss'
})
export class EditArtistsComponent implements OnInit {
  isAdmin: boolean = false;
  artistId!: number;
  artist: Artist = new Artist({
    id: 0,
    type: ArtistType.PERSON,
    startDate: new DateDTO(),
    endDate: new DateDTO(),
    person: {
      id: 0,
      firstName: '',
      lastName: '',
      stageName: '',
      birthday: null
    },
    band: null
  });

  selectedPersonsIds: number[] = [];
  existingPersons: Person[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
    if (!this.isAdmin) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      this.toastService.showError('Invalid artist ID!');
      return;
    }

    this.artistId = Number(idParam);

    this.loadPersons();

    this.artistService.getArtistById(this.artistId).subscribe({
      next: (artistData: Artist) => {
        this.artist = new Artist(artistData);

        this.artist.endDate ??= new DateDTO();

        if (this.artist.type === ArtistType.BAND) {
          this.selectedPersonsIds = this.artist.band?.members.map(member => member.id) || [];
        }
      },
      error: () => {
        this.toastService.showError('Failed to load artist!');
      }
    });
  }

  onSubmit(): void {
    if (!this.artistId || !this.artist) return;

    this.updateArtist();
  }

  loadPersons(): void {
    this.artistService.getAllPersons().subscribe({
      next: persons => this.existingPersons = persons,
      error: () => this.toastService.showError('Failed to load all persons!')
    });
  }

  private formatDate(date: any): string {
    const parsedDate = (date instanceof Date) ? date : new Date(date);
    return isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().split('T')[0];
  }

  updateArtist(): void {
    if (this.artist.type === ArtistType.BAND && this.artist.band) {
      this.artist.band.members = this.existingPersons
        .filter(p => this.selectedPersonsIds.includes(p.id))
        .map(p => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          stageName: p.stageName,
          birthday: p.birthday
        }));
    }

    const endDateToSend = this.artist.endDate?.year != null ? this.artist.endDate : null;

    const payload: any = {
      type: this.artist.type,
      startDate: this.artist.startDate,
      endDate: endDateToSend,
      person: this.artist.person ? {
        firstName: this.artist.person.firstName,
        lastName: this.artist.person.lastName,
        stageName: this.artist.person.stageName,
        birthday: this.formatDate(this.artist.person.birthday)
      } : null,
      band: this.artist.band ? {
        bandName: this.artist.band.bandName,
        location: this.artist.band.location,
        members: this.artist.band.members.map(m => ({
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          stageName: m.stageName,
          birthday: this.formatDate(m.birthday)
        }))
      } : null
    };

    this.artistService.updateArtist(this.artistId, payload).subscribe({
      next: () => {
        this.toastService.showSuccess("Artist updated successfully!");
        this.router.navigate([RoutePaths.artist, this.artistId])
      },
      error: () => this.toastService.showError('Failed to update Artist!')
    });
  }
}

