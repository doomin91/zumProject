<template>
                  <li>
                      <div class='answer-node'>{{this.data.ANSWER_FLAG == 'Y' ? "YES" : "NO" }}</div>
                        <div v-bind:class="isQuestion"> {{ this.data.ADMIN_MEMO }} 
                          <div class='hidemenu'>
                            <span>
                                <button @click="viewModifyModal">수정</button>
                                <button @click="deleteNode">삭제</button>
                                <button  
                                v-if="this.data.TYPE == 'D'"
                                @click="viewAddModal()">하위항목</button>
                            </span>       	       
                          </div>
                        </div>

                        <ul v-if="child.length > 0">
                          <ChildNode 
                          v-for="item in child"
                          v-bind:key="item.SEQ"
                          :data="item"
                          />
                        </ul>
                  </li>
</template>

<script>
  import * as policyManagerApi from "@/api/policy_manager";

  export default {
    name: 'ChildNode',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        child: []
      }
    },
    computed: {
      isQuestion: function() {
        if(this.data.TYPE == "T"){          
          return "terminator a_icon";
        } else {  
          return "decision q_icon";
        }
      }
    },
    methods: {
      getDataLoad(){
        const parentSeq = this.data.SEQ;
        policyManagerApi.getChildNode(parentSeq)
            .then(res => {
                res.data.forEach(element => {
                  this.child.push(element)
                })
            })
      },
      viewModifyModal(){
        if(!this.$store.state.nodeSeq){
          const nodeSeq = this.data.SEQ;
          this.$store.state.nodeSeq = nodeSeq;
        }
        this.$parent.viewModifyModal();
      },
      viewAddModal(){
        if(!this.$store.state.nodeSeq){
          const nodeSeq = this.data.SEQ;
          this.$store.state.nodeSeq = nodeSeq;
        }
        this.$parent.viewAddModal();
      },
      deleteNode(){
        const nodeSeq = this.data.SEQ;
        this.$confirm("해당 노드를 삭제하시겠습니까? 하위 노드가 전부 삭제됩니다.", "Warning", {
          confirmButtonText: "삭제",
          cancelButtonText: '취소',
          type: 'warning',
          callback: action =>{
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
    }
  }
</script>

