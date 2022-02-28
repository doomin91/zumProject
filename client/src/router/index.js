import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';

/* layout component*/

/* 사용자 관리 */
import UserList from '../views/setting/userList';
import UserDetail from '../views/setting/userDetail';
import UserRegist from '../views/setting/userRegist';

import NotFound from '../views/pages/404';
import Forbidden from '../views/pages/403';
import ServerError from '../views/pages/500';

Vue.use(VueRouter);
Vue.use(Vuelidate);

const router = new VueRouter({
    mode: "history",
    linkActiveClass: 'active',
    routes:[
        {
            path:"/", //경로
            name:"userList", //해당 경로의 이름 
            component:UserList, //이동할 컴포넌트
            meta: { authRequired : true, active: "/userList" }
        },
        {
            path:"/userList", //경로
            name:"userList", //해당 경로의 이름 
            component:UserList, //이동할 컴포넌트
            meta: { authRequired : true, active: "/userList" }
        },
        {
            path:"/userDetail", //경로
            name:"userDetail", //해당 경로의 이름 
            component:UserDetail, //이동할 컴포넌트
            meta: { authRequired : true, active: "/userList" }

        },
        {
            path:"/userRegist", //경로
            name:"userRegist", //해당 경로의 이름 
            component:UserRegist, //이동할 컴포넌트
            meta: { authRequired : true, active: "/userList" }

        },

        /************************ component test ************************/
        {
            path:"/404",
            name:"404",
            component:NotFound,
            meta: { layout : 'BlankLayout'}
        },
        {
            path:"/403",
            name:"403",
            component:Forbidden,
            meta: { layout : 'BlankLayout'}
        },
        {
            path:"/500",
            name:"500",
            component:ServerError,
            meta: { layout : 'BlankLayout'}
        },
    ],
    
    scrollBehavior: (to, from ,savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }
      if (to.hash) {
        return { selector: to.hash };
      }
      return { x: 0, y: 0 };
    }
});
    router.beforeEach((to, from, next) => {
        next();
  })

export default router;
