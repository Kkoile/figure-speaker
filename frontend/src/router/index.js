import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import Settings from '@/components/Settings';
import Spotify from '@/lib/spotify/router/index';
import Mp3 from '@/lib/mp3/router/index';
import Youtube from '@/lib/youtube/router/index';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    ...Spotify,
    ...Mp3,
    ...Youtube
  ]
});
