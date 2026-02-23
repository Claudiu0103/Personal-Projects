

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PlaylistDetailsComponent } from './playlist-details.component';
import { PlaylistService } from '../../../core/services/playlist.service';
import { SongSimple } from '../../../core/models/song-simple';

describe('PlaylistDetailsComponent', () => {
  let comp: PlaylistDetailsComponent;
  let fixture: ComponentFixture<PlaylistDetailsComponent>;
  let svc: jasmine.SpyObj<PlaylistService>;

  beforeEach(async () => {
    svc = jasmine.createSpyObj('PlaylistService', ['getSongs']);
    await TestBed.configureTestingModule({
      imports: [PlaylistDetailsComponent],
      providers: [
        { provide: PlaylistService, useValue: svc },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id','42']]) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistDetailsComponent);
    comp = fixture.componentInstance;
  });

  it('loads songs on init', () => {
    const mock: SongSimple[] = [
      new SongSimple({ id:1, title:'A', duration:'3:00', album:{id:1,title:'X'}, artists:[] })
    ];
    svc.getSongs.and.returnValue(of(mock));
    fixture.detectChanges();
    expect(comp.songs).toEqual(mock);
  });

  it('shows error on failure', () => {
    svc.getSongs.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(comp.error).toBe('fail');
  });
});
