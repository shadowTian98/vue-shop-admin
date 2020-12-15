<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">规格列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>
    
    <!-- 规格表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="specsname" label="属性名称" width="180">
      </el-table-column>
      <el-table-column label="属性值" width="180">
        <template slot-scope="scope">
          <el-tag
            type="primary"
            v-for="(item, index) in scope.row.attrs"
            :key="index"
          >
            {{ item }}
          </el-tag>
        </template>
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
    <el-dialog
      :title="isAdd ? '规格添加' : '规格编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="formData.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div>
            <el-input v-model="addAttr" class="addInp"> </el-input>
            <el-button @click="addAttrFn" type="primary">新增属性</el-button>
          </div>
          <div v-for="(item, index) in addAttrs" :key="index">
            <el-input v-model="item.val" class="delInp"> </el-input>
            <el-button @click="delAttrFn(index)" type="danger"
              >删除属性</el-button
            >
          </div>
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
  specsname: "",
  attrs: "",
  status: true,
};
export default {
  data() {
    return {
      //绑定添加属性
      addAttr: "",
      //存放添加的属性(数组套对象，因为数组成员非对象的话没有get,set,数据发生改变，页面不更新)
      addAttrs: [],
      isAdd: true,
      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
      rules: {
        specsname: [
          {
            required: true,
            message: "创建角色名称不能为空！",
          },
        ],
      },
    };
  },
  methods: {
    //点击新增属性按钮
    addAttrFn() {
      this.addAttrs.push({ val: this.addAttr });
      this.addAttr = "";
    },
    //点击删除属性按钮
    delAttrFn(i) {
      this.addAttrs.splice(i, 1);
    },
    //弹框打开
    openFn() {},
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
      this.addAttrs = [];
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/specsadd" : "/api/specsedit";
      this.formData.status = this.formData.status ? 1 : 2;
      this.formData.attrs = this.addAttrs.map((item) => item.val).join(",");
      console.log(this.formData);
      // console.log(this.formData);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$axios.post(url, this.formData);
          console.log(res);
          if (res.code == 200) {
            this.getSpecsTableList();
            this.$message.success(res.msg);
            this.isShow = false;
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    //获取规格表格数据
    async getSpecsTableList() {
      let resList = await this.$axios.get("/api/specslist");
      console.log(resList);
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
    },
    addFn() {
      this.isShow = true;
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/specsinfo", {
        params: {
          id: data.id,
        },
      });
      // console.log(res);
      if (res.code == 200) {
        res.list[0].status = res.list[0].status == 1 ? true : false;
        res.list[0].attrs = res.list[0].attrs.join(",");
        this.formData = {
          ...res.list[0],
          id: data.id,
        };
        // console.log(this.formData.attrs.split(','));
        this.addAttrs = this.formData.attrs.split(",").map((item) => {
          return { val: item };//这里不能省略return
        });
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
        let res = await this.$axios.post("/api/specsdelete", { id: data.id });
        if (res.code == 200) {
          this.getSpecsTableList();
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
    this.getSpecsTableList();
  },
};
</script>
<style lang="less" scoped>
.role {
  .el-breadcrumb {
    margin-bottom: 18px;
  }
  .addInp,
  .delInp {
    width: 80%;
    margin: 3px 0;
  }
}
</style>