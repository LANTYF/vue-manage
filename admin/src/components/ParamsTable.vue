<!--  -->
<template>
  <div class="table">
    <el-table :data="params" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag
            class="tag"
            type="primary"
            plain
            closable
            v-for="item in scope.row.attr_vals"
            :key="item.attr_id"
            @close="handleClose(item, scope.row)"
            >{{ item }}</el-tag
          >
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ New Tag</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="`修改${title}`"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      dialogVisible: false,
      form: {
        attr_name: ''
      },
      rules: {
        attr_name: [{ required: true, message: '请输入参数名称' }]
      },
      cat_id: '',
      attr_id: ''
    }
  },
  props: ['params', 'title', 'sel'],
  methods: {
    //添加标签
    async handleInputConfirm(row) {
      let inputValue = this.inputValue
      if (this.inputValue.length !== 0) {
        row.attr_vals.push(inputValue)
        let putData = {
          attr_name: row.attr_name,
          attr_sel: this.sel,
          attr_vals: row.attr_vals.join(',')
        }
        await this.$http.put(
          `/categories/${row.cat_id}/attributes/${row.attr_id}`,
          putData
        )
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    //点击显示输入框
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //删除标签
    async handleClose(tag, row) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
      let putData = {
        attr_name: row.attr_name,
        attr_sel: this.sel,
        attr_vals: row.attr_vals.join(',')
      }
      await this.$http.put(
        `/categories/${row.cat_id}/attributes/${row.attr_id}`,
        putData
      )
    },
    //打开编辑对话框、获取编辑内容
    async edit(row) {
      this.cat_id = row.cat_id
      this.attr_id = row.attr_id
      const res = await this.$http.get(
        `/categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      const { data } = res.data
      this.form = data
      this.dialogVisible = true
    },
    //删除参数
    async remove(row) {
      const res = await this.$http.delete(
        `categories/${row.cat_id}/attributes/${row.attr_id}`
      )
      console.log(res.data)
      const {
        meta: { msg, status }
      } = res.data
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (status === 200) {
            this.$emit('remove')
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          return
        })
    },
    //取消编辑
    dialogClose() {
      this.dialogVisible = false
    },
    //提交编辑
    async confirm() {
      const res = await this.$http.put(
        `/categories/${this.cat_id}/attributes/${this.attr_id}`,
        this.form
      )
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.$emit('confirm')
        this.dialogVisible = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.tag {
  margin-right: 5px;
}
 .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
.input-new-tag {
    width: 90px !important;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .table {
    margin-top: 15px;
  }
</style>
