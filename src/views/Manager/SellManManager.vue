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
        <el-button type="primary" icon="el-icon-plus" @click="newSaleMan" style="margin-bottom: 10px;float: right">新增销售员</el-button>
      </div>
      <el-table
          :data="sellMan"
          class="table"
          border
          ref="customerTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column width="55" align="center">
          <template #default="scope">
            {{scope.$index + 1 + ((pageIndex-1)*pageSize)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="工号" prop="id"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="所属经理" prop="salesManager.name"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button icon="el-icon-edit" type="text" @click="modifySaleManager(scope.$index)">更改销售经理</el-button>
            <el-button type="text" @click="positionUp(scope.$index)">升迁</el-button>
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
    <el-dialog v-model="dialogVisible" title="新增销售员">
      <div class="container">
        <div class="form-box">
          <el-form ref="orderForm" :model="saleMan" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="姓名：">
                <el-input v-model="saleMan.name" style="width: 150px"></el-input>
              </el-form-item>
            </div>
            <div class="halfBlock">
              <el-form-item label="电子邮箱：">
                <el-input v-model="saleMan.email" style="width: 150px"></el-input>
              </el-form-item>
            </div>
            <div class="halfBlock">
              <el-form-item label="所属经理：">
                <el-select v-model="saleMan.salesManager">
                  <el-option v-for="manager in managers" :key="manager" :value="manager.id" :label="manager.name"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
              <el-button type="primary" @click="dialogVisible=false">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="modifyVisible" title="修改销售经理">
      <div class="container">
        <div class="form-box">
          <el-form ref="orderForm" :model="saleMan" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="所属经理：">
                <el-select v-model="modifyInfo.salesManager">
                  <el-option v-for="manager in managers" :key="manager" :value="manager.id" :label="manager.name"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="confirmModify">确定</el-button>
              <el-button type="primary" @click="modifyVisible=false">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {GetData, PostData} from "../../api";

export default {
  name: "SellManManager",
  data(){
    return {
      sellMan: [],
      query: {

      },
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      multipleSelection: [],
      saleMan: {
        name: null,
        email: null,
        salesManager: null,
      },
      dialogVisible: false,
      managers: [],
      modifyInfo: {
        salesManager: null,
        salesMan: null,
      },
      modifyVisible: false,
    }
  },
  created() {
    this.getData('/salesMan?relations=salesManager')
    GetData('/salesManager').then(res=>{
      this.managers = res.data.res
      console.log(this.managers)
    })
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.sellMan = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    handlePageChange(val){
      this.query.pageIndex = val
      this.getData()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    newSaleMan(){
      this.dialogVisible = true
    },
    onSubmit(){
      PostData('/salesMan', this.saleMan).then(res=>{
        this.getData('/salesMan?relations=salesManager')
        console.log(res)
        this.dialogVisible = false
      })
    },
    modifySaleManager(index){
      // console.log(this.sellMan[index])
      this.modifyVisible = true
      this.modifyInfo.salesManager = this.sellMan[index].salesManager.id
      this.modifyInfo.salesMan = this.sellMan[index].id
    },
    confirmModify(){
      PostData('/salesMan/alterSalesManager', this.modifyInfo).then(res=>{
        console.log(res)
        this.modifyVisible = false
        this.getData('/salesMan?relations=salesManager')
      })
    },
    positionUp(index){
      PostData('salesMan/'+this.sellMan[index].id+'/moveToSalesManager').then(()=>{
        this.getData('/salesMan?relations=salesManager')
      })
    },
  },
}
</script>

<style scoped>

</style>