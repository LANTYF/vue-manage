<!--  -->
<template>
  <div>
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" type="primary">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    //获取权限列表
    async fetchRights() {
      const res = await this.$http.get('/rights/list')
      const {
        data,
        meta: { msg, status }
      } = res.data
      console.log(data)

      if (status === 200) {
        this.rightsList = data
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  },
  created() {
    this.fetchRights()
  }
}
</script>

<style lang="scss"></style>
