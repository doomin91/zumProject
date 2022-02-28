<template>
<div class="LoginWrap">
  <div class="LoginContent"> 
    <el-row :gutter="24" class="no-gutters">

      <el-col :span="24" class="hero-static">
        <div class="LoginFormWrap">
          <div class="LoginFormCont">

            <div class="LoginFormHeader">
              <h2>WithFlow</h2>
              <p>Welcome, please login</p>
            </div>

            <el-row :gutter="24" class="LoginFormBody no-gutters">
              <el-col :span="24">
                <form ref="form" >
                  <div class="form-group">
                    <el-input id="memID" v-model="mMemID" :state="memIdState" ref="memID" @keyup.enter.native="FocusPwd"></el-input>
                  </div>
                  <div  class="form-group">
                    <el-input id="memPwd" v-model="mMemPwd" type="password" :state="memPwdState" show-password ref="memPwd" @keyup.enter.native="SendLogin"></el-input>
                  </div>
                  <div >
                      <el-button @click="SendLogin" type="primary" class="LoginButton">로그인</el-button>
                  </div>
                </form>
              </el-col>
            </el-row>

          </div>
        </div>

      </el-col>
    </el-row>

  </div>
</div>




</template>

<script>

/* eslint-disable no-unused-vars */
import * as AuthApi from '@/api/auth';
import VueCookies from 'vue-cookies'
import {mapActions} from 'vuex';

export default {
    data() {
      return{
        memIdState : null,
        memPwdState : null,
        mMemID :"",
        mMemPwd :""
      }
    },
    methods:{
      FocusPwd(){
        this.$refs.memPwd.focus();
      },
      SendLogin(){
        if(this.mMemID == ""){
          this.$message({
            type:"error",
            message:"아이디를 입력해주세요."
          })
          this.$refs.memID.focus();
          return false;
        }
        if(this.mMemPwd == ""){
          this.$message({
            type:"error",
            message:"비밀번호를 입력해주세요."
          })
          this.$refs.memPwd.focus();
          return false;
        }

        const data = {mMemID : this.mMemID, mMemPwd : this.mMemPwd}
        this.signin(data).then(res=>{
          console.log(res);
          if(res.code != 200){
            this.$message({
              type:"error",
              message:res.msg
            })
            return false;
          }
          this.goMain();
        })
      },
      ...mapActions(['signin']),
      goMain(){
        console.log(VueCookies.get("USER_ID"));
        console.log(VueCookies.get("USER_SEQ"));
          if(this.mMemID == VueCookies.get("USER_ID")){
            // route로 처리하는 경우 레이아웃을 다시 렌더링하지 않고 ( 효율성면에서 )
            // 기존에 사용하던 레이아웃을 그대로 사용하기 때문에, 지정한 레이아웃을 사용 할 수 없는 이슈가 발생함.
            // 라우팅 방식이 아닌 기존 방식으로 대체, ( 이후 수정 필요 )
            // this.$router.push({path:'/dashboard'});
            location.href = "/DashBoard";
          }
      },
    }
}
</script>

<style>
.text-align {
   text-align: center;
}
.clsBody{
    padding: 15px;
    margin: 15px;
}
.ralign{
    text-align: right;
}
.midLay{
  margin-top:30px;
  
  width: 400px;
  margin: 130px auto;
}
</style>