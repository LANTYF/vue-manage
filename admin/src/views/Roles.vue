<!--  -->
<template>
  <div>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button class="addbtn" type="success" @click="addRole"
        >添加角色</el-button
      >
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <el-col :span="4">
                <el-tag closable type="success">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="4">
                    <el-tag type="primary" closable>
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      class="tag"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                    >
                      {{ item3.authName }}
                    </el-tag>
                    <el-divider></el-divider>
                    <!-- <el-row v-for="item3 in item2.children" :key="item3.id">
                      <el-tag type="danger" closable>
                        {{item3.authName}}
                      </el-tag>
                    </el-row> -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50px"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
            <el-button size="mini" type="warning" @click="control(scope.row)">
              <i class="el-icon-s-tools"></i>权限分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible1">
      <el-form :model="addform" :rules="addrules">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="addform.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="addform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click.prevent="postRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible2">
      <el-form :model="editform" :rules="editrules">
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="editform.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="editform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editRole(editform.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="修改权限" :visible.sync="dialogFormVisible3">
      <el-tree
        :data="rightsTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :default-checked-keys="arrCheck"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
      <span slot="footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="changeRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      roleList: [],
      dialogFormVisible1: false, //控制添加角色表单的显示隐藏
      dialogFormVisible2: false, //控制编辑角色表单的显示隐藏
      dialogFormVisible3: false, //控制修改权限表单的显示隐藏
      formLabelWidth: '120px',
      addform: {
        roleName: '',
        roleDesc: ''
      },
      addrules: {
        roleName: [{ required: true, message: '请输入角色名称' }],
        roleDesc: [{ required: true, message: '请输入角色描述' }]
      },
      editform: {
        roleName: '',
        roleDesc: ''
      },
      editrules: {
        roleName: [{ required: true, message: '请输入角色名称' }],
        roleDesc: [{ required: true, message: '请输入角色描述' }]
      },
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      arrCheck: [],
      currentId: ''
    }
  },
  methods: {
    //获取角色列表
    async fetchRole() {
      const res = await this.$http.get('roles')
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.roleList = data
      } else {
        this.$message.warning(msg)
      }
    },
    //打开添加角色的对话框
    addRole() {
      this.dialogFormVisible1 = true
    },
    //打开编辑角色对话框，并获取该角色数据
    async edit(role) {
      this.dialogFormVisible2 = true
      const res = await this.$http.get(`/roles/${role.id}`)
      const { data } = res.data
      this.editform = data
    },
    //删除角色
    remove(role) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`/roles/${role.id}`)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.fetchRole()
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          return
        })
    },
    //打开权限设置的对话框
    async control(role) {
      this.arrCheck = []
      this.currentId = role.id
      this.check(role.children)
      const res = await this.$http.get(`/rights/tree`)
      this.rightsTree = res.data.data
      this.dialogFormVisible3 = true
    },
    //添加角色
    async postRole() {
      const res = await this.$http.post(`roles`, this.addform)
      const {
        meta: { msg, status }
      } = res.data
      console.log(res.data)

      if (status === 201) {
        this.fetchRole()
        this.dialogFormVisible1 = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    //编辑角色
    async editRole(id) {
      const res = await this.$http.put(`roles/${id}`)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.fetchRole()
        this.dialogFormVisible2 = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    async changeRights() {
      const arr1 = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      arr1.push(...arr2)
      let str = arr1.join(',')
      const res = await this.$http.post(`roles/${this.currentId}/rights`, {
        rids: str
      })
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.fetchRole()
        this.dialogFormVisible3 = false
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    //获取checked的数组
    check(arr) {
      arr.forEach(item => {
        if (item.children) {
          this.arrCheck.push(item.id)
          this.check(item.children)
        } else {
          this.arrCheck.push(item.id)
        }
      })
    }
  },
  created() {
    this.fetchRole()
  }
}
</script>

<style scoped>
.card {
  padding: 10px 20px;
}
.addbtn {
  margin: 20px 0;
}
.tag {
  margin: 0 5px 5px 0;
}
</style>
