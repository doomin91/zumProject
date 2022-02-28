<template>
                  <li>
                    <span class='decision q_icon'> {{ root.ADMIN_MEMO }}
                      <div class='hidemenu'>
                        <span>
                          <button @click="viewModifyModal()">수정</button>
                          <button @click="deleteNode">삭제</button>
                          <button @click="viewAddModal()">하위항목</button>
                        </span>
                      </div>
                    </span>
                    
                    <ul>
                      <ChildNode 
                      v-for="item in child"
                      v-bind:key="item.SEQ"
                      :data="item"
                      />
                    </ul>
                  </li>
</template>

<script>

  import ChildNode from './childnode.vue';
  import * as policyManagerApi from "@/api/policy_manager";

  export default {
    name : 'FlowChart',
    props : {
    },
    components: {
      ChildNode
    },
    data() {
      return {
        root : [],
        child : []
      }
    },
    methods: {
      getDataLoad(){
        policyManagerApi.getRootNode()
          .then(res => {
            this.root = res.data;
            const parentSeq = res.data.SEQ;
            policyManagerApi.getChildNode(parentSeq)
              .then(res => {
                res.data.forEach(element => {
                  this.child.push(element)
                })
              })
          })
      },
      viewModifyModal(){
        if(!this.$store.state.nodeSeq){
          const nodeSeq = this.root.SEQ;
          this.$store.state.nodeSeq = nodeSeq;
        }
        this.$parent.viewModifyModal();
      },
      viewAddModal(){
        if(!this.$store.state.nodeSeq){
          const nodeSeq = this.root.SEQ;
          this.$store.state.nodeSeq = nodeSeq;
        }
        this.$parent.viewAddModal()
      },
      deleteNode(){
        const nodeSeq = this.root.SEQ;
        this.$confirm("해당 노드를 삭제하시겠습니까? 하위 노드가 전부 삭제됩니다.", "Warning", {
          confirmButtonText: "삭제",
          cancelButtonText: '취소',
          type: 'warning',
          callback: action =>{
            console.log(action);
            if(action == "confirm"){
              policyManagerApi.deleteNode(nodeSeq);
              location.reload();
            }
          }
        })
      }
    },
    created() {
      this.getDataLoad();
      console.log(this.child)
    }

  }
</script>

