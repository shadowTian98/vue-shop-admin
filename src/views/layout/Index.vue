<template>
  <div class="index">
    <el-row :gutter="10" type="flex" justify="space-around" class="index_row">
      <el-col :span="10">
        <div class="indexBox">
          <h5>商品总览</h5>
          <el-row type="flex" justify="space-evenly" align="bottom" class="num">
            <el-col :span="8"> 100 </el-col>
            <el-col :span="8"> 400 </el-col>
            <el-col :span="8"> 50 </el-col>
            <el-col :span="8"> 500 </el-col>
          </el-row>
          <el-row type="flex" justify="space-evenly" align="top">
            <el-col :span="8"> 已下架 </el-col>
            <el-col :span="8"> 已上架 </el-col>
            <el-col :span="8"> 库存紧张 </el-col>
            <el-col :span="8"> 全部商品 </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="indexBox">
          <h5>用户总览</h5>
          <el-row type="flex" justify="space-evenly" align="bottom" class="num">
            <el-col :span="8"> 100 </el-col>
            <el-col :span="8"> 200 </el-col>
            <el-col :span="8"> 1000 </el-col>
            <el-col :span="8"> 5000 </el-col>
          </el-row>
          <el-row type="flex" justify="space-evenly" align="top">
            <el-col :span="8"> 今日新增 </el-col>
            <el-col :span="8"> 昨日新增 </el-col>
            <el-col :span="8"> 本月新增 </el-col>
            <el-col :span="8"> 会员总数 </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div id="main" style="width: 800px; height: 450px"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {
      legend: {
        data: ["近一周订单数量"],
      },
      xAxis: {
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        boundaryGap: false,
      },
      yAxis: {
        // data: [0, 200, 400, 600, 800, 1000],
        // boundaryGap: false,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            type: "png",
            title: "保存为图片",
            name: "近一周订单数量",
          },
        },
      },
      series: [
        {
          name: "近一周订单数量",
          type: "line",
          data: [580, 600, 500, 300, 400, 700, 800],
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>
<style lang="less" scoped>
.index {
  height: 100%;
  font-size: 12px;
  .indexBox {
    border: 1px solid #a3a3;
    height: 150px;
    .el-row {
      height: 40px;
    }
    .el-col {
      text-align: center;
    }
    .num {
      color: red;
    }
  }
  h5 {
    line-height: 55px;
    padding-left: 20px;
    background-color: #fff;
  }
  #main {
    margin: 100px;
  }
}
</style>