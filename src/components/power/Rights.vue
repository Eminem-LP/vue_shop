<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">等级一</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success">等级二</el-tag>
            <el-tag v-else type="warning">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    getRightsList () {
      request({
        url: 'rights/list',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询权限列表失败！')
        }
        this.rightsList = res.data
      })
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style>

</style>
