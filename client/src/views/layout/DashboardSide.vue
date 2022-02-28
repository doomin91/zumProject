<template>
  <Sidebar :menuList="menuList" :collapse="isCollapse" />
</template>

<script>
import Sidebar from "../layout/SideBar.vue";

export default {
  name: "DashboardSide",
  components: {
    Sidebar,
  },
  data() {
    return {
      isCollapse: false,
      menuList: [],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    checkUserAuth(){
      this.menuList = 
                  [
                    {
                      path: "/userList",
                      title: "사용자 관리",
                      childrenDisplay : false,
                      children: [
                        {
                            path: "/userDetail",
                            title: "사용자 관리 수정",
                            children: []
                        }
                      ],
                    }
                  ]
      this.sendMenuVuex()
    },
    // 전체 메뉴 이름을 검색하기 위해 Store에 보관하는 함수
    sendMenuVuex(){
      this.$store.dispatch("setMenuList", this.menuList);
    },
    // 하위 메뉴까지 전체 탐색
  },
  created() {
    this.checkUserAuth()
  }
};
</script>

<style></style>
