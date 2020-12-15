<template>
  <div class="menu">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">菜单管理</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 菜单表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column prop="title" label="名称" width="180"> </el-table-column>
      <el-table-column label="图标" width="180">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">目录</el-tag>
          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单URL" width="180">
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
    <el-dialog
      :title="isAdd ? '新增菜单' : '编辑菜单'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="菜单分类">
          <el-select v-model="formData.pid" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="(item, index) in topMenu"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          v-show="formData.type == '1'"
          class="inpLoc"
        >
          <el-input v-model="formData.icon"> </el-input>
          <!-- <i
            :class="formData.icon"
            class="iconLoc"
            v-show="isAdd==false && formData.type == 1"
          ></i> -->
        </el-form-item>
        <el-form-item label="菜单地址" v-show="formData.type == '2'">
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio
            v-model="radio"
            label="1"
            :disabled="radio == '2'"
            text-color="blue"
            >目录</el-radio
          >
          <el-radio v-model="radio" label="2" :disabled="radio == '1'"
            >菜单</el-radio
          >
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="submitFn">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

let defaultFormData = {
  pid: 0,
  title: "",
  icon: "",
  type: 1,
  url: "",
  status: true,
};
export default {
  data() {
    return {
      //是否添加操作
      isAdd: true,
      //菜单列表数据
      tableData: [],
      //弹框是否显示
      isShow: false,
      //弹框表单数据
      formData: {
        ...defaultFormData,
      },
      //弹框顶级菜单数据
      topMenu: [],
      //验证
      rules: {
        title: [
          {
            required: true,
            message: "菜单名称不能为空！",
          },
        ],
      },
    };
  },
  //单选按钮
  computed: {
    radio() {
      return this.formData.type == 1 ? "1" : "2";
    },
  },
  methods: {
    //获取菜单表格数据（树状）
    async getMenuTableList() {
      let res = await this.$axios.get("/api/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    //获取顶级菜单数据
    async getTopMenu() {
      let res = await this.$axios.get("/api/menulist", {
        params: {
          pid: 0,
        },
      });
      if (res.code == 200) {
        this.topMenu = res.list;
      }
    },
    //弹框打开
    openFn() {
      this.getTopMenu();
    },
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
    },
    // 点击取消
    cancelFn() {
      this.isShow = false;
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/menuadd" : "/api/menuedit";
      this.formData.status = this.formData.status ? 1 : 2;
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$axios.post(url, this.formData);
          if (res.code == 200) {
            this.getMenuTableList();
            this.$message.success(res.msg);
            this.isShow = false;
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    //点击添加
    addFn() {
      this.isShow = true;
    },
    changePid(pid) {
      this.formData.type = pid == 0 ? 1 : 2;
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/menuinfo", {
        params: {
          id: data.id,
        },
      });
      if (res.code == 200) {
        this.isShow = true;
        res.list.status = res.list.status == 1 ? true : false;
        this.formData = {
          ...res.list,
          id: data.id,
        };
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
        let res = await this.$axios.post("/api/menudelete", { id: data.id });
        console.log(res);
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
      // if (data.pid == 0) {
      //   this.tableData.splice(i, 1);
      // } else {
      //   for (var i = 0; i < this.tableData.length; i++) {
      //     this.tableData[i].children.map((item, index) => {
      //       if (item == data) {
      //         this.tableData[i].children.splice(index, 1);
      //       }
      //     });
      //   }
      // }
    },
  },
  mounted() {
    this.getMenuTableList();
  },
};
</script>
<style lang="less" scoped>
.menu {
  .el-breadcrumb {
    margin-bottom: 18px;
  }
  .inpLoc {
    position: relative;
  }
  .iconLoc {
    position: absolute;
    top: 50px;
    left: 10px;
  }
}
</style>