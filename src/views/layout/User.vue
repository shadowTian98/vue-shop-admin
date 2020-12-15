<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 用户表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="uid" label="用户编号" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色" width="180">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-show="scope.row.status == 1">
            启用
          </el-tag>
          <el-tag effect="dark" type="danger" v-show="scope.row.status == 2">
            禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteFn(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="page"
      @current-change="currentChange"
    >
    </el-pagination>
    <!-- 弹框 -->
    <el-dialog
      :title="isAdd ? '管理员添加' : '管理员编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="角色">
          <el-select v-model="formData.roleid">
            <el-option
              v-for="(item, index) in roleData"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

let defaultFormData = {
  roleid: "",
  username: "",
  password: "",
  status: true,
};
export default {
  data() {
    return {
      total: 0,
      size: 1,
      page: 1,
      isAdd: true,
      //角色数据
      roleData: [],
      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空！",
          },
        ],
      },
    };
  },
  methods: {
    currentChange(page){
      this.page=page;
      this.getUserTableList();
    },
    //弹框打开
    openFn() {
      this.getRoleList();
    },
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/useradd" : "/api/useredit";
      this.formData.status = this.formData.status ? 1 : 2;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$axios.post(url, this.formData);
          console.log(res);
          if (res.code == 200) {
            this.getUserTableList();
            this.$message.success(res.msg);
            this.isShow = false;
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    //获取角色数据
    async getRoleList() {
      let resList = await this.$axios.get("/api/rolelist");
      if (resList.code == 200) {
        this.roleData = resList.list;
      }
    },
    //获取管理员表格数据
    async getUserTableList() {
      let resList = await this.$axios.get("/api/userlist", {
        params: {
          size: this.size,
          page: this.page,
        },
      });
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
      let resCount = await this.$axios.get("/api/usercount");
      // console.log(resCount);
      if (resCount.code == 200) {
        this.total = resCount.list[0].total;
      }
    },
    addFn() {
      this.isShow = true;
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/userinfo", {
        params: {
          uid: data.uid,
        },
      });
      console.log(res);
      if (res.code == 200) {
        res.list.status = res.list.status == 1 ? true : false;
        this.formData = {
          ...res.list,
          uid: data.uid,
        };
        this.isShow = true;
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    },
    //点击删除
    async deleteFn(i, data) {
      try {
        await this.$confirm("您请三思而后行！", "", {
          confirmButtonText: "狠心删除",
          cancelButtonText: "考虑一下",
          type: "warning",
        });
        let res = await this.$axios.post("/api/userdelete", { id: data.id });
        if (res.code == 200) {
          this.page=1;
          this.getUserTableList();
          // this.tableData = [...res.list];
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        } else if (res.code == 500) {
          this.$message.error(res.msg);
        }
      } catch (error) {}
    },
  },
  mounted() {
    this.getUserTableList();
  },
};
</script>
<style lang="less" scoped>
.role {
  .el-breadcrumb {
    margin-bottom: 18px;
  }
}
</style>