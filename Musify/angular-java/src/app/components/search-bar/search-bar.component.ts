import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SearchResponse } from '../../core/models/search-response';
import { SearchService } from '../../core/services/search.service';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RoutePaths } from '../../app.routes';

@Component({
  selector: 'app-search-bar',
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit{

  RoutePaths = RoutePaths; 
  searchTerm: string = '';
  showResultsOverlay: boolean = false;
  private searchTerms = new Subject<string>();
  searchResults$: Observable<SearchResponse>;

  constructor(private router: Router, private searchService: SearchService) {
    this.searchResults$ = this.searchService.searchResults$;
  }

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => this.showResultsOverlay = term.trim().length >= 3),
      switchMap(term => this.searchService.search(term, 3))
    ).subscribe();
  }

  onSearchInput(): void {
    this.searchTerms.next(this.searchTerm);
  }

   hideOverlay(): void {
    setTimeout(() => this.showResultsOverlay = false, 200);
  }

  goToFullSearch(): void {
    if(this.searchTerm.trim().length >= 3) {
      this.showResultsOverlay = false;
      this.searchService.search(this.searchTerm).subscribe(() => {
        this.router.navigate([RoutePaths.search], { queryParams: {q: this.searchTerm }});
      });
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.showResultsOverlay = false;
    this.searchTerms.next('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const results = this.searchService['searchResults'].getValue(); 

      const hasResults = results.songs.length > 0 || results.artists.length > 0 || results.albums.length > 0;

      if (hasResults) {
        this.goToFullSearch();
      } else {
        console.log('No results found, not navigating');
      }
    } else if(event.key === 'Escape') {
      this.hideOverlay();
    }
  }

  navigateTo(item: any, type: 'song' | 'artist' | 'album'): void{
    this.showResultsOverlay = false;
    this.searchTerm = '';
    this.searchTerms.next('');

    if(type === 'song') {
      this.router.navigate([RoutePaths.search], {
      queryParams: { q: item.title }
    });
    } else {
      this.searchTerm = '';
      this.searchTerms.next('');
      this.router.navigate([`/${type}s`, item.id]);
    }
  };
}
