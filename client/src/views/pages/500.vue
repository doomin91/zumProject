<template>
  <div class="contents">


    <el-row>
      <el-col>

        <div class="ErrorContent pt50">
          <div class="ErrorBox">
            <h2>서비스 점검 중입니다.</h2>
            <el-button type="primary" size="lage" @click="dashboard">DashBoard</el-button>
        
          </div>

        </div>

      </el-col>
    </el-row>

  </div>
</template>

<script>

export default {
  name: "500",
  data() {
    return {
    };
  }
};
</script>

