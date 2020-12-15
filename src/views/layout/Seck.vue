<template>
  <div class="role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">限时秒杀列表</a></el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <!-- 会员表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="id">
      <el-table-column prop="title" label="活动名称" width="180">
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
      :title="isAdd ? '限时秒杀添加' : '限时秒杀修改'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="formData" label-width="100px" :rules="rules" ref="form">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <div class="block">
          <span class="demonstration">活动期限</span>
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="chooseDate"
          >
          </el-date-picker>
        </div>
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
        <el-form-item label="二级分类" >
          <el-select v-model="formData.second_cateid" @change="secondCateChange">
            <el-option
              v-for="(item, index) in secondCate"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="formData.goodsid">
            <el-option
              v-for="(item, index) in goodsAttrs"
              :key="index"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
  begintime: "",
  endtime: "",
  first_cateid: "",
  second_cateid: "",
  goodsid: "",
  status: true,
};
export default {
  data() {
    return {
      //日期范围,标准时间
      daterange: [],

      firstCate: [],
      secondCate: [],
      goodsAttrs: [],

      isAdd: true,
      tableData: [],
      isShow: false,
      formData: {
        ...defaultFormData,
      },
      rules: {
        title: [
          {
            required: true,
            message: "限时秒杀标题不能为空！",
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
    secondCateChange(secondId) {
      this.formData.goodsid='';
      this.getGoodsByCate(this.formData.first_cateid,secondId);
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
    //根据一级二级分类获取商品数据
    async getGoodsByCate(firstid,secondId) {
      let resList = await this.$axios.get("/api/goodslist", {
        params: {
          fid: firstid,
          sid: secondId,
        },
      });
      console.log(resList);
      if (resList.code == 200) {
        this.goodsAttrs = resList.list;
      }
    },
    chooseDate() {
      // console.log(this.daterange);
      this.formData.begintime = new Date(this.daterange[0]).getTime().toString();
      this.formData.endtime = new Date(this.daterange[1]).getTime().toString();
      // console.log(new Date(this.daterange[0]).getTime());
    },
    //弹框打开
    openFn() {
      this.getCateData();
    },
    //弹框关闭
    closeFn() {
      this.isAdd = true;
      this.formData = {
        ...defaultFormData,
      };
      this.daterange=[];
    },
    //获取限时秒杀表格数据
    async getSeckTableList() {
      let resList = await this.$axios.get("/api/secklist");
      console.log(resList);
      if (resList.code == 200) {
        this.tableData = resList.list;
      }
    },
    //点击提交
    submitFn() {
      let url = this.isAdd ? "/api/seckadd" : "/api/seckedit";
      this.formData.status = this.formData.status ? 1 : 2;
      this.chooseDate();
      console.log(this.formData);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$axios.post(url, this.formData);
          if (res.code == 200) {
            this.getSeckTableList();
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
      let res = await this.$axios.get("/api/seckinfo", {
        params: {
          id: data.id,
        },
      });
      if (res.code == 200) {
        this.isShow = true;
        // console.log(res.list);
        //数组成员会导致数据发生变化，数据不更新，在此使用vue能监测到的数组方法
        this.daterange.push(new Date(Number(res.list.begintime)),new Date(Number(res.list.endtime))) 
        // console.log(this.daterange);
        //手动获取二级分类列表
        this.firstCateChange(res.list.first_cateid);
        //手动获取商品列表
        console.log(res.list);
        this.getGoodsByCate(res.list.first_cateid,res.list.second_cateid)
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
        let res = await this.$axios.post("/api/seckdelete", { id: data.id });
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
    this.getSeckTableList();
    // console.log(this.dateTime(1585403036849));
  },
};
</script>
<style lang="less" scoped>
.role {
  .el-breadcrumb {
    margin-bottom: 18px;
  }
  .block {
    margin-left: 40px;
    margin-bottom: 20px;
  }
}
</style>