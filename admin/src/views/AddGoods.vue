<!--  -->
<template>
  <div class="add_goods">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps
        :active="active * 1"
        finish-status="success"
        :align-center="true"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="命名参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="goodsData" :rules="rules" ref="form">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsData.goods_cat"
                :options="categories"
                :props="defaultProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              v-for="item in params"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  class="checkbox"
                  border
                  checked
                  v-for="(name, i) in item.attr_vals.trim().split(',')"
                  :key="i"
                  :label="name"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="item in props"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="goodsData.goods_introduce"></quill-editor>
            <el-button @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: '',
  data() {
    return {
      active: 0,
      goodsData: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      categories: [],
      defaultProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      params: [],
      checkList: [],
      props: [],
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    async fetchCategories() {
      const res = await this.$http.get('categories')
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.categories = data
      } else {
        this.$message.warning(msg)
      }
    },
    async fetchParams() {
      const res = await this.$http.get(
        `categories/${this.goodsData.goods_cat[2]}/attributes?sel=many`
      )
      const { data } = res.data
      this.params = data ? data : []
    },
    async fetchProps() {
      const res = await this.$http.get(
        `categories/${this.goodsData.goods_cat[2]}/attributes?sel=only`
      )
      console.log(res.data)
      const { data } = res.data
      this.props = data
    },
    tabChange() {
      if (this.active !== '0') {
        if (this.goodsData.goods_cat.length !== 3) {
          this.$message.warning('请先选择三级分类')
        }
      }
    },
    handleChange(val) {
      if (val.length === 3) {
        this.fetchParams()
        this.fetchProps()
      }
    },
    handleRemove(file) {
      //file.response.data.tmp_path
      this.goodsData.pics.forEach((item, i) => {
        if (item.pic === file.response.data.tmp_path) {
          this.goodsData.pics.splice(i, 1)
        }
      })
      console.log(this.goodsData.pics)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(file) {
      this.goodsData.pics.push({
        pic: file.data.tmp_path
      })
    },
    async addGoods() {
      this.goodsData.goods_cat =
        this.goodsData.goods_cat.length === 3
          ? this.goodsData.goods_cat.join(',')
          : ''
      this.goodsData.attrs = this.params.concat(this.props)
      const res = await this.$http.post('goods', this.goodsData)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 201) {
        console.log(this.goodsData)
        this.$router.push('/goods')
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  },
  created() {
    this.fetchCategories()
  }
}
</script>

<style>
.add_goods .el-form-item__label {
  float: none !important;
}
.add_goods .ql-editor {
  min-height: 300px;
}
</style>
