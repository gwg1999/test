<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 客户信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
      </div>
      <el-table
          :data="customer"
          class="table"
          border
          ref="customerTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column width="55" align="center">
          <template #default="scope">
            {{scope.$index + 1 + ((query.page-1)*query.page_size)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="企业名称" prop="name"></el-table-column>
        <el-table-column align="center" label="企业电话" prop="companyPhone"></el-table-column>
        <el-table-column align="center" label="负责人姓名" prop="leader"></el-table-column>
        <el-table-column align="center" label="联系人姓名" prop="contact"></el-table-column>
        <el-table-column align="center" label="联系人电话" prop="contactPhone"></el-table-column>
        <el-table-column align="center" label="联系人微信" prop="weChat"></el-table-column>
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
  name: "CustomerInfo",
  data(){
    return {
      query: {
        page: 1,
        page_size: 5,
      },
      customer: [],
      multipleSelection: [],
      pageTotal: 0,
    }
  },
  created() {
    this.getData('/customerInfo?page_size='+this.query.page_size+'&page='+this.query.page)
  },
  methods: {
    getData(url){
      GetData(url).then((res)=>{
        this.customer = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handlePageChange(val){
      this.query.page = val
      let url = '/customerInfo?'
      for(let i in this.query){
        url+= i + '=' + this.query[i] +'&'
      }
      this.getData(url)
    },
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
</style>