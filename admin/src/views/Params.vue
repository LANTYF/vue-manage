<!--  -->
<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-alert
        class="warning"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <span>选择上分类：</span>
      <el-cascader
        :options="categories"
        v-model="selectedOptions"
        :props="defaultProps"
        @change="handleChange"
        clearable
      >
      </el-cascader>
      <el-tabs v-model="active">
        <el-tab-pane label="动态参数">
          <el-button
            type="primary"
            size="small"
            plain
            :disabled="isable"
            @click="open"
          >
            添加参数
          </el-button>
          <params-table
            :params="params"
            title="动态参数"
            sel="many"
            @confirm="refresh"
            @remove="refresh"
          ></params-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性">
          <el-button
            type="primary"
            size="small"
            plain
            :disabled="isable"
            @click="open"
          >
            添加属性
          </el-button>
          <params-table
            :params="props"
            title="静态属性"
            sel="only"
            @confirm="refresh"
            @remove="refresh"
          ></params-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="'添加' + title" :visible.sync="dialogVisable">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ParamsTable from '@/components/ParamsTable'
export default {
  name: '',
  data() {
    return {
      categories: [],
      defaultProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      params: [],
      props: [],
      active: 0,
      selectedOptions: [],
      dialogVisable: false,
      form: {
        attr_name: ''
      },
      rules: {attr_name: [{required: true, message: '请输入名称'}]}
    }
  },
  components: {
    ParamsTable
  },
  methods: {
    async fetchCategories() {
      const res = await this.$http.get('categories')
      const { data } = res.data
      this.categories = data
    },
    async handleChange(val) {
      const res1 = await this.$http.get(
        `categories/${val[2]}/attributes?sel=many`
      )
      const res2 = await this.$http.get(
        `categories/${val[2]}/attributes?sel=only`
      )
      this.params = res1.data.data
      this.params &&
        this.params.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      this.props = res2.data.data
      this.props &&
        this.props.forEach(item => {
          item.attr_vals = item.attr_vals.trim().split(',')
        })
    },
    open() {
      this.dialogVisable = true
    },
    refresh() {
      this.handleChange(this.selectedOptions)
    },
    async add() {
      let putData = {
        attr_name: this.form.attr_name,
        attr_sel: this.active === '0' ? 'many' : 'only',
        attr_vals: ''
      }
      const res = await this.$http.post(`/categories/${this.selectedOptions[2]}/attributes`, putData)
      console.log(res.data);
      
      const { meta: { msg, status } } = res.data
      if (status === 201) {
        this.handleChange(this.selectedOptions)
        this.dialogVisable = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  },
  computed: {
    isable() {
      return this.selectedOptions.length !== 3
    },
    title() {
      return this.active === '0' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.fetchCategories()
  }
}
</script>

<style>
.warning {
  margin-bottom: 15px !important;
}
.tag {
  margin-right: 5px;
}
</style>
