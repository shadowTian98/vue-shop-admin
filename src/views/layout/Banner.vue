<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">轮播图列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 轮播图表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="title" label="轮播图名称" width="180">
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
      title="会员修改"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" label-width="100px" :rules="rules" ref="form">
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>

        <el-form-item label="轮播图图片">
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
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultFormData = {
  title: "",
  img: "",
  status: true,
};
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,

      isAdd:true,
      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
      rules: {
        title: [
          {
            required: true,
            message: "轮播图标题不能为空！",
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

    //弹框打开
    openFn() {},
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
      this.fileList=[]
      this.dialogImageUrl="",
      this.dialogVisible=false
    },
    //获取轮播表格数据
    async getBannerTableList() {
      let resList = await this.$axios.get("/api/bannerlist");
      // console.log(resList);
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/banneradd" : "/api/banneredit";
      this.formData.status = this.formData.status ? 1 : 2;
      // this.formData.img = this.$refs.cateImg.files[0]? this.$refs.cateImg.files[0]: "";
      // let formDataBox = new FormData();
      // for(let item in this.formData){
      //   formDataBox.append(item,this.formData[item])
      // }
      if (!this.formData.img) {
        this.$message.warning("请选择需要轮播的图片！");
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
          // console.log(res);
          if (res.code == 200) {
            this.getBannerTableList();
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
      let res = await this.$axios.get("/api/bannerinfo", {
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
        let res = await this.$axios.post("/api/bannerdelete", { id: data.id });
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
    this.getBannerTableList();
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