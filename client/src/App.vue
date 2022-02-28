<template>
  <div id="app">
      <layout-router 
      :layout="this.$store.state.layout"
      :key="this.$store.state.layout"/>
  </div>
</template>

<script>
import LayoutRouter from './views/layout/LayoutRouter.vue';

export default {
  name: 'App',
  components: {
    LayoutRouter
  }
}
</script>


