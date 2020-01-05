<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据列表区 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <zk-table :data="cateList" :columns="columns" show-index index-text="#" :expand-type="false" :selection-type="false" border>
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot-scope="scope" slot="order">
          <el-tag  size="mini" v-if="scope.row.cat_level === 0">等级一</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">等级二</el-tag>
          <el-tag type="warning" size="mini" v-else>等级三</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="setAddCateClosed">
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cateProps"
            @change="handleParentCateChange" clearable change-on-select expand-trigger="hover"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
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
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      queryParam: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  methods: {
    getCateList () {
      request({
        url: '/categories',
        method: 'get',
        params: this.queryParam
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类列表失败！')
        }
        this.cateList = res.data.result
        this.total = res.data.total
      })
    },
    handleSizeChange (newSize) {
      this.queryParam.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newNum) {
      this.queryParam.pagenum = newNum
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCate () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        console.log(this.addCateForm)
        request({
          url: '/categories',
          method: 'post',
          data: this.addCateForm
        }).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    getParentCateList () {
      request({
        url: '/categories',
        method: 'get',
        params: { type: 2 }
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询父级分类失败！')
        }
        this.parentCateList = res.data
      })
    },
    handleParentCateChange () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    setAddCateClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin: 15px 0 15px;
}
.el-cascader {
  width: 100%;
}
</style>
