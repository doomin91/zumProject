<template>

  <div class="treeWrap">
          <el-tree 
          :data="departs" 
          @node-click="handleNodeClick" 
          node-key="id"
          default-expand-all></el-tree>
  </div>
</template>

<style>
  .treeWrap {
    position:relative;
    width:100%;
    margin:0 auto;
  }

  .el-tree {
    border-top:1px solid #ebebeb;
    border-left:1px solid #ebebeb;
    border-right:1px solid #ebebeb;

  }
  .el-tree-node__content {
    border-bottom:1px solid #ebebeb;
    height:40px !important;
  }
  .el-tree-node__content:last-child {
    border-bottom:0;
  }
.el-tree-node__label {
  font-size:12px !important; 
}

</style>



<script>

  import * as companyApi from '@/api/company';

  let stack = [];

  export default {
    data() {
      return {
        departs: [],
      }
    },
    methods: {
      handleNodeClick(item) {
        this.$emit("handleNodeClick", item);
      },
      getDataLoad() {
        /** INIT */
        stack = [];
        let maxDepth = 0;
        this.departs = [];
        let allData = [];
        companyApi.getDepartChart()
          .then(res => {
            res.data.forEach(element => {
              let data = {
                id : element.DEPARTMENT_SEQ,
                tel : element.DEPARTMENT_TEL,
                code : element.DEPARTMENT_CODE,
                label : element.DEPARTMENT,
                depth : element.DEPTH,
                ref : element.REF,
                parent : element.PARENT_DEPARTMENT_SEQ,
                children : []
              }
              /** maxdetph 추출 */
              if(maxDepth < element.DEPTH){
                maxDepth = element.DEPTH;
              }
              allData.push(data);
            });

            for(let i=0; i < maxDepth; i++){
              stack.push([]);
            }

            allData.forEach(function(element){
              stack[element.depth - 1].push(element);
            });

            this.pushChildrenData(stack);
            
            

        })
      }, pushChildrenData(stack) {
        let nowObject, nextObject;
        while(stack.length != 1){
          nowObject = stack.pop();
          nextObject = stack[stack.length-1];
          
          for(let i=0; i < nowObject.length; i++){
            for(let j=0; j < nextObject.length; j++){
              if(nextObject[j].id == nowObject[i].parent){
                nextObject[j].children.push(nowObject[i]);
              }
            }
          }
        }

        this.departs = nextObject;
      }
    },
    // created() {
    //   this.getDataLoad();
    // },
    mounted() {
      this.getDataLoad();
    }
  };

</script>
