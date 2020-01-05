<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <el-col :span="5" >
                <el-tag closable @close="deleteRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6" >
                    <el-tag type="success" closable @close="deleteRightsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="deleteRightsById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightsDialogVisible"
      width="30%"
      @close="handleClose">
      <el-tree ref="treeRef" :data="rightsTree" :props="defaultProps" show-checkbox default-expand-all :default-checked-keys="defaultKey" node-key="id"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data () {
    return {
      roleId: '',
      roleList: [],
      setRightsDialogVisible: false,
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultKey: []
    }
  },
  methods: {
    getRoleList () {
      request({
        url: '/roles',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('查询角色列表失败！')
        }
        this.roleList = res.data
      })
    },
    deleteRightsById (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `roles/${role.id}/rights/${rightId}`,
          method: 'delete'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功!')
          role.children = res.data
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleClose () {
      this.setRightsDialogVisible = false
      this.defaultKey = []
    },
    showSetRightDialog (role) {
      this.roleId = role.id
      request({
        url: 'rights/tree',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败！')
        }
        this.setRightsDialogVisible = true
        this.rightsTree = res.data
        this.getLeafKeys(role, this.defaultKey)
      })
    },
    getLeafKeys (role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    allotRights () {
      const ids = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      const idStr = ids.join(',')
      request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: { rids: idStr }
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        this.getRoleList()
      })
      this.setRightsDialogVisible = false
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
