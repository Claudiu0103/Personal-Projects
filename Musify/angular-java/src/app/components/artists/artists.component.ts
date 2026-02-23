import { Component, OnInit } from '@angular/core';
import { ArtistSimple } from '../../core/models/artist-simple';
import { ArtistService } from '../../core/services/artist.service';
import { ArtistCardComponent } from './artist-card/artist-card.component';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [ArtistCardComponent, CommonModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss'
})
export class ArtistsComponent implements OnInit{
  artists: ArtistSimple[] = [];

  offset: number=0;
  limit: number=20;
  finishedArtists:boolean=false;
  isLoadingArtists:boolean=false;


  constructor(private artistService: ArtistService, private toastService: ToastService){}

  loadArtists(){
    if(this.finishedArtists==true)
      return;
    if(this.isLoadingArtists==true)
      return;
    this.isLoadingArtists=true;
    this.artistService.getPaginateArtists(this.offset, this.limit).subscribe({
      next: (data:ArtistSimple[]) =>  {
        if(data.length==0)
          this.finishedArtists=true;
        console.log(data);
        this.artists = [...this.artists, ...data];
        this.isLoadingArtists=false;
        this.offset+=this.limit;
      },
      error: (err) => {
        this.isLoadingArtists=false;
        this.toastService.showError('Failed to load list of artists')
      }
    });
  }

  ngOnInit(): void{
    this.loadArtists();
    this.observeScroll();
  }

  observeScroll() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const threshold = 100;

        if (scrollY + threshold >= totalHeight) {
            this.loadArtists();
        }
    });
  }
}
