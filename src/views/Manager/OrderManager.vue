<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 订单信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box" style="margin-bottom: 10px">
        <span style="margin-right: 10px;margin-bottom: 10px">发货状态：
          <el-select v-model="query.deliverStatus" style="width: 150px;" @change="search">
            <el-option value="全部" label="全部" key="0"></el-option>
            <el-option value="未发货" label="未发货" key="4"></el-option>
            <el-option value="部分发货" label="部分发货" key="1"></el-option>
            <el-option value="全部发货" label="全部发货" key="2"></el-option>
          </el-select>
        </span>
        <span style="margin-right: 10px;margin-bottom: 10px">发货状态：
          <el-select v-model="query.payStatus" style="width: 150px;" @change="search">
            <el-option value="全部" label="全部" key="0"></el-option>
            <el-option value="未支付" label="未支付" key="4"></el-option>
            <el-option value="已支付" label="已支付" key="1"></el-option>
          </el-select>
        </span>
        <el-button icon="el-icon-search" type="primary">搜索</el-button>
        <el-button icon="el-icon-plus" type="primary" style="float: right">新增</el-button>
      </div>
      <el-table
          :data="orders"
          class="table"
          border
          ref="saleManagerTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column width="55" align="center">
          <template #default="scope">
            {{scope.$index + 1 + ((query.page-1)*query.page_size)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同编号" prop="agreement"></el-table-column>
        <el-table-column align="center" label="总价" prop="price"></el-table-column>
        <el-table-column align="center" label="付款状态" prop="payStatus"></el-table-column>
        <el-table-column align="center" label="发货情况" prop="deliverStatus"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="scope">
            <el-button type="text" icon="el-icon-search" @click="showDetail(scope.$index)">查看详情</el-button>
            <el-button type="text" icon="el-icon-edit" @click="modify(scope.$index)">修改信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.page_size"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="订单信息">
      <div class="container">
        <div class="form-box">
          <el-form ref="orderForm" :model="form" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="订单编号：">
                {{form.agreement}}
              </el-form-item>
            </div>
            <div class="halfBlock">
              <el-form-item label="付款状态：">
                {{form.payStatus===0?'未付款':'已付款'}}
              </el-form-item>
            </div>
            <div class="halfBlock">
              <el-form-item label="发货状态">

              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary">确定</el-button>
              <el-button type="primary" @click="dialogVisible=false">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {GetData} from "../../api";

export default {
  name: "OrderManager",
  data(){
    return{
      query: {
        deliverStatus: '全部',
        payStatus: '全部',
        page: 1,
        page_size: 5,
      },
      multipleSelection: [],
      pageTotal: 0,
      orders: [],
      dialogVisible: false,
      form: {},
    }
  },
  created() {
    this.getData('/order?page=' + this.query.page + '&page_size=' + this.query.page_size)
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.orders = res.data.res
        this.pageTotal = res.data.count
        for(let i in this.orders){
          this.orders[i].createdAt = this.orders[i].createdAt.substr(0, 10)
        }
        console.log(res)
      })
    },
    search(){
      let url = '/order?'
      for(let i in this.query){
        if(this.query[i]!==null && this.query[i]!=='全部'){
          url += i + '=' + this.query[i] + '&'
        }
      }
      this.getData(url)
    },
    handlePageChange(val){
      this.query.page = val
      let url = '/order?'
      for(let i in this.query){
        if(this.query[i]!==null && this.query[i]!=='全部'){
          url += i + '=' + this.query[i] + '&'
        }
      }
      this.getData(url)
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    showDetail(index){
      localStorage.setItem('order',JSON.stringify(this.orders[index]))
      this.$router.push('/manager/orderInfo')
    },
    modify(index){
      this.form = this.orders[index]
      this.dialogVisible = true
    },
  }
}
</script>

<style scoped>
.halfBlock{
  width: 50%;
  display: inline-block;
}
</style>