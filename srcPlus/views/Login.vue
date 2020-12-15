<template>
  <div class="login">
    <div class="login_main">
      <h5>登录</h5>
      <el-form label-width="0px" :model="formData" :rules="rules" ref="form">
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入管理员名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入管理员密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" round class="btn" @click="loginFn"
        >登录</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "管理员名称不能为空！",
          },
        ],
        password: [
          {
            required: true,
            message: "管理员密码不能为空！",
          },
          {
            min: 6,
            max: 8,
            message: "管理员密码长度为6-8个字符！",
          },
        ],
      },
    };
  },
  methods: {
    loginFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.dispatch("user/set_info",this.formData)
        } 
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  background: linear-gradient(
    left,
    #7303f371 hsla(266, 88%, 44%, 0.13) #5406e609
  );
  .login_main {
    width: 250px;
    height: 200px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    h5 {
      text-align: center;
      margin: 10px 0;
      color: #fff;
    }
    .btn {
      width: 100%;
    }
  }
}
</style>