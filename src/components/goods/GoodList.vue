<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8"><el-input placeholder="请输入内容" v-model="queryParam.query" clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="queryGoodsByKeyword"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据展示区 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="70px"></el-table-column>
        <el-table-column prop="goods_number" label="数量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteByGoodsId(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryParam.pagenum" :page-sizes="[10, 20, 50]" :page-size="queryParam.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total" background >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data () {
    return {
      queryParam: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    getGoodsList () {
      request({
        url: 'goods',
        method: 'get',
        params: this.queryParam
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询商品列表失败！')
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    queryGoodsByKeyword () {
      this.getGoodsList()
    },
    deleteByGoodsId (goodsId) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `goods/${goodsId}`,
          method: 'delete'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败！')
          }
          this.$message.success('删除商品成功！')
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (newPageSize) {
      this.queryParam.pagesize = newPageSize
      this.getGoodsList()
    },
    handleCurrentChange (newPageNum) {
      this.queryParam.pagenum = newPageNum
      this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style>

</style>
