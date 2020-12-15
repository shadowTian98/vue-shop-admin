<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">角色列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 角色表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="rolename" label="名称" width="180">
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

    <!-- 弹框 -->
    <el-dialog :title="isAdd?'角色添加':'角色编辑'" :visible.sync="isShow" @open="openFn"
      @close="closeFn">
      <el-form :model="formData" :rules="rules"  label-width="100px" ref="form">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="formData.rolename"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            :data="menuData"
            show-checkbox
            node-key="id"
            check-strictly
            :default-checked-keys="defaultChecked"
            :props="{children:'children',label:'title'}"
          >
          </el-tree>
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
  rolename: "",
  menus: "",
  status: true,
};
export default {
  data() {
    return {
      isAdd:true,
      defaultChecked:[],
      //菜单数据
      menuData: [],
      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "创建角色名称不能为空！",
          },
        ],
      },
    };
  },
  methods: {
    //弹框打开
    openFn() {
      this.getMenuList();
    },
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
      this.defaultChecked=[];
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/roleadd" : "/api/roleedit";
      this.formData.status = this.formData.status ? 1 : 2;
      this.formData.menus=this.$refs.tree.getCheckedKeys().join(',');
      // console.log(this.formData);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$axios.post(url, this.formData);
          console.log(res);
          if (res.code == 200) {
            this.getRoleTableList();
            this.$message.success(res.msg);
            this.isShow = false;
            
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    //获取角色表格数据
    async getRoleTableList() {
      let resList = await this.$axios.get("/api/rolelist");
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
    },
    //获取菜单表格数据（树状）
    async getMenuList() {
      let res = await this.$axios.get("/api/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        this.menuData = res.list;
        // console.log(res.list);
      }
    },
    addFn() {
      this.isShow = true;
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/roleinfo", {
        params: {
          id: data.id,
        },
      });
      if (res.code == 200) {
        res.list.status = res.list.status == 1 ? true : false;
        this.defaultChecked=res.list.menus.split(',');
        this.formData = {
          ...res.list,
          id: data.id,
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
        let res = await this.$axios.post("/api/roledelete", { id: data.id });
        if (res.code == 200) {
          this.tableData = [...res.list];
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
    this.getRoleTableList();
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