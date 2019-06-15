<template>
    <div class="staff-library">
        <panel class="staff-content">
            <template slot="head">
                <div class="left flex">
                   <!-- <el-select v-model="queryParams.storeId" size="mini" clearable placeholder="选择分店" @change="getData" style="width:120px">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="queryParams.sortType" size="mini" placeholder="选择排序" @change="getData" style="max-width:140px;">
                        <el-option
                            v-for="item in sortList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
					<el-select v-model="queryParams.agentType" size="mini" clearable placeholder="全部代理商" @change="getData" style="width:170px; margin-left:15px;">
					     <el-option
					         v-for="item in agentList"
					         :key="item.id"
					         :label="item.name"
					         :value="item.id">
					     </el-option>
					 </el-select>
					 <el-select v-model="queryParams.status" size="mini" clearable placeholder="全部状态" @change="statusChange" style="width:120px; margin-left:15px;">
					      <el-option
					          v-for="item in statusList"
					          :key="item.id"
					          :label="item.label"
					          :value="item.value">
					      </el-option>
					  </el-select>
                    <!-- <el-input placeholder="输入顾问名称、手机" v-model="queryParams.keyVal" style="width:200px; margin:0 15px;" size="mini" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                    </el-input> -->
                    <!-- <div> -->
                        <!-- <el-checkbox v-model="queryParams.waitaudit" @change="getData">只看待审核顾问</el-checkbox> -->
						
                    <!-- </div> -->
                </div>
                <div class="right">
                    <span v-if="isBtnPower('05020112')"><el-button type="info" size="mini" @click='getBossMobie'>设置BOSS电话</el-button></span>
                    <span v-if="isBtnPower('05020113')"><el-button type="warning" size="mini" @click='getUpgrade'>设置自动升级代理商标准</el-button></span>
                </div>
            </template>
            <div class="staff-adviser__content">
                <el-table :data="adviserList" style="width: 100%" fit v-loading="loading" :height="sideHeight">
					
                    <el-table-column label="代理人信息" min-width="150" align="center" >
                        <template slot-scope="scope">
                            <div class="flex align-items-center justify-content-center">
                                <img :src="setImgPath(scope.row.avatarUrl)" width="30" height="30" class="radius" /> 
                                <div class="ml5">
                                	<div>{{scope.row.name}}</div>
                                	<div>{{scope.row.mobile}}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applyTypeStr" label="升级方式" min-width="120" align="center" />
					 <el-table-column label="审核状态" min-width="120" align="center" >
					    <template slot-scope="scope">
					       <el-tag :type="scope.row.status | getAdvTagStatus" size="small">{{scope.row.status | getAdvStatus}}</el-tag>
					   </template>
					</el-table-column>
                    <el-table-column label="升级时间" width="120" align="center">
                        <template slot-scope="scope">
                          {{scope.row.house}}<br />
                          {{scope.row.time}}
                        </template>
                    </el-table-column>
					<el-table-column prop="adviserPre" label="升级前顾问" min-width="120" align="center" />
					<el-table-column prop="adviserNext" label="升级后跟单顾问" min-width="120" align="center" />
                    <!-- <el-table-column prop="mobile" label="手机号" width="120" align="center" /> -->
                    <el-table-column prop="customerNun" label="客户量" align="center" />
                    <el-table-column prop="pushHandNum" label="推手量" align="center" />
					<el-table-column prop="orderNum" label="相关订单量" align="center" />
                   <!-- <el-table-column label="状态" width="120" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.status | getAdvTagStatus" size="small">{{scope.row.status | getAdvStatus}}</el-tag>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width="250">
                        <template slot-scope="scope">
                            <div class="operate">
                                <!-- <span v-if="isBtnPower('05020110') && scope.row.status == 0" @click="checkAccount(scope.row)">审核</span> -->
                                <span v-if="scope.row.status == 3" style="cursor:default;">审核不通过</span>
                                <template v-if='scope.row.status != 3&&scope.row.status != 0'>
                                    <span v-if="isBtnPower('080101')" @click="toCustomer(scope.row)">客户</span>
                                    <span v-if="isBtnPower('05020105')" @click="toPushHandList(scope.row)">推手成员</span>
                                    <!-- <span v-if="isBtnPower('080101')">订单</span> -->
									<span v-if="isBtnPower('05020111')&&scope.row.status == 1" @click="shopAgent(scope.row)">停用代理身份</span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-content-end mt15">
                    <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </panel>
		<!-- 设置自动升级的代理商标准 -->
		<el-dialog
		  title="设置自动升级的代理商标准"
		  :visible.sync="upgrade"
		  width="500px"
		  class='upgrade'
		 >
		  <span>门店的「推手」同时达到以下标准则自动升级成为代理商，自动享受代理商分佣计算方式：</span>
		  <div class="flex">
			  <div class="flex-item">
				  <div>成交单量</div>
				  <el-input-number :min='0' size="mini" v-model="targetInfo.dealOrderNum"></el-input-number>
			  </div>
			  <div class="flex-item">
				  <div>累计贡献线索量</div>
				  <el-input-number  :min='0'size="mini" v-model="targetInfo.clueUserNum" ></el-input-number>
			  </div>
			  <div class="flex-item">
				  <div>团队推手量</div>
				  <el-input-number :min='0' size="mini" v-model="targetInfo.cluePushHandNum"></el-input-number>
			  </div>
		  </div>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="upgrade = false">取 消</el-button>
			<el-button type="primary" @click="setUpgrade">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- boss电话 -->
		<el-dialog
		  title="设置BOSS 电话"
		  :visible.sync="BossMobie"
		  width="300px"
		  class='upgrade'
		 >
		  <span>请设置一个方便代理商直接洽谈合作的联系电话号码：</span>
		  <div style="padding-top: 10px;">
			  <el-input type="text" v-model='bossInfo.content' :maxlength="11" size="mini"></el-input>
		  </div>
		  
		  <span slot="footer" class="dialog-footer">
			<el-button @click="BossMobie = false">取 消</el-button>
			<el-button type="primary" @click="setBossMobie">确 定</el-button>
		  </span>
		</el-dialog>
    </div>
</template>

<script>
import Panel from '@/components/Panel'
import Sticky from '@/components/Sticky'
import UploadExcel from '@/components/UploadExcel'
import power from '@/mixins/power'
// import wtExcel from '@/assets/excel/外拓数据导入.xlsx'
// import wxExcel from '@/assets/excel/网销数据导入.xlsx'

import {setImgPath, queryParams,validMobile} from '@/utils'

import {getStoreList,getDictSellerInfo} from '@/api/common'
import {pageAgents,sellerAgentList,setBossMobile,querySellerAgentCondition,editSellerAgentCondition,addSellerAgentCondition,auditStatus} from '@/api/staff'

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
            storeList: [
				 {
				    value: 1,
				    label: '全部销售分组'
				}, 
			],
			upgrade:false,
			BossMobie:false,
			bossInfo:{
				content:''
			},
			deal:'',
			targetInfo:{
				dealOrderNum:'',
				clueUserNum:'',
				cluePushHandNum:'',
			},
			
			contribution:'',
			pushHandNum:'',
			agentList:[
					 {
					    id: 2,
					    name: '直属BOSS的代理商'
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
                    value: 2,
                    label: '按最新注册时间排序'
                }, 
				{
				    value: 1,
				    label: '按客户量排序'
				}, 
                {
                    value: 3,
                    label: '按旗下推手量'
                },
				{
				    value: 4,
				    label: '成交量'
				}
            ],

            loading: false,
            adviserList: [],
            total: 0,
            queryParams: {
                sortType: 1,
				agentType:'',
                keyVal: '',
                pageSize: 10,
				status:'',
                curPage: 1
            },
            setImgPath: setImgPath,
            // downloadWtExcel: wtExcel,
            // downloadWxExcel: wxExcel
        }
    },
    async created() {
        
        
        try {
            await this.getPower('05020102,05020103,05020104,05020106,05020107,05020105,080101,05020110,05020112,05020113,05020111')
			// this.$loading.show()
			this.loading = true
            const {storeId} = this.$route.query
            const urlParams = queryParams()
			const agentNeam = await sellerAgentList();
			for(let i= 0;i<agentNeam.length;i++){
				this.agentList.push(agentNeam[i])
			}
            // const stores = await getStoreList()
            // 筛选已启用的门店
            // this.storeList = stores

            // 找到对应的门店 istop防止参数互串
//             if(!urlParams.istop && storeId && stores.find(v => v.id == storeId)){
//                 this.queryParams.storeId = storeId
//             }
			if(!urlParams.istop && storeId){
                this.queryParams.storeId = storeId
            }

            this.getData()
        } catch (error) {
            console.error(error)
        }

        this.$loading.hide()
    },
    methods: {
		async getUpgrade(){
			try{
				this.$loading.show()
				let info = await querySellerAgentCondition();
				console.log(1111,info)
				let targetInfo = this.targetInfo;
				if(info){
					this.targetInfo = Object.keys(info).length != 0? {...info}:targetInfo;
				}
				
				this.upgrade = true;
				this.$loading.hide()
			}catch(e){
				this.$loading.hide()
				//TODO handle the exception
			}
			
		},
		async setUpgrade(){
			console.log(this.targetInfo);
			if(this.targetInfo.id){
				try{
					let send = {
						cluePushHandNum:this.targetInfo.cluePushHandNum,
						clueUserNum:this.targetInfo.clueUserNum,
						dealOrderNum:this.targetInfo.dealOrderNum,
						id:this.targetInfo.id
					}
					await editSellerAgentCondition(send);
					this.upgrade = false;
					this.$message.success('设置成功')
				}catch(err){
					
				}
			}else{
				try{
					let send = {
						cluePushHandNum:this.targetInfo.cluePushHandNum,
						clueUserNum:this.targetInfo.clueUserNum,
						dealOrderNum:this.targetInfo.dealOrderNum,
					}
					await addSellerAgentCondition(send);
					this.$message.success('设置成功')
					this.upgrade = false;
				}catch(err){
					
					}
				
			}
		},
		statusChange(e){
			this.queryParams.curPage = 1;
			this.getData()
		},
        async getData() {
            try {
                const params = {...this.queryParams}
				console.log(params)
                // params.waitaudit = params.waitaudit ? 1 : 0

                this.loading = true
                const res = await pageAgents(params)
                this.adviserList = res.items
                this.total = res.total
            } catch (error) {
                console.error(error)
            }
            this.loading = false
        },
        setStatus(adviserInfo) {

            const {status, id, storeName, storeType, name} = adviserInfo
            const statusTxt = status == 1 ? '停用' : '启用'
            const txt = status == 1 ? `您确认停用【${storeName}${storeType}「${name}】顾问？<br>停用后客户下单时则无法选择此` : `您确认启用【${storeName}${storeType}「${name}】顾问？`
            
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
		async setBossMobie(){
			console.log(validMobile)
			if(!validMobile(this.bossInfo.content)){
				this.$message.warning('输入正确的手机号码')
			}
			let send = {
				mobile:this.bossInfo.content,
				id:this.bossInfo.id?this.bossInfo.id:''
			}
			try{
				await setBossMobile(send);
				this.$message.success('设置成功')
				this.BossMobie = false;
			}catch(e){
				//TODO handle the exception
			}
			
			
		},
		async getBossMobie(){
			await getDictSellerInfo({type:33}).then((res)=>{
				this.BossMobie = true;
				console.log(res)
				if(res.length !=0){
					this.bossInfo  = res[0];
				}
			})
		},
		shopAgent(adviserInfo){
			console.log(adviserInfo)
			const {status, id, storeName, storeType, name} = adviserInfo;
			 this.$confirm(`【您确认停用「${name}」代理商？】<span style='color:red'>停用后代理商数据保留后台，代理商前端变回客户身份？停用后不能再启用!</span>`, `停用`, {
			    confirmButtonText: '停用',
			    cancelButtonText: '取消',
			    type: 'warning',
			    dangerouslyUseHTMLString: true,
			    closeOnClickModal: false,
			    distinguishCancelAndClose: true
			}).then(async () => {
			    const res = await auditStatus({ id, status: 2})
			    this.getData()
			    this.$message.success(`审核通过`)
			}).catch(async (e) => {
			    console.log(e)
			})
		},
        checkAccount(adviserInfo) {
            this.adviserInfo = adviserInfo
            const {status, id, storeName, storeType, name} = adviserInfo

            this.$confirm(`「${name}」代理商申请开通账号<br>是否同意开通？开通或可见顾问工作台`, `审核账号开通`, {
                confirmButtonText: '允许开通',
                cancelButtonText: '不开通',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true
            }).then(async () => {
                const res = await auditStatus({ id, status: 1})
                this.getData()
                this.$message.success(`审核通过`)
            }).catch(async (e) => {
                console.log(e)
                if(e == 'cancel'){
                    const res = await auditStatus({id, status: 3})
                    this.getData()
                    this.$message.success(`停用成功`)
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
			console.log(item)
            this.$router.push({
                name: 'team',
                query: {
                    activeName: 'pushHander',
                    agentId: item.id,
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
        handleSizeChange(pageSize) {
            // this.pageSize = pageSize;
            // this.curPage = 1;
            this.getData();
        },
        handleCurrentChange(pageNum) {
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
            return ['待审核','已通过','已停用','未通过'][status]
        },
        getAdvTagStatus(status) {
            return ['info','success','danger','danger'][status]
        }
    }
}
</script>
<style scoped="scoped" lang="scss">
	.upgrade{
		.flex{
			justify-content: space-between;
			align-items: center;
			.flex-item{
				padding-top: 10px;
				text-align: center !important;
			}
		}
	}
	
	
</style>

