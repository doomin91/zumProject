<template>
    <el-menu :default-active="this.$route.meta.active" class="el-menu-vertical-demo" router @open="handleOpen" @close="handleClose" :collapse="collapse" :unique-opened="false" :collapse-transition="false">
        <sidebar-item v-for="menu in menuList" :key="menu.path" :item="menu" :collapse="collapse"/>
    </el-menu>
</template>

<script>

import SidebarItem from './SidebarItem.vue'

export default {
  name:'Sidebar',
  components: { SidebarItem },
  props:{
    menuList: {
      type: Array,
      required: true
    },
    collapse:{
      type:Boolean,
      default:false
    }
  },
   methods: {
    handleOpen(key, keyPath) {
      console.log(this.$route);
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>



<style >

</style>