import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
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
      path: '/artist/:id',
      name: 'Artist',
      component: Artist
    },
    {
      path: '/album/:id',
      name: 'Album',
      component: Album
    }
  ]
})
