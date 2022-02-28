<template>
    <div class="navbar">
        <div class="right-menu">
            <!-- <search id="header-search" class="right-menu-item" /> -->
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

              <div class="avatar-wrapper">
                {{ username }}
                <i class="el-icon-caret-bottom menu-arrow"  />
              </div>

              <el-dropdown-menu slot="dropdown" class="avatar-dropwrap">
                  <el-dropdown-item>Profile</el-dropdown-item>
                  <el-dropdown-item divided @click.native="logout">
                    <span style="display:block;">Log Out</span>
                  </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

        </div>
    </div>
</template>



<script>

export default {
  data() {
    return {
      username : (this.$cookies.get("UserInfo").USER_NAME + "님") || '이걸 보신 분은 010-2977-2122 연락부탁드립니다.'
    }
  },
  components: {
    // Search

  },
  methods: {
    logout(){
      //쿠키삭제
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
      //Vuex accessToken 삭제
      this.$store.state.accessToken = ""
      //location.reload();
      location.href="/Login";
      // this.$router.push({path:"/Login"})
    }
  }
}
</script>


