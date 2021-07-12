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
      <div class="handle-box" style="margin-bottom: 10px">
        <span style="margin-right: 10px">状态：
          <el-select v-model="query.status" style="width: 150px;" @change="search">
            <el-option value="全部" label="全部" key="0"></el-option>
            <el-option value="未认领" label="未认领" key="0"></el-option>
            <el-option value="未完成" label="未完成" key="1"></el-option>
            <el-option value="已完成" label="已完成" key="2"></el-option>
            <el-option value="已过期" label="已过期" key="3"></el-option>
          </el-select>
        </span>
        <el-button icon="el-icon-search" type="primary">搜索</el-button>
      </div>
      <el-table
          :data="visits"
          class="table"
          border
          ref="saleManagerTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column width="55" align="center">
          <template #default="scope">
            {{scope.$index + 1 + ((pageIndex-1)*pageSize)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="企业名称" prop="customerInfo.name"></el-table-column>
        <el-table-column align="center" label="计划开始日期" prop="startDate"></el-table-column>
        <el-table-column align="center" label="计划结束日期" prop="endDate"></el-table-column>
        <el-table-column align="center" label="状态" prop="status"></el-table-column>
        <el-table-column align="center" label="联系人姓名" prop="contact"></el-table-column>
        <el-table-column align="center" label="联系人电话" prop="contactPhone"></el-table-column>
        <el-table-column align="center" label="预估费用" prop="money"></el-table-column>
        <el-table-column align="center" label="接受销售员">
          <template #default="scope">
            <span v-if="scope.row.salesMan===null">无</span>
            <span v-else>{{scope.row.salesMan.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="pageIndex"
            :page-size="pageSize"
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
  name: "VisitManager",
  data(){
    return {
      query: {
        status: '全部',
      },
      pageIndex: 1,
      pageSize: 10,
      multipleSelection: [],
      pageTotal: 0,
      visits: [],
    }
  },
  created() {
    this.getData('/visit?relations=customerInfo,salesMan')
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.visits = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    handlePageChange(val){
      this.pageIndex = val
      this.getData('/visit?relations=customerInfo,salesMan&page='+this.pageIndex+'&page_size=10')
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    search(){
      let url = '/visit?relations=customerInfo,salesMan'
      for(let i in this.query){
        if(this.query[i]!==null && this.query[i]!=='全部'){
          url += '&&' + i + '=' + this.query[i]
        }
      }
      this.getData(url)
    },
  }
}
</script>

<style scoped>

</style>