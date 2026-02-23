import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedPlaylistsComponent } from './followed-playlists.component';

describe('FollowedPlaylistsComponent', () => {
  let component: FollowedPlaylistsComponent;
  let fixture: ComponentFixture<FollowedPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowedPlaylistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowedPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
