<template>
    <div class="staff-library">
        <panel class="staff-content">
            <template slot="head">
                <div class="left flex">
					<el-select v-model="queryParams.storeId" size="mini"clearable placeholder="全部销售分组" @change="storeIdChange" style="width:130px">
					     <el-option
					         v-for="item in storeList"
					         :key="item.id"
					         :label="item.name"
					         :value="item.id">
					     </el-option>
					 </el-select>
                    <el-select v-model="queryParams.sortType" size="mini" placeholder="选择排序" @change="sortTypeChange" style="max-width:180px; margin-left:15px;">
                        <el-option
                            v-for="item in sortList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input placeholder="输入顾问名称、手机" v-model="queryParams.keyVal" style="width:210px; margin:0 15px;" size="mini" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                    </el-input>
                    <div>
                        <!-- <el-checkbox v-model="queryParams.waitaudit" @change="getData">只看待审核顾问</el-checkbox> -->
						<el-select v-model="queryParams.waitaudit" size="mini" clearable placeholder="全部状态" @change="getData" style="width:120px">
						     <el-option
						         v-for="item in statusList"
						         :key="item.value"
						         :label="item.label"
						         :value="item.value">
						     </el-option>
						 </el-select>
                    </div>
                </div>
                <div class="right">
                    <a :href="downloadWxExcel" download v-if="isBtnPower('05020106')"><el-button type="warning" size="mini">下载网销线索模板</el-button></a>
                    <a :href="downloadWtExcel" download v-if="isBtnPower('05020107')"><el-button type="warning" size="mini">下载外拓线索模板</el-button></a>
                </div>
            </template>
            <div class="staff-adviser__content">
                <el-table :data="adviserList" style="width: 100%" fit v-loading="loading" :height="sideHeight">
					
                    <el-table-column label="顾问信息"  align='center' min-width="200">
                        <template slot-scope="scope">
                            <div class="flex align-items-center" style="justify-content: center;">
                                <img :src="setImgPath(scope.row.headPic)" width="30" height="30" class="radius" /> 
								<div class="ml5">
									<div v-if="scope.row.name&&!scope.row.nickName">{{scope.row.name}}</div>
									<div v-if="!scope.row.name&&scope.row.nickName">{{scope.row.nickName}}</div>
									<div v-if="scope.row.name&&scope.row.nickName">{{scope.row.name}} | {{scope.row.nickName}}</div>
									<div>{{scope.row.mobile}}</div>
								</div>
                                
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="storeName" label="所属销售分组" min-width="120" align="center" />
					 <el-table-column label="审核状态" align='center'>
					    <template slot-scope="scope" >
					       <el-tag :type="scope.row.status | getAdvTagStatus" size="small">{{scope.row.status | getAdvStatus}}</el-tag>
					   </template>
					</el-table-column>
                    <el-table-column label="开通时间" width="120" align="center">
                        <template slot-scope="scope">
                            {{scope.row.dayTime}}<br>
                            {{scope.row.hourTime}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="mobile" label="手机号" width="120" align="center" /> -->
                    <el-table-column prop="customerNun" label="客户量" align="center" />
                    <el-table-column prop="reliableNum" label="靠谱数" align="center" />
                    <el-table-column prop="pushHandNum" label="推手量" align="center" />
                   <!-- <el-table-column label="状态" width="120" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.status | getAdvTagStatus" size="small">{{scope.row.status | getAdvStatus}}</el-tag>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width="250">
                        <template slot-scope="scope">
                            <div class="operate">
                                <span v-if="isBtnPower('05020104') && scope.row.status == 0" @click="checkAccount(scope.row)">审核账号开通</span>
                                <span v-else-if="scope.row.status == 3" style="cursor:default;">审核不通过</span>
                                <template v-else>
                                    <span @click="setStatus(scope.row)" v-if="isBtnPower('05020102')&&scope.row.status == 1" >{{scope.row.status | getStatus}}</span>
                                    <span v-if="isBtnPower('05020106')">
                                        <upload-excel
                                            :action="getUploadPath('/sellerstaff/doWxExcel',scope.row.id)"
                                        >
                                            导入网销线索
                                        </upload-excel>
                                    </span>
                                    <span v-if="isBtnPower('05020107')">
                                        <upload-excel
                                            :action="getUploadPath('/sellerstaff/doWtExcel',scope.row.id)"
                                        >
                                            导入外拓线索
                                        </upload-excel>
                                    </span>
                                    <span v-if="isBtnPower('05020104')">登录日志</span>
                                    <span v-if="isBtnPower('05020109')&&scope.row.status != 2" @click="moveClient(scope.row)">转移客户</span>
                                    <span v-if="isBtnPower('05020105')" @click="toPushHandList(scope.row)">推手</span>
                                    <span v-if="isBtnPower('080101')" @click="toCustomer(scope.row)">客户</span>
									<span v-if="isBtnPower('05020114')" @click="toOrderData(scope.row,'testDrive')">试驾单</span>
									<span v-if="isBtnPower('05020115')" @click="toOrderData(scope.row,'selectCar')">选车单</span>
                                    <!-- <span v-if="isBtnPower('080101')">订单</span> -->
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-content-end mt15">
                    <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
                </div>
				<el-dialog
				  title="提示"
				  :visible.sync="showMoveClient"
				  width="350px"
				  >
				  
				  <span>您确认将【{{clientInfo.storeName}}「{{clientInfo.name}}」】顾问的{{clientInfo.customerNun}}位客户档案（含推手与推手下线）全部转移给以下你选定的顾问吗？</span>
				  <div class="flex">
					<el-select v-model="clientInfo.storeId" size="mini" clearable placeholder="全部销售分组" @change="getAdviserArr" style="width:130px">
					     <el-option
					         v-for="item in saleList"
					         :key="item.id"
					         :label="item.name"
					         :value="item.id">
					     </el-option>
					 </el-select>
					<el-select v-model="adviserId" size="mini" clearable placeholder="全部顾问"  style="width:120px;margin-left:15px;">
					     <el-option
					         v-for="item in ClientAdviser"
					         :key="item.id"
					         :label="item.name"
					         :value="item.id">
					     </el-option>
					 </el-select>
					  
				  </div>
				  <span slot="footer" class="dialog-footer">
					<el-button @click="showMoveClient = false">取 消</el-button>
					<el-button type="primary" @click="suerTransfer">确 定</el-button>
				  </span>
				</el-dialog>
            </div>
        </panel>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import Sticky from '@/components/Sticky'
import UploadExcel from '@/components/UploadExcel'
import power from '@/mixins/power'
import wtExcel from '@/assets/excel/外拓数据导入.xlsx'
import wxExcel from '@/assets/excel/网销数据导入.xlsx'

import {setImgPath, queryParams} from '@/utils'

import {getStoreList} from '@/api/common'
import {getAdviserList, setAdviserStatus, delAdviser, auditAdviser,adviserList,transferCustomer} from '@/api/staff'
import {queryCustomerCount} from '@/api/customer'

export default {
    components: {Panel, Sticky, UploadExcel},
    mixins: [power],
	computed:{
			sideHeight(){
	// 			console.log(111)
	// 			console.log(this.$store.state.getContentSize)
					return this.$store.state.getContentSize -190
			}
			},
    data() {
        return {
			showMoveClient:false,
			adviserId:'',
			clientInfo:{
				storeId:'0',
				adviserId:'',
			},
			saleList:[],
			ClientAdviser:[],
            storeList: [
				 {
				    value: 1,
				    name: '全部销售分组'
				}, 
			],
			statusList:[
				 {
				    value: 0,
				    label: '待审核'
				}, 
				 {
				    value: 1,
				    label: '已通过'
				}, 
				 {
				    value: 2,
				    label: '已停用'
				}, 
				 {
				    value: 3,
				    label: '未通过'
				}, 
			],
            sortList: [
                {
                    value: 1,
                    label: '按客户量排序'
                }, 
                {
                    value: 2,
                    label: '按最新注册时间排序'
                }, 
                {
                    value: 4,
                    label: '按靠谱数'
                },
				{
				    value: 3,
				    label: '按推手量'
				},
				{
				    value: 5,
				    label: '成交量'
				}
            ],

            loading: false,
            adviserList: [],
            total: 0,
            queryParams: {
                storeId: '',
                sortType: 2,
                keyVal: '',
                waitaudit: '', // 是否看待审核：1-是；0-不是
                pageSize: 10,
                curPage: 1
            },
            setImgPath: setImgPath,
            downloadWtExcel: wtExcel,
            downloadWxExcel: wxExcel
        }
    },
    async created() {
       
        
        try {
            await this.getPower('05020102,05020103,05020104,05020106,05020107,05020105,080101,05020109,05020114,05020115')
			 this.$loading.show()
            const {storeId} = this.$route.query
            const urlParams = queryParams()
			this.loading = true
            const stores = await getStoreList()
			
            // 筛选已启用的门店
            this.storeList = stores

            // 找到对应的门店 istop防止参数互串
            if(!urlParams.istop && storeId && stores.find(v => v.id == storeId)){
                this.queryParams.storeId = storeId
            }
            this.getData()
			 this.$loading.hide()
        } catch (error) {
            console.error(error)
        }

       
    },
    methods: {
		async storesArr(){
			 const stores = await getStoreList()
			// 筛选已启用的门店
			this.saleList = stores;
		},
		async getAdviserArr(value){
			console.log(value)
			console.log(this.clientInfo)
			this.adviserId = ''
			let info = await adviserList({sellerStoreId:value})
			const _index =  info.findIndex(item =>item.id == this.clientInfo.id)
			console.log(_index)
			if(_index != -1){
				info.splice(_index,1)
			}
			this.ClientAdviser = info;
		},
		storeIdChange(){
			this.queryParams.curPage = 1;
			this.getData()
		},
		sortTypeChange(){
			this.queryParams.curPage = 1;
			this.getData()
		},
		statusChange(e){
			this.queryParams.curPage = 1;
			this.getData()
		},
        async getData() {
			 this.loading = true
            try {
                const params = {...this.queryParams}
                // params.waitaudit = params.waitaudit ? 1 : 0
				console.log(params)
                this.loading = true
                const res = await getAdviserList(params)
                this.adviserList = res.items
                this.total = res.total
            } catch (error) {
                console.error(error)
            }
            this.loading = false
        },
		async suerTransfer(){
			if(this.adviserId == this.clientInfo.id){
				return this.$message.warning('请选择非己的顾问')
			}
			if(this.adviserId){
				try{
					this.$loading.show('请稍后...')
					let send = {
						transferAdviserId:this.adviserId,
						adviserId:this.clientInfo.id
					}
					let res = await transferCustomer(send)
					console.log(res)
					this.$message.success(res)
					this.getData()
					this.showMoveClient  = false;
					
					this.$loading.hide()
				}catch(e){
					
					this.$loading.hide()
				}
				
			}else{
				this.$message.warning('请选择即将转移的顾问')
			}
			
		},
		moveClient(adviserInfo){
			console.log(adviserInfo)
			
			const { id, storeName, name,customerNun} = adviserInfo;
			if(customerNun){
				this.clientInfo = { id, storeName, name,customerNun} ;
				this.storesArr();
				this.adviserId = ''
				this.showMoveClient  = true;
			}else{
				this.$message.warning('您的客户量当前为0，暂时无法转移')
			}
			
		},
        setStatus(adviserInfo) {
            const {status, id, storeName, storeType, name} = adviserInfo
			if(status == 1){
				if(adviserInfo.customerNun >0){
					this.$message.warning('请在停用前转移所有客户');
					return
				}
			}
            const statusTxt = status == 1 ? '停用' : '启用'
            const txt = status == 1 ? `您确认停用【${storeName}${storeType}「${name}】顾问？<br>停用后客户下单时则无法选择此<br><span style='color:red;'>停用后不能再次启用此顾问</span>` : `您确认启用【${storeName}${storeType}「${name}】顾问？`;
            
            this.$confirm(txt, `提示`, {
                confirmButtonText: statusTxt,
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(async () => {
                const res = await setAdviserStatus({adviserId: id, status: status == 1 ? 2 : 4})
                this.$message.success(`${statusTxt}${name}顾问成功`)
                this.getData()
            }).catch(_ => {
                
            })
        },
        checkAccount(adviserInfo) {
            this.adviserInfo = adviserInfo
            const {status, id, storeName, storeType, name} = adviserInfo;
			

            this.$confirm(`【${storeName}${storeType}「${name}】顾问申请开通账号<br>是否同意开通？`, `审核账号开通`, {
                confirmButtonText: '允许开通',
                cancelButtonText: '不开通',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true
            }).then(async () => {
                const res = await auditAdviser({adviserId: id, status: 1})
                this.getData()
                this.$message.success(`审核通过`)
            }).catch(async (e) => {
                console.log(e)
                if(e == 'cancel'){
                    // const res = await auditAdviser({adviserId: id, status: 3})
                    // this.getData()
                    // this.$message.success(`停用成功`)
                }
            })

        },
        // 上传exl
        getUploadPath(path, id) {
            if(process.env.NODE_ENV == 'development'){
                return `${path}?adviserId=${id}`
            }else{
                return `/backend${path}?adviserId=${id}`
            }
            
        },
        // 找到推手库对应的列表
        toPushHandList(item) {
            this.$router.push({
                name: 'team',
                query: {
                    activeName: 'pushHander',
                    adviserId: item.id,
                    storeId: item.storeId
                }
            })
        },
        // 客户
        toCustomer(item) {
            this.$router.push({
                name: 'customerList',
                query: {
                    adviserId: item.id,
                    storeId: item.storeId
                }
            })
        },
		toOrderData(item,type){//Bi报表
			this.$router.push({
			    name: 'orderData',
			    query: {
			        activeName: type,
					storeId:item.storeId,
					adviserId:item.id
			    }
			})
		},
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
			this.queryParams.curPage = 1;
            // this.curPage = 1;
            this.getData();
        },
        handleCurrentChange(pageNum) {
			this.queryParams.curPage = pageNum;
            // this.curPage = pageNum;
            this.getData();
        }
    },
    filters: {
        getStatus(status){
            if(status !== 1){
                return '启用'
            }else{
                return '停用'
            }
        },
        // 状态:0-待审核,1-在职,2-离职,3-审核不通过
        getAdvStatus(status) {
            return ['待审核','已通过','已停用','审核不通过'][status]
        },
        getAdvTagStatus(status) {
            return ['info','success','danger','danger'][status]
        }
    }
}
</script>

