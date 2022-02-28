<template>

  <div class="blockbase block-rounded">
      <div class="block-header">
        <h3 class="block-title">사용자 등록</h3>
      </div>
      <div class="block-content">


      <el-row class="pw20 mb20 line_h32" >
          <el-col :span="12">
            <el-row>
              <el-col :span="3" class="TableLeftName ft13 line_h32">아이디</el-col>
              <el-col :span="20">
                <el-input v-model="$v.form.id.$model" ref="id" clearable size="small"></el-input>
                <p v-if="!$v.form.id.required && $v.form.id.$dirty">아이디를 입력해주세요.</p>
                <p v-if="!$v.form.id.alphaNum">아이디는 숫자 또는 알파벳으로 구성되어야 합니다.</p>
                <p v-if="!$v.form.id.minLength">아이디는 최소 {{ $v.form.id.$params.minLength.min }} 글자로 구성되어야 합니다.</p>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="12">
            <el-row>
            <el-col :span="3" class="TableLeftName ft13 line_h32">이름</el-col>
            <el-col :span="20">
              <el-input v-model="$v.form.name.$model" ref="name" clearable size="small"></el-input>
                <p v-if="!$v.form.name.required && $v.form.name.$dirty">이름을 입력해주세요.</p>
                <p v-if="!$v.form.name.minLength">이름은 최소 {{ $v.form.name.$params.minLength.min }} 글자로 구성되어야 합니다.</p>
            </el-col>
            </el-row>
          </el-col>
      </el-row>

      <el-row class="mb20 pw20 line_h32">
        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">비밀번호</el-col>
            <el-col :span="20">
              <el-input v-model="$v.form.password.$model" ref="password" show-password size="small"></el-input>
              <p v-if="!$v.form.password.required && $v.form.password.$dirty">비밀번호를 입력해주세요.</p>
              <p v-if="!$v.form.password.minLength">비밀번호는 최소 {{ $v.form.password.$params.minLength.min }} 글자로 구성되어야 합니다.</p>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13 ">비밀번호 확인</el-col>
            <el-col :span="20">
              <el-input v-model="$v.form.repeatPassword.$model" ref="repeatPassword" show-password size="small"></el-input>
              <p v-if="!$v.form.repeatPassword.required && $v.form.repeatPassword.$dirty">비밀번호 확인을 입력해주세요.</p>
              <p v-if="!$v.form.repeatPassword.sameAsPassword && $v.form.repeatPassword.$dirty && $v.form.repeatPassword.required">비밀번호가 다릅니다.</p>
            </el-col>
          </el-row>
        </el-col>

      </el-row>


      <el-row class="mb20 pw20 line_h32">
        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">연락처</el-col>
            <el-col :span="20">
              <el-input v-model="userInfo.phone" clearable size="small"></el-input>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">이메일</el-col>
            <el-col :span="20">
              <el-input v-model="$v.form.email.$model" ref="email" clearable size="small"></el-input>
              <p v-if="!$v.form.email.required && $v.form.email.$dirty">이메일을 입력해주세요.</p>
              <p v-if="!$v.form.email.email && $v.form.email.$dirty">이메일 형식이 아닙니다.</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>


      <el-row class="mb20 pw20 line_h32">
        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">부서</el-col>
            <el-col :span="20"  class="UserListForm">
              <el-select v-model="$v.form.department.$model" ref="department" size="small">
                <el-option v-for="item in departments"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">직책</el-col>
            <el-col :span="20">
              <el-select v-model="$v.form.position.$model" ref="position" size="small">
                <el-option v-for="item in positions"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>



      <el-row class="mb20 pw20 line_h32">
        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">사번</el-col>
            <el-col :span="20">
              <el-input v-model="$v.form.companyId.$model" ref="companyId" clearable size="small"></el-input>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">상태값</el-col>
            <el-col :span="20">
              <el-select v-model="$v.form.status.$model" :options="status" ref="status" size="small">
                <el-option v-for="item in status"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>



      <el-row class="mb20 pw20 line_h32">
        <el-col :span="12">
          <el-row>
            <el-col :span="3" class="TableLeftName ft13">검증권한</el-col>
            <el-col :span="9">
              <el-radio-group v-model="$v.form.ruleAuth.$model" ref="ruleAuth">
                <el-radio label="Y" border>있음</el-radio>
                <el-radio label="N" border>없음</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>
      </el-row>


      <el-row class="mb20 pw20">
        <el-col align="right" class="pd10 pr30">
          <el-button type="danger" size="small" variant="" @click="back">취소</el-button>
          <el-button type="primary" size="small" variant="primary" @click="user_regist">등록</el-button>
        </el-col>
      </el-row>


      </div>
  </div>



</template>

<style>
  .el-alert--info.is-light {
    margin-top:5px;
    background-color: #f7f7f7;
  }

  .el-alert--info .el-alert__description {
    color:#f52828 !important;
  }
  
  .el-radio.is-bordered {
  border:0 !important;
  }
</style>

<script>
  import md5 from 'js-md5';
  import * as companyApi from '@/api/company';
  import {
    validationMixin
  } from "vuelidate";
  import {
    required,
    minLength,
    sameAs,
    alphaNum,
    email
  } from "vuelidate/lib/validators";

  export default {
    mixins: [validationMixin],
    data() {
      return {
        selected: null,
        departmentsSelected: null,
        positionsSelected: null,
        statusSelected: null,
        departments: [],
        positions: [],
        status: [
          { value: 0, text: "재직중" },
          { value: 1, text: "휴직중" },
          { value: 2, text: "퇴직" }
        ],
        userInfo: {
          id: null,
          name: null,
          phone: null,
          email: null,
          companyId: null,
          ruleAuth: null
        },
        form: {
          id: null,
          name: null,
          password: null,
          repeatPassword: null,
          email: null,
          department: null,
          position: null,
          status: null,
          companyId: null,
          ruleAuth: 'N'
        },
      }
    },
    validations: {
      form: {
        id: {
          required,
          alphaNum,
          minLength: minLength(3)
        },
        name: {
          required,
          minLength: minLength(2)
        },
        password: {
          required,
          minLength: minLength(8)
        },
        repeatPassword: {
          required,
          sameAsPassword: sameAs('password')
        },
        email: {
          required,
          email
        },
        department: {
          required
        },
        position: {
          required
        },
        status: {
          required
        },
        companyId: {
          required
        },
        ruleAuth: {
          required
        }
      },
    },
    methods: {
      validateState(name) {
        const {
          $dirty,
          $error
        } = this.$v.form[name];
        return $dirty ? !$error : null;
      },
      back() {
        this.$router.go(-1);
        // this.$router.push({path:'/userList'});
      },
      validate(){
        if (this.$v.$invalid) {
          // 1. Loop the keys
          for (let key in Object.keys(this.$v.form)) {
            // 2. Extract the input
            const input = Object.keys(this.$v.form)[key];
            this.$v.form[input].$touch();
            // 3. Remove special properties
            if (input.includes("$")) return false;
            // 4. Check for errors
            if (this.$v.form[input].$error) {
              // 5. Focus the input with the error
              this.$refs[input].focus();
              // 6. Break out of the loop
              break;
            }
          }
          return false;
        } else {
          return true;
        }
      },
      user_regist() {
        if(!this.validate()){
          return false;
        }
        const data = {
          "USER_ID": this.form.id,
          "USER_PASS": md5(this.form.password),
          "USER_NAME": this.form.name,
          "USER_PHONE": this.form.phone,
          "USER_EMAIL": this.form.email,
          "USER_DEPARTMENT": this.form.department,
          "USER_POSITION": this.form.position,
          "USER_COMPANY_ID": this.form.companyId,
          "USER_STATUS": this.form.status,
          "USER_RULE_AUTH": this.form.ruleAuth,
        }
        companyApi.registUser(data)
          .then(res => {
            console.log(res);
            this.$router.push({
              path: '/userList'
            })
          })
          .catch(error => {
            console.log(error);
          });
      },
      getDataLoad() {
        var userSeq = this.$route.query.userSeq;

        /**
         * 부서정보 호출
         */
        companyApi.getDepartList()
          .then(res => {
            console.log(res.data);
            res.data.forEach(element => {
              const departData = {
                value: element.DEPARTMENT_SEQ,
                text: element.DEPARTMENT,
              }
              this.departments.push(departData);
            });
          });

        /**
         * 직책정보 호출
         */
        companyApi.getPositionList()
          .then(res => {
            res.data.forEach(element => {
              const positionData = {
                value: element.CODE_SEQ,
                text: element.CODE_NAME
              }
              this.positions.push(positionData);
            });
          });

        companyApi.getUser(userSeq)
        .then(res => {
          console.log(res.data);
          this.userInfo.id = res.data[0]?.USER_ID;
          this.userInfo.name = res.data[0]?.USER_NAME;
          this.userInfo.email = res.data[0]?.USER_EMAIL;
          this.userInfo.phone = res.data[0]?.USER_PHONE;
          this.userInfo.companyId = res.data[0]?.USER_COMPANY_ID;
          this.userInfo.ruleAuth = res.data[0]?.USER_RULE_AUTH;
          this.departmentsSelected = res.data[0]?.DEPARTMENT_SEQ;
          this.positionsSelected = res.data[0]?.CODE_SEQ;
          this.statusSelected = res.data[0]?.USER_STATUS;
        });
      }
    },
    created() {
      this.getDataLoad();
    }
  }
</script>