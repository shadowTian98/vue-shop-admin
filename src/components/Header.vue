<template>
  <header>
    {{ username }}
    <el-dropdown trigger="click" @command="log_out">
      <span class="el-dropdown-link">
        <i class="el-icon-s-tools"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>注销</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </header>
</template>
<script>
export default {
  computed: {
    username() {
      return this.$store.getters.username;
    },
  },
  methods: {
      log_out(){
          localStorage.clear();
          this.$store.commit("SET_INFO",{})
          this.$router.replace("/login")
      }
  },
};
</script>
<style lang="less" scoped>
header {
  line-height: 60px;
  text-align: right;
}
</style>