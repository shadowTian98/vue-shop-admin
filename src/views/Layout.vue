<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="200px" class="nav">
        <side-nav></side-nav>
      </el-aside>
      <el-container>
        <el-header class="head">
          <v-header></v-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideNav from "@/components/SideNav";
import vHeader from "@/components/Header";
export default {
  components: {
    SideNav,
    vHeader,
  },
};
</script>
<style lang="less" scoped>
.layout {
  height: 100%;
  .container {
    height: 100%;
    .nav {
      background-color: rgb(43, 40, 54);
    }
    .head {
      background-color: rgb(191, 197, 197);
    }
    .el-main{
          background-color: #ebe7e7;
    }
  }
}
</style>