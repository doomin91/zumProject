import {
    SET_ACCESS_TOKEN,
    SET_MY_INFO,
    SET_MENU_LIST,
  } from './mutation-types'
  import VueCookies from 'vue-cookies';
  import http from '@/api/http'
  
export default {
    [SET_ACCESS_TOKEN] (state, accessToken) {
      if (accessToken) {
        state.accessToken = accessToken
  
        http.defaults.headers.common.accessToken = `${accessToken}`

        VueCookies.set('accessToken', accessToken)

      }
    },
    [SET_MY_INFO] (state, myinfo) {
      if (myinfo) {
        state.myinfo = myinfo
      }
    },
    [SET_MENU_LIST] (state, menuList) {
      if(menuList){
        state.menuList = menuList
      }
    }
  }
  