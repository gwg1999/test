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
<!--        <p style="margin-right: 10px ;display: inline-block">拜访日期:-->
<!--          <el-date-picker-->
<!--              v-model="date"-->
<!--              type="daterange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              @change="search"-->
<!--          ></el-date-picker>-->
<!--        </p>-->
        <el-button type="primary" icon="el-icon-search">搜索</el-button>

      </div>
      <el-table
          :data="visitRecords"
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
        <el-table-column align="center" label="拜访日期" prop="date"></el-table-column>
        <el-table-column align="center" label="拜访地点" prop="location"></el-table-column>
        <el-table-column align="center" label="拜访主题" prop="theme"></el-table-column>
        <el-table-column align="center" label="耗时(h)">
          <template #default="scope">
            {{scope.row.time * 0.5}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="签到图片">
          <template #default="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
                v-if="scope.row.image!==null"
            ></el-image>
            <span v-if="scope.row.image===null">无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签到GPS">
          <template #default="scope">
            {{scope.row.gps===null?'无':scope.row.gps}}
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
  name: "VisitRecordManager",
  data(){
    return {
      query: {
        startDate : null,
        endDate: null,
      },
      pageIndex: 1,
      pageSize: 10,
      date: null,
      multipleSelection: [],
      pageTotal: 0,
      visitRecords: [],
    }
  },
  created() {
    this.getData('/visitRecord')
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.visitRecords = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    fmt(date, format){
      format = format.toLowerCase()
      if(format==='day'){
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }else if(format==='month'){
        return date.getFullYear() + '-' + (date.getMonth() + 1)
      }else if(format==='year'){
        return date.getFullYear()
      }else{
        return 'error'
      }
    },
    search(){
      if(this.date!==null){
        this.query.startDate = this.fmt(this.date[0], 'day')
        this.query.endDate = this.fmt(this.date[1], 'day')
      }
      let url = '/visitRecord?'
      for(let i in this.query){
        if(this.query[i]!==null && this.query[i]!=='全部'){
          url += i + '=' + this.query[i] + '&&'
        }
      }
      this.getData(url)
    },
    handlePageChange(val){
      this.query.pageIndex = val
      this.getData()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
  }
}
</script>

<style scoped>

</style>