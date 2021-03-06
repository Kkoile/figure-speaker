import Spotify from '../components/Spotify';
import Artist from '../components/Artist';
import Album from '../components/Album';
import ManageAccount from '../components/ManageAccount';

export default [
  {
    path: '/spotify',
    name: 'spotify',
    component: Spotify
  },
  {
    path: '/spotify/artist/:id',
    name: 'SpotifyArtist',
    component: Artist
  },
  {
    path: '/spotify/album/:id',
    name: 'SpotifyAlbum',
    component: Album
  },
  {
    path: '/spotify/manageAccount',
    name: 'SpotifyManageAccount',
    component: ManageAccount
  }
];
