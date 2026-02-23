import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PlaylistCardComponent} from './playlist-card.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import {PlaylistSimple} from '../../../core/models/playlist-simple';

describe('PlaylistCardComponent', () => {
  let component: PlaylistCardComponent;
  let fixture: ComponentFixture<PlaylistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [PlaylistCardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistCardComponent);
    component = fixture.componentInstance;
  });

  it('renders playlist data', () => {
    component.playlist = {
      id: 1,
      name: 'Test',
      type: 'PUBLIC',
      owner: {id: 1, firstName: 'A', lastName: 'B', country: 't'},
      followers: [],
      songs: []
    };
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('h3').textContent).toContain('Test');
    expect(el.querySelector('.type').textContent).toContain('PUBLIC');
  });
});
