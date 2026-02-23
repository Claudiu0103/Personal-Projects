import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../core/services/artist.service';
import { ToastService } from '../../core/services/toast.service';
import { Person } from '../../core/models/person';
import { Artist } from '../../core/models/artist';
import { DateDTO } from '../../core/models/dateDTO';
import { ArtistType } from '../../core/models/enums/artist-type.enum';
import { RoutePaths } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-artist',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './create-artist.component.html',
  styleUrl: './create-artist.component.scss'
})
export class CreateArtistComponent implements OnInit {
  nonWhitespacePattern = '.*\\S.*';
  selectedPersonsIds: number[] = [];
  existingPersons: Person[] = [];

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

  constructor(
    private artistService: ArtistService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  onTypeChange(): void {
    if (this.artist.type === ArtistType.PERSON) {
      this.artist.person = {
        id: 0,
        firstName: '',
        lastName: '',
        stageName: '',
        birthday: null
      };
      this.artist.band = null;
    } else if (this.artist.type === ArtistType.BAND) {
      this.artist.band = {
        id: 0,
        bandName: '',
        location: '',
        members: []
      };
      this.artist.person = null;
    }
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

  createArtist(): void {
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
          firstName: m.firstName,
          lastName: m.lastName,
          stageName: m.stageName,
          birthday: this.formatDate(m.birthday)
        }))
      } : null
    };
    this.artistService.createArtist(payload).subscribe({
      next: () => {
        this.toastService.showSuccess("Artist created successfully!");
        this.router.navigate([RoutePaths.artist])
      },
      error: () => this.toastService.showError('Failed to create Artist!')
    });
  }

}
