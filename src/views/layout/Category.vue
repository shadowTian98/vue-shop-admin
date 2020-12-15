<template>
  <div class="menu">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">分类列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 分类表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <el-table-column prop="catename" label="分类名称" width="180">
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
      :title="isAdd ? '分类添加' : '编辑分类'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="上级分类">
          <el-select v-model="formData.pid">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="(item, index) in topCate"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="formData.catename"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
          <!-- <input type="file" ref="cateImg" /> -->
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :multiple="false"
            :on-change="fileStatusChange"
            :auto-upload="false"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" />
          </el-dialog>
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
  catename: "",
  img: "",
  status: true,
};
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
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
      //弹框顶级分类数据
      topCate: [],
      //验证
      rules: {
        catename: [
          {
            required: true,
            message: "分类名称不能为空！",
          },
        ],
      },
    };
  },
  methods: {
    //文件状态发生改变的时候触发
    fileStatusChange(file, filelist) {
      // console.log(file);
      this.formData.img = file.raw;
    },
    //点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      // console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //获取分类表格数据（树状）
    async getCateTableList() {
      let res = await this.$axios.get("/api/catelist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    //获取顶级分类数据
    async getTopCate() {
      let res = await this.$axios.get("/api/catelist", {
        params: {
          pid: 0,
        },
      });
      if (res.code == 200) {
        this.topCate = res.list;
      }
    },
    //弹框打开
    openFn() {
      this.getTopCate();
    },
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
      this.fileList = [];
      this.dialogImageUrl = "";
      this.dialogVisible = false;
    },
    // 点击取消
    cancelFn() {
      this.isShow = false;
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/cateadd" : "/api/cateedit";
      this.formData.status = this.formData.status ? 1 : 2;
      // this.formData.img = this.$refs.cateImg.files[0]? this.$refs.cateImg.files[0]: "";
      // let formDataBox = new FormData();
      // for(let item in this.formData){
      //   formDataBox.append(item,this.formData[item])
      // }
      if (!this.formData.img) {
        this.$message.warning("请选择分类图片！");
        return;
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$upload.post(url, this.formData);
          // let res = await this.$axios.post(url,formDataBox,{
          //   headers:{
          //     "Content-Type":"multipart/form-data"
          //   }
          // });
          console.log(res);
          if (res.code == 200) {
            this.getCateTableList();
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
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/cateinfo", {
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
        if (res.list.img) {
          this.fileList = [
            {
              name: "",
              url: `http://localhost:3000/${res.list.img}`,
            },
          ];
        }
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
        let res = await this.$axios.post("/api/catedelete", { id: data.id });
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
    this.getCateTableList();
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