<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in foundPath" :key="item.path">{{item.title}}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item :to="{ path: '/' }">설정</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">사용자</a></el-breadcrumb-item>
        <el-breadcrumb-item>관리자 관리</el-breadcrumb-item> -->
    </el-breadcrumb>
</template>


<script>
export default {
  data() {
    return {
      currentPath : [],
      foundPath : [],
      found : false,
      maxDepth : 0
    }
  },
  methods: {
    getDataLoad(){
      const menuList = this.$store.state.menuList;
      this.findItem(menuList, 0);
    },
    findItem(item, depth){
        item.forEach(element =>{
          if(!this.found){
            let data = {
              title: element.title,
              path: element.path
            }
            this.currentPath[depth] = data;
          }
        // console.log(depth + " - " +element.title);
          if(element.path === this.$route.path){

            this.foundPath = this.currentPath;
            this.found = true;
            if(this.maxDepth > depth){
              let popCount = this.maxDepth - depth;
              for(let i=0; i<popCount;i++){
                this.currentPath.pop()
              }
            }
          }

          if(element.children.length > 0){
            this.findItem(element.children, depth+1);
          }

          if(this.maxDepth < depth){
            this.maxDepth = depth;
          }
      })
      }
  },
  created(){
    this.getDataLoad();
  }
}
</script>

