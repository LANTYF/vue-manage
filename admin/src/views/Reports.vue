<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 2.为Echarts准备一个Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'

export default {
  data() {
    return {
    }
  },
  created() {},
  // 此时,页面上的元素,已经被渲染完毕了
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('/reports/type/1')
    if (res.meta.status !== 200) return this.$message('获取折线图数据失败!')
    // 5.展示数据
    myChart.setOption(res.data)
  },
  methods: {}
}
</script>

<style></style>
