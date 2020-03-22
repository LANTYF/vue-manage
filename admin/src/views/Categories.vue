<!--  -->
<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button class="addbtn" type="primary" @click="open">添加分类</el-button>
      <el-table
        :data="catList"
        row-key="cat_id"
        border
        stripe
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
        <el-table-column type="index" label="#">
          <template slot-scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i v-if="scope.row.cat_deleted === false" class="el-icon-check icon icon-true"></i>
            <i v-else class="el-icon-close icon icon-false"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="warning">二级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 2" type="primary">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openEdit(scope.row)">
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
        :page-sizes="[3, 5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisable">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader :options="categories" v-model="selectedOptions" :props="defaultProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="dialogVisable2">
      <el-form :model="form2" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form2.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisable2 = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catList: [],
      pagenum: 1, //页码
      pagesize: 5, //每页数量
      total: 0, //总用户数
      dialogVisable: false,
      dialogVisable2: false,
      form: {
        cat_name: ''
      },
      rules: {
        cat_name: [{required: true, message: "请输入分类名称"}]
      },
      form2: {
        cat_name: ''
      },
      rules2: {
        cat_name: [{required: true, message: "请输入分类名称"}]
      },
      defaultProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      categories: {},
      selectedOptions: {},
      cat_id: ''
    }
  },
  methods: {
    async fetchCategories() {
      const res = await this.$http.get(`categories?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.total = data.total
        this.catList = data.result
        this.catList.forEach((item, i) => {
          item.index = i + 1
        })
      } else {
        this.$message.warning(msg)
      }
    },
    async handleSizeChange(val) {
      this.pagesize = val
      this.fetchCategories()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.fetchCategories()
    },
    async open() {
      const res = await this.$http.get('categories?type=2')
      this.categories = res.data.data
      this.dialogVisable = true
    },
    async confirm() {
      let level = this.selectedOptions.length
      let putData = {
        cat_pid: this.selectedOptions[level - 1],
        cat_name: this.form.cat_name,
        cat_level: level
      }
      const res = await this.$http.post('categories', putData)
      const { meta: {msg, status}} = res.data
      if (status === 201) {
        this.fetchCategories()
        this.dialogVisable = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    async openEdit(cate) {
      this.cat_id = cate.cat_id
      const res = await this.$http.get(`/categories/${cate.cat_id}`) 
      this.form2 = res.data.data
      this.dialogVisable2 = true
    },
    async edit() {
      await this.$http.put(`/categories/${this.cat_id}`, {
        cat_name: this.form2.cat_name
      })
      this.dialogVisable2 = false
      this.fetchCategories()
    },
    remove(cate) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`categories/${cate.cat_id}`)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.pagenum = 1
            this.fetchCategories()
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          return
        })
    },
  },
  created() {
    this.fetchCategories()
  }
}
</script>

<style scoped>
.addbtn {
  margin-bottom: 15px;
}
.icon {
  border: 1px solid;
  border-radius: 50%;
}
.icon-true {
  border-color: #67C23A;
  color: #67C23A;
}
.icon-false {
  border-color: #F56C6C;
  color: #F56C6C;
}
</style>
