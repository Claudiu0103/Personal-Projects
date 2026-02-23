import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from '../../../core/models/album';
import { RoutePaths } from '../../../app.routes';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-album-card',
  imports: [MatIconModule],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.scss'
})
export class AlbumCardComponent {
  @Input() album!: Album;

  constructor(private router: Router){}

  onCardClick(): void{
    this.router.navigate([`${RoutePaths.albums}/${this.album.id}`]);
  }
}
