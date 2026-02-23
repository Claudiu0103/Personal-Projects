import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { PlaylistsComponent } from './components/playlists/playlist-list/playlists.component';
import { SongsComponent } from './components/songs/songs.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { CreateAlbumComponent } from './components/create-album/create-album.component';
import { CreateArtistComponent } from './components/create-artist/create-artist.component';
import { CreatePlaylistComponent } from './components/create-playlist/create-playlist.component';
import { CreateSongComponent } from './components/create-song/create-song.component';
import { AlbumDetailsComponent } from './components/albums/album-details/album-details.component';
import { PlaylistDetailsComponent } from './components/playlists/playlist-details/playlist-details.component';
import { EditSongComponent } from './components/songs/edit-song/edit-song.component';
import { EditArtistsComponent } from './components/artists/edit-artists/edit-artists.component';
import { AlbumUpdateComponent } from './components/albums/album-update/album-update.component';
import { ArtistInfoComponent } from './components/artist-info/artist-info.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { FollowedPlaylistsComponent } from './components/playlists/followed-playlists/followed-playlists.component';


export const RoutePaths = {
  login: 'login',
  register: 'register',
  home: 'home',
  artists: 'artists',
  albums: 'albums',
  playlists: 'playlists',
  songs: 'songs',
  search: 'searchResults',
  albumDetails: 'albums/:id',
  createArtist: 'createArtist',
  createAlbum: 'createAlbum',
  createPlaylist: 'createPlaylist',
  createSong: 'createSong',
  updateSong: 'songs/:id/edit',
  artist: 'artists',
  updateArtist: 'artist/:id/edit',
  userDashboard: 'userDashboard',
  favorites: 'playlists/me/playlists'
}

export const routes: Routes = [
  { path: RoutePaths.login, component: LoginComponent, canActivate: [guestGuard] },
  { path: RoutePaths.register, component: RegisterComponent, canActivate: [guestGuard] },
  {
    path: RoutePaths.albums, children: [
      { path: '', component: AlbumsComponent },
      { path: ':id', component: AlbumDetailsComponent },
      { path: ':id/edit', component: AlbumUpdateComponent }
    ], canActivate: [authGuard]
  },
  { path: RoutePaths.artists, component: ArtistsComponent, canActivate: [authGuard] },
  { path: RoutePaths.playlists, component: PlaylistsComponent, canActivate: [authGuard] },
  {
    path: RoutePaths.playlists,
    canActivate: [authGuard],
    children: [
      { path: '', component: PlaylistsComponent },
      { path: ':id', component: PlaylistDetailsComponent }
    ]
  },
  { path: RoutePaths.songs, component: SongsComponent, canActivate: [authGuard] },
  { path: RoutePaths.search, component: SearchPageComponent, canActivate: [authGuard] },
  { path: RoutePaths.home, component: HomeComponent, canActivate: [authGuard] },
  { path: RoutePaths.createAlbum, component: CreateAlbumComponent, canActivate: [authGuard] },
  { path: RoutePaths.createArtist, component: CreateArtistComponent, canActivate: [authGuard] },
  { path: RoutePaths.createPlaylist, component: CreatePlaylistComponent, canActivate: [authGuard] },
  { path: RoutePaths.createSong, component: CreateSongComponent, canActivate: [authGuard] },
  { path: RoutePaths.updateSong, component: EditSongComponent, canActivate: [authGuard] },
  { path: `${RoutePaths.artist}/:id`, component: ArtistInfoComponent, canActivate: [authGuard] },
  { path: RoutePaths.updateArtist, component: EditArtistsComponent, canActivate: [authGuard] },
  { path: RoutePaths.userDashboard, component: UserDashboardComponent, canActivate: [authGuard] },
  { path: RoutePaths.favorites, component: FollowedPlaylistsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: RoutePaths.login, pathMatch: 'full' },
  { path: '', redirectTo: RoutePaths.login, pathMatch: 'full' }
];
