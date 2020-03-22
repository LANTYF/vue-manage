<!--  -->
<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        style="width: 400px; margin-bottom: 15px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="300px"
        ></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="danger">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send === '否'" type="danger"
              >未发货</el-tag
            >
            <el-tag v-else type="danger">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button size="mini" type="success" @click="show(scope.row)">
              <i class="el-icon-location-outline"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="dialogVisable">
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader :options="catlist" v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流进度" :visible.sync="dialogVisable2">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import catlist from '@/assets/js/citydata.js'
export default {
  name: '',
  data() {
    return {
      orderList: [],
      query: '', //查询内容
      pagenum: 1, //页码
      pagesize: 10, //每页数量
      total: 0,
      dialogVisable: false,
      dialogVisable2: false,
      selectedOptions: [],
      catlist,
      form: {},
      activities: []
    }
  },
  methods: {
    async fetchOrders() {
      const res = await this.$http.get(
        `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.total = data.total
        this.orderList = data.goods
      } else {
        this.$message.warning(msg)
      }
    },
    async handleSizeChange(val) {
      this.pagesize = val
      this.fetchOrders()
    },
    search() {
      this.fetchOrders()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.fetchOrders()
    },
    edit() {
      this.dialogVisable = true
    },
    async show() {
      this.dialogVisable2 = true
      const res = await this.$http.get('/kuaidi/804909574412544580')
      this.activities = res.data.data
    },
    confirm() {}
  },
  created() {
    this.fetchOrders()
  },
  filters: {
    date(val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style>
.input-with-select {
  width: 400px;
}
</style>
