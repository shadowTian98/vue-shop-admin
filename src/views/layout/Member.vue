<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">会员列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 会员表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="nickname" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="addtime" label="注册日期" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.$index, scope.row)"
            >编辑</el-button
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
      title="会员修改"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password" type="password"></el-input>
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
  nickname: "",
  phone: "",
  password: "",
  status: true,
};
export default {
  data() {
    return {
      total: 0,
      size: 2,
      page: 1,

      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
    };
  },
  methods: {
    dateTime(time) {
      let date = new Date(time);
      let y = date.getFullYear();
      let m =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      let d = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
      let h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      let f =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      let s =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      return `${y}-${m}-${d} ${h}:${f}:${s}`;
    },
    //选中分页按钮
    currentChange(page) {
      this.page = page;
      this.getMemberTableList();
    },
    //弹框打开
    openFn() {},
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
    },
    //点击提交
    async submitFn() {
      let res = await this.$axios.post("/api/memberedit", this.formData);
      console.log(res);
      if (res.code == 200) {
        this.getMemberTableList();
        this.$message.success(res.msg);
        this.isShow = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取会员表格数据（分页）
    async getMemberTableList() {
      let resList = await this.$axios.get("/api/memberlist", {
        params: {
          size: this.size,
          page: this.page,
        },
      });
      // console.log(resList);
      if (resList.code == 200) {
        resList.list.map((item) => {
          item.addtime = this.dateTime(Number(item.addtime));
        });
        this.tableData = resList.list;
      }
      console.log(resList);

      let resCount = await this.$axios.get("/api/membercount");
      // console.log(resCount);
      if (resCount.code == 200) {
        this.total = resCount.list[0].total;
      }
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/memberinfo", {
        params: {
          uid: data.uid,
        },
      });
      console.log(res);
      if (res.code == 200) {
        this.formData = {
          ...res.list,
          password: "",
          uid: data.uid,
        };
        this.isShow = true;
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    },
  },
  mounted() {
    this.getMemberTableList();
    // console.log(this.dateTime(1585403036849));
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