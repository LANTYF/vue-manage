<!--  -->
<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '20px 20px 0 0' }">
      <div slot="header" class="clearfix">
        <h2>电商管理系统</h2>
      </div>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input
            type="password"
            v-model="form.password"
            @keydown.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    async submit() {
      const res = await this.$http.post('login', this.form)
      const {
        data,
        meta: { msg, status }
      } = res.data
      console.log(data)

      if (status === 200) {
        sessionStorage.setItem('token', data.token)
        this.$router.push('/')
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 480px;
  margin: 200px auto;
}
</style>
