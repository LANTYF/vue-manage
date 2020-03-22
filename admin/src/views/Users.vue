<!--  -->
<template>
  <div>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
          <el-button type="success" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table class="table" :data="userList" border>
        <el-table-column label="#" width="50px" type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑用户" placement="top" effect="dark">
              <el-button size="mini" type="primary" @click="edit(scope.row)">
                <i class="el-icon-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" effect="dark">
              <el-button size="mini" type="danger" @click="remove(scope.row)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="角色分配" placement="top" effect="dark">
              <el-button size="mini" type="warning" @click="control(scope.row)">
                <i class="el-icon-s-tools"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible1">
      <el-form :model="ruleform" :rules="rules">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="ruleform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            type="password"
            v-model="ruleform.password"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="ruleform.email" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.number="ruleform.mobile" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click.prevent="postUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible2">
      <el-form :model="ruleform2" :rules="rules2">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input :disabled="true" v-model="ruleform2.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="ruleform2.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="mobile"
        >
          <el-input v-model.number="ruleform2.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editUser(ruleform2.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="dialogFormVisible3">
      <el-form :model="userRole">
        <el-form-item label="用户名:">
          <span>{{ userRole.username }}</span>
        </el-form-item>
        <el-form-item label="当前角色:">
          <span>{{ userRole.role_name }}</span>
        </el-form-item>
        <el-form-item label="选择新角色">
          <el-select v-model="currroleid">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="changeRole(userRole.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      userList: [],
      query: '', //查询内容
      pagenum: 1, //页码
      pagesize: 2, //每页数量
      total: 0, //总用户数
      dialogFormVisible1: false, //控制添加用户表单的显示隐藏
      dialogFormVisible2: false, //控制编辑用户表单的显示隐藏
      dialogFormVisible3: false, //控制修改用户角色表单的显示隐藏
      ruleform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2-5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { type: 'number', message: '请输入正确的手机号码' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
        ]
      },
      ruleform2: {},
      rules2: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
        ]
      },
      formLabelWidth: '120px',
      userRole: [],
      roles: [],
      currroleid: ''
    }
  },
  methods: {
    //获取用户列表
    async fetchUser() {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.userList = users
        this.total = total
      } else {
        this.$message.warning(msg)
      }
    },
    //获取角色列表
    async fetchRole() {
      const res = await this.$http.get('roles')
      this.roles = res.data.data
    },
    //查询用户
    search() {
      this.fetchUser()
    },
    //打开添加用户对话框
    addUser() {
      this.dialogFormVisible1 = true
    },
    //添加用户
    async postUser() {
      const res = await this.$http.post('users', this.ruleform)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.fetchUser()
        this.dialogFormVisible = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    //改变用户状态，控制用户是否可以登录
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    //打开编辑用户对话框，获取该用户的信息
    async edit(user) {
      this.dialogFormVisible2 = true
      const res = await this.$http.get(`users/${user.id}`)
      const { data } = res.data
      this.ruleform2 = data
    },
    //编辑用户并提交更新
    async editUser(id) {
      const res = await this.$http.put(`users/${id}`, this.ruleform2)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.fetchUser()
        this.dialogFormVisible2 = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    //删除用户
    remove(user) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.pagenum = 1
            this.fetchUser()
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          return
        })
    },
    //打开更改角色的对话框
    async control(user) {
      this.userRole = user
      this.dialogFormVisible3 = true
    },
    //更改用户角色
    async changeRole(id) {
      const res = await this.$http.put(`users/${id}/role`, {
        rid: this.currroleid
      })
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.fetchUser()
        this.$message.success(msg)
        this.dialogFormVisible3 = false
      } else {
        this.$message.warning(msg)
      }
    },
    async handleSizeChange(val) {
      this.pagesize = val
      this.fetchUser()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.fetchUser()
    }
  },
  created() {
    this.fetchUser()
    this.fetchRole()
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
