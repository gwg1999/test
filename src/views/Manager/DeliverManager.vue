<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 发货信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
      </div>
      <el-table
          :data="deliveries"
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
        <el-table-column align="center" label="产品名称" prop="productInfo.name"></el-table-column>
        <el-table-column align="center" label="发货数量" prop="number"></el-table-column>
        <el-table-column align="center" label="物流编号" prop="code"></el-table-column>
        <el-table-column align="center" label="所属订单" prop="order.agreement"></el-table-column>
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
  </div>
</template>

<script>
import {GetData} from "../../api";

export default {
  name: "DeliverManager",
  data(){
    return {
      query: {
        page: 1,
        page_size: 5
      },
      multipleSelection: [],
      pageTotal: 0,
      deliveries: [],
    }
  },
  created() {
    this.getData('/deliver?relations=productInfo,order&page_size='+this.query.page_size + '&page='+this.query.page)
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.deliveries = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    handlePageChange(val){
      this.query.pageIndex = val
      let url = '/deliver?relations=productInfo,order&'
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
  }
}
</script>

<style scoped>

</style>