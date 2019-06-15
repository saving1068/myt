<template>
    <div class="customer-list page-container">
        <sticky>
            <div class="customer-head flex align-items-center justify-content-spacebetween boxshadow">
                <div class="customer-head__left">
                    <span :class="{active: index === queryParams.brannerType}" v-for="(item,index) in brannerList" :key="index" @click="changeBrandType(item, index)">
                        {{item.title}}
                    </span>
                </div>
                <div class="customer-head__right">
                    <el-select v-model="queryParams.brandId" size="mini" placeholder="选择意向车系" clearable @change="initData" style="width:130px">
                        <el-option
                            v-for="item in brandList"
                            :key="item.id"
                            :label="item.brandName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.storeId" size="mini" placeholder="选择销售分组" clearable @change="changeStore" style="width:130px">
                        <el-option
                            v-for="(item,index) in storeList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.adviserId" size="mini" placeholder="选择顾问" clearable @change="changeAdviser" style="width:130px">
                        <el-option
                            v-for="(item,index) in adviserList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </sticky>

        <div class="customer-filters mt10 boxshadow">
            <dl>
                <dt><span>客户意向等级</span></dt>
                <dd>
                    <el-radio-group v-model="queryParams.level" size="mini" class="filters-radio">
                        <el-radio-button label="">所有等级</el-radio-button>
                        <!-- <el-radio-button :label="0"><level-icon background="#ffcc00" color="#fff">?</level-icon>无等级</el-radio-button> -->
                        <el-radio-button :label="item.id" v-for="(item,index) in levels" :key="index" >
                            <level-icon :background="item.iconBackColour" :color="item.iconTextColour">{{item.iconText}}</level-icon>
                            {{item.content}}
                        </el-radio-button>
                    </el-radio-group>
                </dd>
            </dl>
            <dl>
                <dt><span>客户来源</span></dt>
                <dd class="flex">
                    <el-radio-group v-model="queryParams.source" size="mini" class="filters-radio">
                        <el-radio-button :label="item.val" v-for="(item,index) in sources" :key="index">{{item.title}}</el-radio-button>
                    </el-radio-group>
                    <div class="tui-filter ml20" v-show="queryParams.source == 7">
                        <el-select v-model="queryParams.storeId" size="mini" placeholder="选择分组" clearable @change="changeTuiStore" style="width:120px">
                            <el-option
                                v-for="(item,index) in storeList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="queryParams.adviserId" size="mini" placeholder="选择顾问" @change="getTuishou" clearable style="width:120px">
                            <el-option
                                v-for="(item,index) in adviserList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="queryParams.pushHandId" size="mini" placeholder="选择推手" clearable style="width:120px">
                            <el-option
                                v-for="(item,index) in pushHandList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </dd>
            </dl>
            <dl>
                <dt><span>线索性质</span></dt>
                <dd>
                    <el-radio-group v-model="queryParams.isAuth" size="mini" class="filters-radio">
                        <el-radio-button label="">全部</el-radio-button>
                        <el-radio-button :label="0">无号码粉丝</el-radio-button>
                        <el-radio-button :label="2">仅有号码</el-radio-button>
                        <el-radio-button :label="1">已认证</el-radio-button>
                    </el-radio-group>
                </dd>
            </dl>
            <!-- <div class="merge-dl flex justify-content-spacebetween mt15"> -->
                <dl class="col">
                    <dt><span>是否重要用户</span><icon-svg icon-class="member" style="width:22px; height:22px;" /></dt>
                    <dd class="flex">
                        <el-radio-group v-model="queryParams.isMajor" size="mini" class="filters-radio">
                            <el-radio-button label="">无限</el-radio-button>
                            <el-radio-button :label="1">是</el-radio-button>
                            <el-radio-button :label="0">否</el-radio-button>
                        </el-radio-group>
                        <el-input class="ml15" v-model="queryParams.keyVal" clearable @clear="initData" size="mini" placeholder="输入客户名称、手机" style="width: 220px;">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-button type="warning" :loading="loading" size="mini" icon="el-icon-search" class="ml15" @click="initData">查询</el-button>
                    </dd>
                </dl>
                <!-- <div class="flex align-items-end">
                    <el-button type="warning" size="mini" class="ml15">查询</el-button>
                </div>
            </div> -->
        </div>

        <div class="customer-content mt10 boxshadow">
            <el-table :data="list" style="width:100%;" v-loading="loading">
                <el-table-column label="等级" width="50" align="center">
                    <template slot-scope="scope">
                        <level-icon v-if="scope.row.level == '暂无'" background="#ffcc00" color="#fff">?</level-icon>
                        <level-icon v-else :background="scope.row.iconBackColour" :color="scope.row.iconTextColour">{{scope.row.iconText}}</level-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="source" label="来源" width="100" align="center" />
                <el-table-column label="客户信息" min-width="120" align="center">
                    <div slot-scope="scope" class="flex align-items-center justify-content-center">
                        <img v-if="scope.row.avatarUrl" :src="setImgPath(scope.row.avatarUrl)" width="30" height="30" class="radius" />
                        <span class="ml5">{{scope.row.name || '--'}}</span>
                    </div>
                </el-table-column>
				<el-table-column prop="customerIdentity" label="客户身份" width="100" align="center" />
                <el-table-column label="留档手机" width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.mobile | formatMobile}}
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" min-width="140" label="归属销售分组" align="center" />
                <el-table-column prop="advName" width="140" label="建档顾问" align="center" />
                <el-table-column prop='createTime' label="建档时间" width="100" align="center">
                    <!-- <template slot="header" slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            title="标题"
                            width="200"
                            trigger="hover"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                        >
                            <span slot="reference">建档时间<i class="el-icon-question"></i></span>
                        </el-popover>
                    </template> -->
                    <!-- <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template> -->
                </el-table-column>
                <el-table-column prop="firstStoreTime" label="首次到店" width="100" align="center">
                    <!-- <template slot="header" slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            title="标题"
                            width="200"
                            trigger="hover"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                        >
                            <span slot="reference">首次到店<i class="el-icon-question"></i></span>
                        </el-popover>
                    </template> -->
                   <!-- <template slot-scope="scope">
                        {{scope.row.firstStoreTime}}
                    </template> -->
                </el-table-column>
                <el-table-column label="认证时间" width="100" align="center">
                    <!-- <template slot="header" slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            title="标题"
                            width="200"
                            trigger="hover"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                        >
                            <span slot="reference">认证时间<i class="el-icon-question"></i></span>
                        </el-popover>
                    </template> -->
                    <template slot-scope="scope">
                        {{scope.row.authTime}}
                    </template>
                </el-table-column>
                <el-table-column label="最近跟进" width="100" align="center">
                    <!-- <template slot="header" slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            title="标题"
                            width="200"
                            trigger="hover"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                        >
                            <span slot="reference">最近跟进<i class="el-icon-question"></i></span>
                        </el-popover>
                    </template> -->
                    <template slot-scope="scope">
                        {{scope.row.latelyFollowTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span v-if="isBtnPower('080102') && scope.row.userId" @click="previewCode(scope.row)">档案</span>
                            <!-- <span v-if="isBtnPower('05020104')">转移客户</span> -->
							  <span v-if="isBtnPower('080103')" @click="moveClient(scope.row)">转移客户</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-content-end mt15">
                <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
		
        <qr-code-dialog :visible.sync="qrcodeDialogVisible" :title="qrcodeTitle" :user-info="qrcodeUserInfo" :src="qrcodePath"></qr-code-dialog>
		<el-dialog
		  title="提示"
		  :visible.sync="showMoveClient"
		  width="350px"
		  >
		  <span v-if="clientInfos.customerIdentity == '客户'">您确认将【{{clientInfos.storeName}}「{{clientInfos.advName}}」】顾问的「{{clientInfos.name}}」客户档案转移给以下你选定的顾问吗？</span>
		  <span v-else>您确认将【{{clientInfos.storeName}}「{{clientInfos.advName}}」】顾问的「{{clientInfos.name}}」与其{{clientInfos.clientNum}}名下线客户一并转移给以下你选定的顾问吗？</span>
		  <div class="flex" style="margin-top: 10px;">
			<el-select v-model="clientInfos.storeId" size="mini" clearable placeholder="全部销售分组" @change="getAdviserArr" style="width:130px">
			     <el-option
			         v-for="item in saleList"
			         :key="item.id"
			         :label="item.name"
			         :value="item.id">
			     </el-option>
			 </el-select>
			<el-select v-model="adviserId" size="mini" clearable placeholder="全部顾问"   style="width:120px;margin-left:15px;">
			     <el-option
			         v-for="(item,index) in clientAdviser"
			         :key="index"
			         :label="item.name"
			         :value="item.id">
			     </el-option>
			 </el-select>
			  
		  </div>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="showMoveClient = false">取 消</el-button>
			<el-button type="primary" :disabled="clientInfos.clientNum ==0" @click="suerTransfer">确 定</el-button>
		  </span>
		</el-dialog>
    </div>
</template>


<script>
import Sticky from '@/components/Sticky'
import Panel from '@/components/Panel'
import LevelIcon from '@/components/LevelIcon'
import QrCodeDialog from '@/components/QrCodeDialog'

import power from '@/mixins/power'
import {setImgPath} from '@/utils'
import {getSaleBrandDtos, getLevels, getStoreList, getAdviserList, getPushHandList} from '@/api/common'
import {getCustomerList, getPreviewCode,transferPushHandCustomer,queryCustomerCount} from '@/api/customer'

export default {
    components: {Sticky, Panel, LevelIcon, QrCodeDialog},
    mixins: [power],
    data() {
        return {
			showMoveClient:false,
			adviserId: null,
			clientInfos: {
				storeId:'',
				adviserId:'',
			},
			clientAdviser:[],
			saleList:[],
			
			
            loading: false,

            brannerList: [
                {title: '全部线索', val: 0},
                {title: '未到店', val: 1},
                {title: '已到店', val: 2},
                {title: '已试驾', val: 3},
                {title: '已预订', val: 4},
                {title: '暂时战败', val: 5},
                {title: '无效', val: 6},
            ],

            brandList: [],
            storeList: [],
            adviserList: [],
            pushHandList: [],
            levels: [],

            // 客户来源：0-所有来源；1-网销；2-到店；3-外拓；4-分配；5-顾问；6-自然；7-推手
            sources: [
                {title: '所有来源', val: 0},
                {title: '网销', val: 1},
                {title: '到店', val: 2},
                {title: '外拓', val: 3},
                {title: '分配', val: 4},
                {title: '顾问', val: 5},
                {title: '自然', val: 6},
                {title: '推手', val: 7},
            ],

            list: [],

            total: 0,
            queryParams: {
                brannerType: 0,
                brandId: '',
                storeId: '',
                adviserId: '',
                source: 0,
                level: '',
                isMajor: '',
                isAuth: '',
                keyVal: '',
                pushHandId: '',
                curPage: 1,
                pageSize: 10,
            },

            qrcodeDialogVisible: false,
            qrcodeTitle: '',
            qrcodePath: '',
            qrcodeUserInfo: {},
            setImgPath: setImgPath
        }
    },
    async created() {
        await this.getPower('080102,080103')

        this.$loading.show()
        try {
            const {storeId, adviserId, pushHandId} = this.$route.query

            // 车系
            const brands = await getSaleBrandDtos()
            this.brandList = brands

            // 门店
            const stores = await getStoreList()
            this.storeList = stores

            if(storeId &&  stores.find(v => v.id == storeId)){
                this.queryParams.storeId = storeId
            }

            if(this.queryParams.storeId && adviserId){
                const staff = await getAdviserList({sellerStoreId:storeId})
                this.queryParams.adviserId = adviserId
                this.adviserList = staff
                const res = await getPushHandList({adviserId})
                this.pushHandList = res
            }

            if(adviserId && pushHandId) {
                this.queryParams.pushHandId = String(pushHandId)
                this.queryParams.source = 7
            }
			console.log(this.queryParams)

            // 等级
            const levels = await getLevels()
            this.levels = levels

        } catch (error) {
            console.error(error)
        }

        this.$loading.hide()

        this.getData()
    },
    methods: {
		async getAdviserArr(value){
			// console.log(value)
			this.adviserId = '';
			let info = await getAdviserList({sellerStoreId:value})
			const _index =  info.findIndex(item =>item.id == this.clientInfos.adviserId)
			console.log(_index)
			if(_index != -1){
				info.splice(_index,1)
			}
			
			this.clientAdviser = info;
			// console.log(info,this.clientInfos)
		},
		async storesArr(){
			 const stores = await getStoreList()
			// 筛选已启用的门店
			this.saleList = stores;
			// console.log(this.clientInfos)
		},
		async suerTransfer(){
			// this.clientInfos.adviserId = this.adviserId
			// console.log(this.clientInfos.adviserId,this.adviserId)
			if(this.adviserId){
				if(this.clientInfos.adviserId != this.adviserId){
					this.$loading.show()
					
					if(this.clientInfos.customerIdentity == '客户'){
						let send = {
							adviserId:String(this.clientInfos.adviserId),
							adCustomerId:String(this.clientInfos.adCustomerId),
							transferAdviserId:String(this.adviserId)
						}
						console.log(send)
						try{
							 let res  = await transferPushHandCustomer(send)
							 this.$message.success(res)
							  this.getData()
							  this.adviserId = '';
							  this.clientAdviser = [];
							  this.showMoveClient  = false;
						}catch(e){
							//TODO handle the exception
						}
					  
					
						 this.$loading.hide()
					}else if(this.clientInfos.customerIdentity == '代理'){
						let send = {
									adviserId:String(this.clientInfos.adviserId),
									agentId:String(this.clientInfos.agentId),
									transferAdviserId:String(this.adviserId)
								}
								// console.log(this.clientInfos.adviserId)
								try{
									 let res  = await transferPushHandCustomer(send)
									 this.$message.success(res)
									  this.getData()
									  this.adviserId = '';
									  this.clientAdviser = [];
									  this.showMoveClient  = false;
								}catch(e){
									//TODO handle the exception
								}
								 this.$loading.hide()
					}else{
						let send = {
							adviserId:String(this.clientInfos.adviserId),
							pushHandId:String(this.clientInfos.adviserPushHandId),
							transferAdviserId:String(this.adviserId)
						}
						console.log(this.clientInfos.adviserId)
						// console.log(send)
						try{
							 let res  = await transferPushHandCustomer(send)
							 this.$message.success(res)
							  this.getData()
							  this.adviserId = '';
							  this.clientAdviser = [];
							  this.showMoveClient  = false;
						}catch(e){
							//TODO handle the exception
						}
						 this.$loading.hide()
					}
				}else{
					this.$message.warning('请选择非己的顾问')
				}
			}else{
				this.$message.warning('请选择即将转移的顾问')
			}
			
			
				
// 			if(this.ClientInfo.adviserId){
// 				try{
// 					this.$loading.show('请稍后...')
// 					let send = {
// 						transferAdviserId:this.ClientInfo.adviserId,
// 						adviserId:this.ClientInfo.id
// 					}
// 					let res = await transferCustomer(send)
// 					console.log(res)
// 					this.$message.success(res)
					
// 					this.$loading.hide()
// 				}catch(e){
// 					
// 				}
// 			}else{
// 				this.$message.warning('请选择即将转移的顾问')
// 			}
			
		},
		async moveClient(adviserInfo){
			let {storeName,advName,name,adviserPushHandId,customerIdentity,adviserId,adCustomerId} =  { ...adviserInfo}
			let res =1;
			if(customerIdentity !='客户'){
				res = await queryCustomerCount({adviserId,pushHandId:adviserPushHandId})
				console.log(res)
			}
			this.clientInfos = {storeName,advName,name,adviserPushHandId,customerIdentity,adviserId,adCustomerId,clientNum:res} ;
			
			this.storesArr();
			// console.log(this.adviserId)
			this.showMoveClient  = true;
		},
		
		
		
		
        async getData() {
            this.loading = true
            try {
                const params = {...this.queryParams}
                const res = await getCustomerList(params)

                this.total = res.total
                this.list = res.items
            } catch (error) {
                
            }
            this.loading = false
        },
        initData() {
            this.queryParams.curPage = 1
            this.getData()
        },
        // 切换菜单
        changeBrandType(item, index) {
            if(this.queryParams.brannerType === index) {
                return false
            }

            Object.assign(this.$data.queryParams, this.$options.data().queryParams)

            this.queryParams.brannerType = index
            this.getData()
        },
        // 切换门店
        async changeStore(storeId) {
            this.$loading.show()
            const rs = await this.getStoreAdviser(storeId)
            this.$loading.hide()
            this.initData()
        },
        // 选择顾问列表
        changeAdviser(adviserId) {
            this.initData()
            this.getTuishou(adviserId)
        },
        // 切换推手下的门店
        changeTuiStore(storeId) {
            this.getStoreAdviser(storeId)
        },
        // 当前门店下的的顾问
        getStoreAdviser(storeId) {
            return new Promise(async (resolve, reject) => {
                this.$loading.show()
                try {
                    // 初始化数据
                    this.queryParams.adviserId = ''
                    this.queryParams.pushHandId = ''
                    this.adviserList = []
                    this.pushHandList = []

                    if(storeId){
                        // 某门店对应的顾问列表
                        const staff = await getAdviserList({sellerStoreId:storeId})
                        this.adviserList = staff
                        resolve(staff)
                    }else{
                        resolve([])
                    }
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
                this.$loading.hide()
            })
        },
        async getTuishou(adviserId) {
            this.$loading.show()
            try {
                this.queryParams.pushHandId = ''
                this.pushHandList = []
                const res = await getPushHandList({adviserId})
                this.pushHandList = res
            } catch (error) {
                console.log(error)
            }
            this.$loading.hide()
        },
        // 档案二维码
        async previewCode(item) {
            this.qrcodeTitle = '查看客户档案' + (item.isTs ? '(推手)' : '非推手')
            
            this.$loading.show()
            try {
                const res = await getPreviewCode({userId: item.userId})
                this.qrcodeUserInfo = {name: item.name, mobile: item.mobile}
                if(!res.length){
                    this.$loading.hide()
                    return this.$message.error('没找到相应的二维码')
                }
                this.qrcodePath = res
                this.qrcodeDialogVisible = true
            } catch (error) {
                console.error(error)
            }
            this.$loading.hide()

        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.curPage = 1;
            this.getData();
        },
        handleCurrentChange(pageNum) {
            this.curPage = pageNum;
            this.getData();
        }
    },
    filters: {
        formatMobile(mobile) {
            if(!mobile) return '--'
            return mobile.replace(/^(\d{3}).*(\d{3})$/, '$1****$2')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/var';

.customer-list {
    .customer-head {
        background:#fff;
        padding:0 10px;
        box-shadow: 0 0 5px rgba(0,0,0,.1);

        &__left {
            span {
                position: relative;
                display: inline-block;
                padding: 10px;
                cursor: pointer;

                &.active {
                    color: $primary;

                    &:after {
                        position: absolute;
                        content:"";
                        left:0;
                        bottom:0;
                        width:100%;
                        height:2px;
                        background: $primary;
                    }
                }
            }
        }
    }

    .customer-filters {
        padding:15px;
        background: #fff;

        > dl:not(:first-child){
            margin-top: 15px;
        }

        dl {
            

            dt {
                span {
                    color:#999;
                }
            }

            dd {
                margin-top:5px;
            }
        }

        .merge-dl {
            dl {
                padding:0 30px;

                &:first-child {
                    padding-left:0;
                }
            }
        }
    }

    .customer-content {
        padding:15px;
        background: #fff;
    }
}
</style>


