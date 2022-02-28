<template>
  <div>
    <el-container>

      <el-aside class="sidebar">
        <div class="leftside_menu">
          <el-scrollbar class="sidebar-scroll">
            <div class="logo-container">
              <router-link to="/"><img src="../../assets/img/logo.png"></router-link>
            </div>
            <DashboardSide />
          </el-scrollbar>
        </div>
      </el-aside>

      <el-container>
        <el-header>
          <DashboardHeader />
        </el-header>
        <el-main>
          <div id="main-container">
            <router-view>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import DashboardHeader from './DashboardHeader.vue';
import DashboardSide from './DashboardSide.vue';

export default {
    name: 'DefaultLayout',
    components: {
        DashboardHeader,
        DashboardSide,
    },
}
</script>