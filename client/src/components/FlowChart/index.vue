<template>
        <div>
          <div class="FlowWrap">
            <ul class='flow-decision-tree'>
              <li>
                <span class='terminator'>시작
                    <span class='hidemenu' style='padding-top: 13px;'>
                        <button @click="createNewRoot">하위항목</button>
                    </span>
                </span>
                <ul>
                    <RootNode />
                </ul>
              </li>
            </ul>
          </div>

          <el-dialog title="하위메뉴 입력" :visible.sync="dialogFormVisible">
          <el-form :model="form" label-width="120px" size="mini">
            <div v-if="writeMode==0">
            <el-form-item label="답변">
              <el-select v-model="form.question" ref="question">
                <el-option label="YES" value="Y"></el-option>
                <el-option label="NO" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="노드형식">
              <el-select v-model="form.nodeType" ref="nodeType">
                <el-option label="질문" value="D"></el-option>
                <el-option label="답변" value="T"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="관리자문구">
              <el-input v-model="form.adminComment" type="textarea" ref="adminComment"></el-input>
            </el-form-item>
            <el-form-item label="유저문구">
              <el-input v-model="form.userComment" type="textarea" ref="userComment"></el-input>
            </el-form-item>
            <el-form-item label="검색필드">
              <el-button type="primary" @click="addFilterProc">Add Filter</el-button>
            </el-form-item>
            <el-form-item label="Add Filter">
              <div v-for="(item, index) in form.filter" :key="item.seq">
                <el-tag effect="dark" type="danger" size="mini" v-if="index > 0">{{ item.condition }}</el-tag>
                {{ getTypeState(item.type) }}  
                <span v-for="filter in item.items" :key="filter.seq">({{ filter.type }}) {{filter.label}} </span>
                <!-- <el-button type="warning" size="mini" @click="viewInFilter(index)">보기</el-button> -->
                <el-button size="mini" @click="deleteInFilter(index)">삭제</el-button>
              </div>
            </el-form-item>
            </div>

            <div v-if="writeMode==1">
            <el-form-item label="그룹 and / or">
              <el-select v-model="searchForm.groupCondition" ref="groupCondition">
                <el-option label="AND" value="and"></el-option>
                <el-option label="OR" value="or"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="검색필드">
                <el-input placeholder="검색어를 입력하세요." v-model="searchForm.searchString" class="input-with-select" @keyup.enter.native="filterSearch" >
                  <el-select v-model="searchForm.type" slot="prepend" placeholder="Select" v-bind:disabled="selectedData.length > 0">
                    <el-option label="출발지" value="source"></el-option>
                    <el-option label="목적지" value="destination"></el-option>
                    <el-option label="서비스" value="service"></el-option>
                    <el-option label="신청자" value="usr"></el-option>
                    <el-option label="부서" value="deptm"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="filterSearch"></el-button>
                </el-input>
                <el-table :data="searchData" max-height="200px" size="mini">
                  <el-table-column label="#" prop="seq"></el-table-column>
                  <el-table-column label="값" prop="label"></el-table-column>
                  <el-table-column label="추가">
                      <template slot-scope="scope">
                        <el-button @click="addFilterItem(scope.row, 'Equals')">일치</el-button>
                        <el-button @click="addFilterItem(scope.row, 'Includes')">포함</el-button>
                      </template>
                  </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="추가된 Filter">
                <el-table :data="selectedData" max-height="200px" size="mini">
                  <el-table-column label="#" prop="seq"></el-table-column>
                  <el-table-column label="값">
                    <template slot-scope="scope">
                      <el-tag size="small" v-if="scope.row.type=='Equals'">일치</el-tag>
                      <el-tag size="small" v-if="scope.row.type=='Includes'">포함</el-tag>
                      {{ scope.row.label }}
                    </template>
                  </el-table-column>
                  <el-table-column label="삭제">
                    <template slot-scope="scope">
                      <el-button @click="deleteFilterItem(scope.$index)">제외</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </el-form-item>
            </div>


          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="writeMode==0" @click="dialogFormVisible = false">취소</el-button>
            <el-button v-if="writeMode==0 && modifyMode =='save'" type="primary" @click="saveNode">하위목록저장</el-button>
            <el-button v-if="writeMode==0 && modifyMode =='modify'" type="primary" @click="modifyNode">변경사항 저장</el-button>
            <el-button v-if="writeMode==1" @click="writeMode=0">이전</el-button>
            <el-button v-if="writeMode==1" type="primary" @click="addFilter">추가</el-button>
          </span>
        </el-dialog>
      </div>
</template>

<script>

  import RootNode from './rootnode.vue';
  import * as policyManagerApi from '@/api/policy_manager'

  export default {
    components: {
      RootNode
    },
    data() {
      return {
        dialogFormVisible: false,
        writeMode: 0, // 1: Comment , 2: Add Filter
        modifyMode: 'save', // Save: 생성, Modify: 수정
        form: {
          seq: "",
          question: "",
          nodeType: "",
          adminComment: "",
          userComment: "",
          filter: [],
        },
        searchForm: {
          type: "",
          searchString: "",
          groupCondition: ""
        },
        // Add Filter 시 사용되는 검색창
        searchData: [],
        // Add Filter 후 보이는 결과창
        selectedData: []
      }
    },
    methods: {
      createNewRoot(){
        this.form.seq = 0
        this.dialogFormVisible = true
      },
      // 초기값 세팅
      initModal(mode){
        this.writeMode = 0;
        this.modifyMode = mode
        this.form = {
          seq: "",
          question: "",
          nodeType: "",
          adminComment: "",
          userComment: "",
          filter: [],
        }
        this.searchForm = {
          type: "",
          searchString: "",
          groupCondition: ""
        }
        this.form.seq = this.$store.state.nodeSeq;
        this.$store.state.nodeSeq = "";
      },
      viewModifyModal(){
        this.initModal("modify")
        // 하위 노드 SEQ 받은 후 초기화

        policyManagerApi.getNode(this.form.seq)
          .then(res => {
            let filter_array = [];

            res.data.FILTER_INFO.forEach(element => {
              console.log(element);
              let data = {
                seq:element.FILTER_SEQ,
                condition:element.FILTER_GROUP_CONDITION,
                type:element.FILTER_TYPE,
                items:JSON.parse(element.FILTER_CONTENTS)
              }
              filter_array.push(data);
            })

            this.form = {
              seq: res.data?.SEQ,
              question: res.data?.ANSWER_FLAG,
              nodeType: res.data?.TYPE,
              adminComment: res.data?.ADMIN_MEMO,
              userComment:res.data?.USER_MEMO,
              filter: filter_array,
            }
          }) 
          .catch(err => {
            console.log(err)
          })

        this.dialogFormVisible = true
      },
      viewAddModal(){
        this.initModal("save");
        // 하위 노드 SEQ 받은 후 초기화
        this.dialogFormVisible = true
      },
      filterSearch(){
        policyManagerApi.filterSearch(this.searchForm)
              .then(res => {
                this.searchData = [];
                let data;
                res.data.forEach(element => {
                  switch(this.searchForm.type){
                    case "source":
                      console.log("source");
                      break;
                    case "destination":
                      console.log("destination");
                      break;
                    case "service":
                      console.log("service");
                      break;
                    case "usr":
                      data = {
                        seq : element.USER_SEQ,
                        label : `${element.DEPART_INFO.DEPARTMENT} ${element.USER_NAME} ${element.POSITION_INFO.CODE_NAME}`,
                        value : `${element.USER_NAME}/${element.USER_ID}`
                      }
                      this.searchData.push(data);
                      break;
                    case "deptm":
                      data = {
                        seq : element.DEPARTMENT_SEQ,
                        label : element.DEPARTMENT,
                        value : element.DEPARTMENT
                      }
                      this.searchData.push(data);
                      break;
                  }
                })
              })
              .catch(err => {
                console.log(err);
              })
      },
      addFilterProc(){
        if(this.writeMode == 1){
          this.writeMode = 0;
        }else{
          this.writeMode = 1;
        }
      },
      addFilter(){

        if(this.searchForm.groupCondition == ""){
          this.$message({
            type:"warning",
            message:"그룹 And / Or를 지정해주세요."
          })
          this.$refs.groupCondition.focus();
          return false;
        }

        if(this.selectedData.length == 0){
          this.$message({
            type:"warning",
            message:"선택된 조건이 없습니다."
          })
          return false;
        }

        this.writeMode = 0;
        const data = {
          condition: this.searchForm.groupCondition,
          type: this.searchForm.type,
          items: this.selectedData
        }
        this.form.filter.push(data);
        this.selectedData = []
      },
      addFilterItem(item, type){
        let check;
        this.selectedData.forEach(element => {
          if(element.seq == item.seq){
            check = true;
            return false;
          }
        })
        if(check){
          this.$message({
            type:"warning",
            message:"이미 추가된 값입니다."
          })
        } else {
          const data = {
            seq: item.seq,
            label: item.label,
            value: item.value,
            type: type
          }
          this.selectedData.push(data)
        }
      },
      deleteFilterItem(index){
        this.selectedData.splice(index, 1);
      },
      saveNode(){
        console.log(this.form);

        if(this.form.question == ""){
          this.$message({
            type:"warning",
            message:"답변 형식을 지정해주세요."
          })
          this.$refs.question.focus();
          return false;
        }
        if(this.form.nodeType == ""){
          this.$message({
            type:"warning",
            message:"노드형식을 지정해주세요."
          })
          this.$refs.nodeType.focus();
          return false;
        }

        if(this.form.adminComment == ""){
            this.$message({
            type:"warning",
            message:"관리자문구가 입력되지 않았습니다."
          })
          this.$refs.nodeType.focus();
          return false;
        }
  
        if(this.form.userComment == ""){
          this.$message({
            type:"warning",
            message:"유저문구가 입력되지 않았습니다."
          })
          this.$refs.nodeType.focus();
          return false;
        }

        // if(this.form.filter.length == 0){
        //   this.$message({
        //     type:"warning",
        //     message:"조건값이 없습니다. Add Filter를 통해 조건값을 추가해주세요."
        //   })
        //   return false;
        // }



        policyManagerApi.saveNode(this.form)
          .then(res => {
            console.log(res);
            if(res.data.code == 200){
              this.dialogFormVisible = false
              location.reload();
            }else {
              this.$message({
                type:"warning",
                message:res.data.msg
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      modifyNode(){
        console.log(this.form);
        policyManagerApi.modifyNode(this.form)
          .then(res =>{
            console.log(res)
          })
          .catch(err =>{
            console.log(err);
          })
      },
      getTypeState(str){
        let result;
        switch(str){
          case "source":
            result = "[출발지]";
            break;
          case "destination":
            result = "[목적지]";
            break;
          case "service":
            result = "[서비스]";
            break;
          case "usr":
            result = "[신청자]";
            break;
          case "deptm":
            result = "[부서]";
            break;
        }

        return result;
      },
      deleteInFilter(index){
        this.form.filter.splice(index, 1);
      }
    },
    created() {
    }

  }
</script>

