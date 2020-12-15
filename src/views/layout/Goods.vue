<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 商品表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="firstcatename" label="一级分类" width="180">
      </el-table-column>
      <el-table-column prop="secondcatename" label="二级分类" width="180">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="price" label="销售价" width="180">
      </el-table-column>
      <el-table-column prop="market_price" label="市场价" width="180">
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
      :title="isAdd ? '商品添加' : '商品编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
      @opened="openedFn"
    >
      <el-form :model="formData" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="一级分类">
          <el-select v-model="formData.first_cateid" @change="firstCateChange">
            <el-option
              v-for="(item, index) in firstCate"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="formData.second_cateid">
            <el-option
              v-for="(item, index) in secondCate"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="formData.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
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
        <el-form-item label="商品规格">
          <el-select v-model="formData.specsid" @change="goodsSpecsChange">
            <el-option
              v-for="(item, index) in specsList"
              :key="index"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格值">
          <el-select v-model="formData.specsattr" multiple>
            <el-option
              v-for="(item, index) in attrs"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input v-model="formData.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="formData.market_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formData.isnew" :label="1">是</el-radio>
          <el-radio v-model="formData.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热销">
          <el-radio v-model="formData.ishot" :label="1">是</el-radio>
          <el-radio v-model="formData.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formData.status" :label="1">上架</el-radio>
          <el-radio v-model="formData.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import E from "wangeditor";

let defaultFormData = {
  first_cateid: "",
  second_cateid: "",
  goodsname: "",
  price: "",
  market_price: "",
  img: "",
  description: "",
  specsid: "",
  specsattr: "",
  isnew: 1,
  ishot: 1,
  status: 1,
};
export default {
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,

      //一级分类列表
      firstCate: "",
      //二级分类列表
      secondCate: "",

      //规格列表
      specsList: [],
      //规格值列表
      attrs: [],

      total: 0,
      size: 2,
      page: 1,

      isAdd: true,
      tableData: [],
      isShow: false,

      oldSecondId: "",

      formData: {
        ...defaultFormData,
      },
      rules: {
        goodsname: [
          {
            required: true,
            message: "商品名称不能为空！",
          },
        ],
      },
    };
  },
  methods: {
    //一级分类选中状态发生改变时触发
    firstCateChange(firstId) {
      this.formData.second_cateid = "";
      //获取选中的一级分类下的二级分类列表
      this.getCateData(firstId);
    },
    //获取分类数据
    async getCateData(pid = 0) {
      let res = await this.$axios.get("/api/catelist", {
        params: {
          pid,
        },
      });
      if (pid == 0) {
        if (res.code == 200) {
          this.firstCate = res.list;
        }
      } else {
        if (res.code == 200) {
          this.secondCate = res.list;
        }
      }
    },
    //商品规格选中状态发生改变时触发
    goodsSpecsChange(specsid) {
      // this.formData.specsattr="";
      this.specsList.map((item) => {
        if (item.id == specsid) {
          this.attrs = item.attrs;
        }
      });
    },
    //获取商品规格数据
    async getSpecsData() {
      let resList = await this.$axios.get("/api/specslist");
      console.log(resList);
      if (resList.code == 200) {
        this.specsList = resList.list;
      }
      this.goodsSpecsChange(this.formData.specsid);
    },
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
    //选中分页按钮
    currentChange(page) {
      this.page = page;
      this.getGoodsTableList();
    },
    //弹框打开
    openFn() {
      //获取一级分类列表
      this.getCateData();
      this.getSpecsData();
    },
    openedFn() {
      document.getElementById("editor").innerHTML = "";
      const editor = new E("#editor");
      editor.create();
      this.editor = editor;
      this.editor.txt.html(this.formData.description);
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
      this.editor.txt.html("");
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/goodsadd" : "/api/goodsedit";
      //multiple响应的是数组，提交时specsattr规定为字符串
      this.formData.specsattr = this.formData.specsattr.join(",");
      this.formData.description = this.editor.txt.html();
      console.log(this.formData.description);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$upload.post(url, this.formData);
          console.log(res);
          if (res.code == 200) {
            this.getGoodsTableList();
            this.$message.success(res.msg);
            this.isShow = false;
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    //获取商品表格数据（分页）
    async getGoodsTableList() {
      let resList = await this.$axios.get("/api/goodslist", {
        params: {
          size: this.size,
          page: this.page,
        },
      });
      console.log(resList);
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
      let resCount = await this.$axios.get("/api/goodscount");
      // console.log(resCount);
      if (resCount.code == 200) {
        this.total = resCount.list[0].total;
      }
    },
    //点击添加按钮
    addFn() {
      this.isShow = true;
    },
    //点击编辑
    async editFn(i, data) {
      this.isAdd = false;
      let res = await this.$axios.get("/api/goodsinfo", {
        params: {
          id: data.id,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        if (this.editor) {
          this.editor.txt.html(res.list.description);
        }
        //手动调用获取二级分类列表
        this.firstCateChange(res.list.first_cateid);
        //手动调用获取规格值列表
        this.getSpecsData();
        this.formData = {
          ...res.list,
          id: data.id,
        };
        console.log(res.list);
        this.formData.specsattr = res.list.specsattr.split(",");
        console.log(this.formData);
        this.fileList = [
          {
            name: "",
            url: `http://localhost:3000${res.list.img}`,
          },
        ];

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
        let res = await this.$axios.post("/api/goodsdelete", { id: data.id });
        if (res.code == 200) {
          this.page = 1;
          this.getGoodsTableList();
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
    this.getGoodsTableList();
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