import { Component, Input } from '@angular/core';
import { ArtistSimple } from '../../../core/models/artist-simple';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../app.routes';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-artist-card',
  imports: [MatIconModule],
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.scss'
})
export class ArtistCardComponent {
  @Input() artist!: ArtistSimple;

  constructor(private router: Router) { }

  onCardClick(): void {
    this.router.navigate([`/${RoutePaths.artist}`, this.artist.id]);
  }

}
