<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import DefaultLayout from './DefaultLayout';
import BlankLayout from './BlankLayout';

export default {
    props: {
      layout: {
        type: String,
        required: true,
        default: "DefaultLayout"
      }
    },
    name: 'LayoutRouter',
    components: {
        DefaultLayout,
        BlankLayout,
    },
    // created(){
    //   this.layout = this.$route.meta.layout || "DefaultLayout";
    //   console.log("created layoutrouter")
    //   this.$nextTick(() => {
    //     console.log("created layoutrouter next tick")
    //     this.layout = this.$route.meta.layout || "DefaultLayout";
    //   })
    // },
}
</script>


