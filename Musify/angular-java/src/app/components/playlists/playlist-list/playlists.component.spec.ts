import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PlaylistsComponent } from './playlists.component';
import { PlaylistService } from '../../../core/services/playlist.service';
import { PlaylistSimple } from '../../../core/models/playlist-simple';

describe('PlaylistsComponent', () => {
  let component: PlaylistsComponent;
  let fixture: ComponentFixture<PlaylistsComponent>;
  let svc: jasmine.SpyObj<PlaylistService>;

  beforeEach(async () => {
    svc = jasmine.createSpyObj('PlaylistService', ['getPublic']);

    await TestBed.configureTestingModule({
      // imports: [RouterTestingModule],
      declarations: [PlaylistsComponent],
      providers: [{ provide: PlaylistService, useValue: svc }]
    }).compileComponents();


    fixture = TestBed.createComponent(PlaylistsComponent);
    component = fixture.componentInstance;
  });

  it('should load playlists on init', () => {
    const mock: PlaylistSimple[] = [
      { id:1, name:'Chill', type:'PUBLIC', owner:{id:1,firstName:'A',lastName:'B', country:'t'}, followers:[], songs:[] }
    ];
    svc.getPublic.and.returnValue(of(mock));

    fixture.detectChanges(); // ngOnInit()
    expect(component.playlists).toEqual(mock);
  });

  it('should show error message', () => {
    svc.getPublic.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    expect(component.error).toBe('fail');
  });
});
