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
        <el-button style="float: right;margin-bottom: 10px" type="primary" icon="el-icon-plus" @click="newProduct">新增</el-button>
      </div>
      <el-table
          :data="products"
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
        <el-table-column align="center" label="产品名称" prop="name"></el-table-column>
        <el-table-column align="center" label="产品编号" prop="number"></el-table-column>
        <el-table-column align="center" label="所属部门" prop="department"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createdAt"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="text" icon="el-icon-search" @click="showDetail(scope.$index)">查看详情</el-button>
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
    <el-dialog v-model="newProductVisible" title="产品新增">
      <div class="container">
        <div class="form-box">
          <el-form ref="form" label-position="left" label-width="120px" :rules="rules" :model="productInfo">
            <el-form-item label="产品名称：" prop="name">
              <el-input v-model="productInfo.name" class="handle-input"></el-input>
            </el-form-item>
            <el-form-item label="产品简称：" prop="nickName">
              <el-input v-model="productInfo.nickName" class="handle-input"></el-input>
            </el-form-item>
            <el-form-item label="产品介绍：" prop="intro">
              <el-input v-model="productInfo.intro" class="handle-input"></el-input>
            </el-form-item>
            <el-form-item label="产品编号：" prop="number">
              <el-input v-model="productInfo.number" class="handle-input"></el-input>
            </el-form-item>
            <el-form-item label="所属部门：" prop="department">
              <el-input v-model="productInfo.department" class="handle-input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="detailVisible" title="产品新增">
      <div class="container">
        <div class="form-box">
          <el-form ref="form" label-position="left" label-width="120px" :model="form">
            <el-form-item label="产品名称：" prop="name">
              <p>{{form.name}}</p>
            </el-form-item>
            <el-form-item label="产品简称：" prop="nickName">
              <p>{{form.nickName}}</p>
            </el-form-item>
            <el-form-item label="产品介绍：" prop="intro">
              <p>{{form.intro}}</p>
            </el-form-item>
            <el-form-item label="产品编号：" prop="number">
              <p>{{form.number}}</p>
            </el-form-item>
            <el-form-item label="所属部门：" prop="department">
              <p>{{form.department}}</p>
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
  name: "ProductManager",
  data(){
    return {
      products: [],
      pageTotal: 0,
      query: {
      },
      pageIndex: 1,
      pageSize: 10,
      multipleSelection: [],
      newProductVisible: false,
      detailVisible: false,
      productInfo: {
        name: null,
        number: null,
        nickName: null,
        intro: null,
        department: null,
      },
      form: {},
      rules: {
        name: [
          {required:true,message: '请输入产品名称', trigger: 'blur'}
        ],
        intro: [
          {required:true, message: '请输入产品介绍', trigger: 'blur'}
        ],
        nickName: [
          {required:true, message: '请输入产品简称', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入产品编号', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '请输入所属部门', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    this.getData('/productInfo')
  },
  methods: {
    getData(url){
      GetData(url).then(res=>{
        this.products = res.data.res
        this.pageTotal = res.data.count
        for(let i in this.products){
          this.products[i].createdAt = this.products[i].createdAt.substr(0,10)
        }
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
    newProduct(){
      this.newProductVisible = true
    },
    onSubmit(){
      this.$refs.form.validate(valid=>{
        if(valid){
          PostData('/product',this.productInfo).then(res=>{
            this.getData('/productInfo')
            console.log(res)
          })
        }else{
          this.$message.error('信息未完善')
        }
      })
      this.newProductVisible = false
    },
    showDetail(index){
      this.form = this.products[index]
      this.detailVisible = true
    },
  }
}
</script>

<style scoped>
.handle-input{
  width: 200px;
}
</style>