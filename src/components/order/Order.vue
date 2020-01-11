<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入关键字">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发贷" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModifyAddress"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressbox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum" :page-sizes="[5, 10, 20, 50]"
        :page-size="queryParam.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="handleDialogClosed">
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="addrProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="显示物流信息" :visible.sync="progressVisible" width="50%">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in progressList" :key="index" :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'
import cityData from './citydata'
export default {
  data () {
    return {
      queryParam: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addrProps: {
        expandTrigger: 'hover'
      },
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      addressVisible: false,
      progressVisible: false,
      progressList: []
    }
  },
  methods: {
    getOrderList () {
      request({
        url: '/orders',
        method: 'get',
        params: this.queryParam
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange (newPageSize) {
      this.queryParam.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange (newPageNum) {
      this.queryParam.pagenum = newPageNum
      this.getOrderList()
    },
    showModifyAddress () {
      this.addressVisible = true
    },
    handleDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressbox () {
      this.progressVisible = true
      request({
        url: '/kuaidi/1106975712662',
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询物流信息失败！')
        }
        this.progressList = res.data
      })
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
