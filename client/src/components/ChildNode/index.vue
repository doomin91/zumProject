<template>
                      <li>
                        <div class='answer-node'>NO</div>
                        <div class='decision q_icon'>신청자가 관리자인가? 
                          <div class='hidemenu'>
                            <span>
                                <button class='btn btn-default btn-xs nodeModiBtn' data-seq='58'>수정</button>
                                <button class='btn btn-danger btn-xs nodeDelBtn' data-seq='58'>삭제</button>
                                <button class='btn btn-primary btn-xs childBtn' data-p_seq='58'>하위항목</button>
                            </span>       	       
                          </div>
                        </div>

                      <ul v-if="count < 3">
                        <ChildNode 
                        :count="count+1"
                        />
                        <ChildNode 
                        :count="count+1"
                        />
                      </ul>
                  </li>
</template>

<script>
  export default {
    name : 'ChildNode',
    props : {
      count : {
        type : Number,
        default : 0
      }
    },
    data() {
      return {
        seq: 1
      }
    },
    methods: {
      asd() {
        console.log("d");
      },
      getDataLoad(){
        console.log("생성됨!");
      }
    },
    created() {
      this.getDataLoad();
    }

  }
</script>

