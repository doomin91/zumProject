<template>
  <div class="contents">


    <el-row>
      <el-col>

        <div class="ErrorContent pt50">
          <div class="ErrorBox">
            <h1>403</h1>
            <h2>Access Forbidden</h2>
            <router-link to="Dashboard">
              <el-button type="primary" size="lage">DashBoard</el-button>
            </router-link>
          </div>

        </div>

      </el-col>
    </el-row>


  </div>
</template>

<script>

export default {
  name: "403 Forbidden",
  data() {
    return {
    };
  }
};
</script>

