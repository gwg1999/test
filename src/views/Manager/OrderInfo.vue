<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单详细信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <div class="form-box" style="width: 100%;display: inline-block">
          <el-form label-position="left" label-width="120px" ref="form">
            <div>
              <div style="width: 30%;display: inline-block">
                <el-form-item label="订单名：">
                  <p>{{order.agreement}}</p>
                </el-form-item>
              </div>
              <div style="width: 30%;display: inline-block">
                <el-form-item label="发货状态：">
                  <p>{{order.deliverStatus}}</p>
                </el-form-item>
              </div>
              <div style="width: 30%;display: inline-block">
                <el-form-item label="付款状态：">
                  <p>{{order.payStatus}}</p>
                </el-form-item>
              </div>
            </div>
            <div>
              <div style="width: 30%;display: inline-block">
                <el-form-item label="总价格(￥)：">
                  <p>{{order.price}}</p>
                </el-form-item>
              </div>
              <div style="width: 30%;display: inline-block">
                <el-form-item label="支付时间：">
                  <p>{{order.createdAt}}</p>
                </el-form-item>
              </div>
              <div style="width: 30%;display: inline-block;margin-left: 50px">
                <el-button type="primary" @click="deliver">发货</el-button>
                <el-button type="primary" @click="turnBack">返回</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <el-table
          :data="orderItems"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column label="" width="55" align="center">
          <template #default="scope">
            {{scope.$index+1 + ((pageNum-1) * pageSize)}}
          </template>
        </el-table-column>
        <el-table-column prop="productInfo.name" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="number" label="购买数量" align="center"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="发货">
      <div class="container">
        <div class="form-box">
          <el-form ref="orderForm" :model="form" label-width="120px">
            <div class="halfBlock">
              <el-form-item label="选择发货状态：">
                <el-select v-model="form.status">
                  <el-option value="未发货" label="未发货" key="1"></el-option>
                  <el-option value="部分发货" label="部分发货" key="2"></el-option>
                  <el-option value="已发货" label="已发货" key="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="confirm">确定</el-button>
              <el-button type="primary" @click="dialogVisible=false">返回</el-button>
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
  name: "OrderInfo",
  data(){
    return {
      order: {},
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      orderItems: [],
      form: {
        status: null,
      },
      dialogVisible: false,
    }
  },
  created() {
    this.order = JSON.parse(localStorage.getItem('order'))
    this.form.status = this.order.deliverStatus
    this.getData('/orderItem?relations=productInfo,order&&order='+ this.order.id)
    // this.getData('/orderItem')
  },
  computed: {
    tagsList() {
      return this.$store.state.tagsList;
    },
  },
  methods: {
    handlePageChange(val){
      this.pageNum = val
    },
    getData(url){
      GetData(url).then((res)=>{
        this.orderItems = res.data.res
        this.pageTotal = res.data.count
        console.log(res)
      })
    },
    turnBack(){
      let index=0
      let delItem = undefined
      for(let i in this.tagsList){
        if (this.tagsList[i].path===this.$route.fullPath){
          delItem = this.tagsList[i]
          index = i
        }
      }
      this.$store.commit("delTagsItem", { index });
      const item = this.tagsList[index]
          ? this.tagsList[index]
          : this.tagsList[index - 1];
      if (item) {
        delItem.path === this.$route.fullPath &&
        this.$router.push(item.path);
      } else {
        this.$router.push("/manager/orderManager");
      }
      localStorage.removeItem('order')
    },
    deliver(){
      this.dialogVisible = true
    },
    confirm(){
      if(this.form.status==='部分发货'){
        PostData('order/'+this.order.id + '/toSome').then(res=>{
          this.turnBack()
          console.log(res)
        })
      }else if(this.form.status==='已发货'){
        PostData('order/'+this.order.id + '/toAll').then(res=>{
          this.turnBack()
          console.log(res)
        })
      }
      this.dialogVisible = false
    },
  }
}
</script>

<style scoped>

</style>