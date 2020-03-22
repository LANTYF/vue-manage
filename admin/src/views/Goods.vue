<!--  -->
<template>
  <div>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row type="flex" align="middle">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="search" v-model="query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16" :push="1">
          <el-button type="success" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table class="table" :data="goodsList" border>
        <el-table-column label="#" width="50px" type="index"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格" width="80px" prop="goods_price">
        </el-table-column>
        <el-table-column label="商品重量" width="80px" prop="goods_weight">
        </el-table-column>
        <el-table-column label="创建时间" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.add_time | date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      goodsList: [],
      query: '', //查询内容
      pagenum: 1, //页码
      pagesize: 10, //每页数量
      total: 0 //总商品数
    }
  },
  methods: {
    //获取商品列表
    async fetchGoods() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      const {
        data: { total, goods },
        meta: { msg, status }
      } = res.data
      console.log(goods)
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      } else {
        this.$message.warning(msg)
      }
    },
    //查询商品
    search() {
      this.fetchGoods()
    },
    //打开添加商品对话框
    addGoods() {
      this.$router.push('/add/goods')
    },
    //打开编辑商品对话框，获取该商品的信息
    async edit() {},
    //删除商品
    remove(goods) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`goods/${goods.goods_id}`)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.pagenum = 1
            this.fetchGoods()
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          return
        })
    },
    async handleSizeChange(val) {
      this.pagesize = val
      this.fetchGoods()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.fetchGoods()
    }
  },
  created() {
    this.fetchGoods()
  },
  filters: {
    date(val) {
      return moment(val).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
.card {
  padding: 0 20px 20px 20px;
}
.search {
  margin: 20px 0;
}
</style>
