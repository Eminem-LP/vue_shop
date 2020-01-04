<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_collapse" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" :default-active="activedPath"
        unique-opened router >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menus" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icon[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subMenu.path" v-for="subMenu in item.children" :key="subMenu.id" @click="saveNavState('/' + subMenu.path)">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subMenu.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from '../network/request'
export default {
  data () {
    return {
      menus: [],
      icon: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activedPath: ''
    }
  },
  created () {
    this.getMenus()
    this.activedPath = window.sessionStorage.getItem('activedPath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenus () {
      request({
        url: '/menus',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) return this.$router.push('/login')
        this.menus = res.data
      })
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activedPath) {
      window.sessionStorage.setItem('activedPath', activedPath)
      this.activedPath = activedPath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding-right: 5px;
}
.el-menu {
  border-right: none;
}
.toggle_collapse {
  background-color: #4A5064;
  text-align: center;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
