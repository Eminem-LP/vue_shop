<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon  title="注意：只允许为第三级分类设置参数！！！" type="warning" :closable="false"></el-alert>
      <el-row class="goods_cat">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="cateList" :props="cateProps" @change="handleCategoryChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">动态参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleTagClosed(scope.row, index)" closable>{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttrById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">静态属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" @close="handleTagClosed(scope.row, index)" closable>{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttrById(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttribute">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data () {
    return {
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        childre: 'childre'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCateList () {
      request({
        url: '/categories',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类列表失败！')
        }
        this.cateList = res.data
      })
    },
    handleCategoryChange () {
      this.getParamList()
    },
    handleTabChange () {
      this.getParamList()
    },
    getParamList () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      request({
        url: `categories/${this.cateId}/attributes`,
        method: 'get',
        params: { sel: this.activeName }
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addAttribute () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        request({
          url: `categories/${this.cateId}/attributes`,
          method: 'post',
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        }).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数属性失败！')
          }
          this.$message.success('添加参数属性成功！')
          this.addDialogVisible = false
          this.getParamList()
        })
      })
    },
    showEditDialog (id) {
      request({
        url: `categories/${this.cateId}/attributes/${id}`,
        method: 'get',
        params: { attr_sel: this.activeName }
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败！')
        }
        this.editForm = res.data
      })
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editAttribute () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        request({
          url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          method: 'put',
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改属性参数失败！')
          }
          this.$message.success('修改属性参数成功！')
          this.editDialogVisible = false
          this.getParamList()
        })
      })
    },
    removeAttrById (attrId) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `categories/${this.cateId}/attributes/${attrId}`,
          method: 'delete'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除属性失败！')
          }
          this.$message.success('删除属性成功！')
          this.getParamList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttr(row)
    },
    saveAttr (row) {
      request({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数属性失败！')
        }
        this.$message.success('修改参数属性成功！')
      })
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleTagClosed (row, index) {
      row.attr_vals.splice(index, 1)
      this.saveAttr(row)
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.goods_cat {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
