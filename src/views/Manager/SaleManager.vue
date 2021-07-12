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
        <el-button
            type="primary"
            icon="el-icon-plus"
            @click="newSaleManager"
            style="margin-bottom: 10px;float: right"
        >新增销售员</el-button>
      </div>
      <el-table
          :data="saleManager"
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
        <el-table-column align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="工号" prop="id"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="toSaleMan(scope.$index)">左迁</el-button>
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
          <el-form ref="orderForm" :model="newInfo" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="姓名：">
                <el-input v-model="newInfo.name" style="width: 150px"></el-input>
              </el-form-item>
            </div>
            <div class="halfBlock">
              <el-form-item label="电子邮箱：">
                <el-input v-model="newInfo.email" style="width: 150px"></el-input>
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
    <el-dialog v-model="modifyVisible" title="更改后所属销售经理">
      <div class="container">
        <div class="form-box">
          <el-form ref="orderForm" :model="newInfo" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="所属销售经理：">
                <el-select v-model="saleInfo.id">
                  <el-option v-for="item in saleManager" :key="item" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="confirm">确定</el-button>
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
  name: "SaleManager",
  data(){
    return {
      query: {

      },
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      saleManager: [],
      multipleSelection: [],
      newInfo: {
        name: null,
        email: null,
      },
      dialogVisible: false,
      modifyVisible: false,
      saleId: null,
      saleInfo: {
        id: null,
      },
    }
  },
  created() {
    this.getData('/salesManager')
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.saleManager = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handlePageChange(val){
      this.query.pageIndex = val
      this.getData('/salesManager/pageIndex='+this.query.pageIndex)
    },
    newSaleManager(){
      this.dialogVisible = true
    },
    onSubmit(){
      PostData('/salesManager', this.newInfo).then(res=>{
        this.getData('/salesManager')
        console.log(res)
        this.dialogVisible = false
      })
    },
    toSaleMan(index){
      this.modifyVisible = true
      this.saleId = this.saleManager[index].id
    },
    confirm(){
      PostData('/salesManager/'+this.saleId+'/moveToSalesMan',{belongsManager: this.saleInfo.id}).then(res=>{
        if(res.success==='true'){
          this.getData('/salesManager')
          this.$message('修改成功')
        }
      }).catch(()=>{})
    },
  }
}
</script>

<style scoped>

</style>