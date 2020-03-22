<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <el-row type="flex" align="middle">
          <el-col :span="8">
            <img src="" alt="" />
          </el-col>
          <el-col :span="8">
            <h3 class="title">电商管理系统</h3>
          </el-col>
          <el-col class="back" :span="8">
            <a href="" @click.prevent="back">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside class="aside" :width="isCollapse ? '65px' : '200px'">
          <div class="open" @click="change">
            <i class="iconfont icon-zhankai"></i>
          </div>
          <el-menu
            mode="vertical"
            router
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <el-submenu
              v-for="(submenus, index) in menus"
              :key="index"
              :index="submenus.path"
            >
              <template slot="title">
                <i class="iconfont" :class="icons[submenus.path]"></i>
                <span slot="title">{{ submenus.authName }}</span>
              </template>
              <el-menu-item
                v-for="(item, subIndex) in submenus.children"
                :index="'/' + item.path"
                :key="subIndex"
              >
                <span slot="title">{{ item.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view :key="$route.path"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menus: [],
      icons: {
        users: 'icon-yonghu',
        rights: 'icon-quanxian',
        goods: 'icon-shangpingouwudai2',
        orders: 'icon-dingdan',
        reports: 'icon-icon-'
      },
      isCollapse: false,
      asideWidth: '200px'
    }
  },
  methods: {
    change() {
      this.isCollapse = !this.isCollapse
    },
    back() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async fetchMenus() {
      const res = await this.$http.get('/menus')
      this.menus = res.data.data
    }
  },
  created() {
    this.fetchMenus()
  }
}
</script>

<style scoped>
.home {
  height: 100%;
  width: 100%;
}
.header {
  background-color: #bbeedd;
}
.open {
  text-align: center;
  padding: 5px 0;
  background-color: #bbb;
  cursor: pointer;
}
.back {
  text-align: right;
}
.title {
  text-align: center;
}
</style>
