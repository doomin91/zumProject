import http from '@/api/http'
import {
    SET_ACCESS_TOKEN,
    SET_MY_INFO,
    SET_MENU_LIST
  } from './mutation-types'
import md5 from 'js-md5';
import VueCookies from 'vue-cookies'


export default {
    signin({ commit }, data){
        return http.post('/auth/login', {
            userid: data.mMemID,
            userpwd: md5(data.mMemPwd)
        }).then(res=>{
            // console.log(res);
            if(res.data.code == 200){
                const accessToken = res.data.result.access_token
                VueCookies.set("USER_ID",res.data.result.userid)
                commit(SET_ACCESS_TOKEN, accessToken)
                return http.post('/auth/getUserInfo', {
                    USER_ID:data.mMemID
                })
            } else {
                return res;
            }
        }).then(res => {
            if(res.data.code == 200){
                commit(SET_MY_INFO, res.data)
                return res.data;
            }else {
                return res.data;
            }
        })
    },
    signinByToken ({ commit }, token) {
    commit(SET_ACCESS_TOKEN, token)
    return http.post('/auth/getUserInfo').then(res => {
            if(res.data.code != 200){
                return false
            }else{
                // console.log(res);
                // console.log(this);
                VueCookies.set("USER_SEQ", res.data.data.USER_SEQ)
                VueCookies.set("USER_ID", res.data.data.USER_ID)
                VueCookies.set("USER_AUTH", res.data.data.USER_AUTH)
                VueCookies.set("USER_DEPARTMENT_SEQ", res.data.data.USER_DEPARTMENT);
                VueCookies.set("UserInfo", res.data.data);
                commit(SET_MY_INFO, res.data.data)
            }
        })
    },
    setMenuList({ commit }, menuList){
        if(menuList){
            commit(SET_MENU_LIST, menuList);
        }
    }
}