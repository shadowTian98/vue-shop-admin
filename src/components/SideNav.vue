<template>
  <div>
    <el-menu
      class="sideNav"
      background-color="rgb(43, 40, 54)"
      text-color="#fff"
      unique-opened
    >
      <h5>用户管理系统</h5>
      <el-menu-item index="/index">
        <i class="el-icon-s-home"></i>
        <span slot="title">
          <router-link to="/index" active-class="hover">首页</router-link>
        </span>
      </el-menu-item>

      <!-- 根据不同用户管理权限，动态渲染侧边导航栏 -->
      <el-submenu v-for="(item,index) in menus" :key="index" index="index+1">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item v-for="(key,i) in item.children" :key="i" :index="key.url">
          <router-link :to="key.url" active-class="hover">{{key.title}}</router-link>
        </el-menu-item>
      </el-submenu>
      
      <!-- <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="1-1">
          <router-link to="/menu" active-class="hover">菜单管理</router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link to="/role" active-class="hover">角色管理</router-link>
        </el-menu-item>
        <el-menu-item index="1-3">
          <router-link to="/user" active-class="hover">管理员管理</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-goods"></i>
          <span>商城管理</span>
        </template>
        <el-menu-item index="2-1">
          <router-link to="/category" active-class="hover"
            >商品分类</router-link
          >
        </el-menu-item>
        <el-menu-item index="2-2">
          <router-link to="/specs" active-class="hover">商品规格</router-link>
        </el-menu-item>
        <el-menu-item index="2-3">
          <router-link to="/goods" active-class="hover">商品管理</router-link>
        </el-menu-item>
        <el-menu-item index="2-4">
          <router-link to="/member" active-class="hover">会员管理</router-link>
        </el-menu-item>
        <el-menu-item index="2-5">
          <router-link to="/banner" active-class="hover"
            >轮播图管理</router-link
          >
        </el-menu-item>
        <el-menu-item index="2-6">
          <router-link to="/sales" activeClass="hover">秒杀活动</router-link>
        </el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    menus() {
      return JSON.parse(localStorage.getItem("info")).menus;
    },
  },
  mounted() {
    console.log(JSON.parse(localStorage.getItem("info")).menus);
  },
};
</script>
<style lang="less" scoped>
.sideNav {
  h5 {
    line-height: 50px;
    text-align: center;
    color: #fff;
  }
  .hover {
    color: #ffd04b;
  }
  a {
    color: #fff;
  }
}
</style>