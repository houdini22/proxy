import Vue from 'vue'
import Router from 'vue-router'

import HomeComponent from '@/components/views/Home'
import ListComponent from '@/components/views/List'
import AboutComponent from '@/components/views/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeComponent
    },
    {
      path: '/list',
      name: 'List',
      component: ListComponent
    },
    {
      path: '/about',
      name: 'About',
      component: AboutComponent
    }
  ]
})
