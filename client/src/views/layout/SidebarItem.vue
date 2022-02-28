<template>

<div v-if="item.children">
    <template v-if="item.children.length == 0">
        <el-menu-item :index="item.path">
            <span slot="title">{{item.title}}</span>
        </el-menu-item>
    </template>
    
    <el-submenu v-else :index="item.path">

      <template slot="title">
          <span slot="title" v-show="!collapse">{{item.title}}</span><span v-if="item.count > 0"> ({{item.count}}) </span>
      </template>

      <template v-for="child in item.children">
          <sidebar-item
              v-if="child.children&&child.children.length>0&&child.childrenDisplay!=false"
              :item="child"
              :key="child.path" />
          <el-menu-item v-else :key="child.path" :index="child.path">
              {{child.title}} <span v-if="child.count > 0"> ({{child.count}}) </span>
          </el-menu-item>
      </template>

    </el-submenu>

</div>


</template>

<script>

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    collapse:{
      type:Boolean,
      default:false
    }
  }
}
</script>