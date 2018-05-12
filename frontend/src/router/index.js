import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Accounts from '@/components/Accounts'
import ManageAccount from '@/components/ManageAccount'
import Spotify from '@/components/Spotify'
import Youtube from '@/components/Youtube'
import Mp3 from '@/components/Mp3'
import Artist from '@/components/Artist'
import Album from '@/components/Album'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/accounts',
      name: 'Accounts',
      component: Accounts
    },
    {
      path: '/accounts/:hostId',
      name: 'ManageAccount',
      component: ManageAccount
    },
    {
      path: '/youtube',
      name: 'Youtube',
      component: Youtube
    },
    {
      path: '/mp3',
      name: 'Mp3',
      component: Mp3
    },
    {
      path: '/spotify',
      name: 'Spotify',
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
    }
  ]
})
