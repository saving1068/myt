<template>
    <div class="welfare-record page-container">
        <panel :show-content="false">
            <template slot="head">
                <div class="left">
                    <span class="title">分润管理</span> &gt;
                    <i class="small">分润核销记录</i>
                </div>
                <div class="right">
                    <el-select v-model="queryParams.storeId" placeholder="请选择门店" @change="changeStore" :clearable="true" size="mini" style="width: 140px">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.adviserId" placeholder="请选择顾问" @change="getData" :clearable="true" size="mini" style="width: 120px;margin-left: 10px;">
                        <el-option
                            v-for="item in adviserList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
					<!-- <el-button type="warning" size="mini" style='margin-left: 10px;'>导出</el-button> -->
					<el-button type="info" size="mini" @click="$router.go(-1)">返回</el-button>
                </div>
            </template>
        </panel>
			<!-- <img src="http://192.168.3.102:8082/welfare/qrcode.do?cateogry=49133066253238272" alt=""> -->
        <panel class="mt10">
            <div slot="head">
                <el-select v-model="queryParams.rebateType" placeholder="奖励方式" :clearable="true" @change="getData" size="mini" style="width: 120px">
                    <el-option v-for="item in rebateTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="queryParams.status" placeholder="全部提现状态" :clearable="true" @change="getData" size="mini" style="width: 130px">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="queryParams.recordType" placeholder="全部分润记录" :clearable="true" @change="getData" size="mini" style="width: 140px">
                    <el-option v-for="item in agentList" :key="item.id" :label="item.label" :value="item.value" />
                </el-select>
				 <el-select v-model="queryParams.brandId" placeholder="订单车系" :clearable="true" @change="getData" size="mini" style="width: 120px">
				    <el-option v-for="item in carBrandList" :key="item.saleBrandId" :label="item.brandName" :value="item.saleBrandId" />
				</el-select>
				 <el-select v-model="queryParams.carTypeId" placeholder="订单车型" :clearable="true" @change="getData" size="mini" style="width: 120px">
				    <el-option v-for="item in carTypeList" :key="item.id" :label="item.shopCarTypeName" :value="item.id" />
				</el-select>
                <el-input placeholder="输入推手或代理商名称、手机、订单号" v-model="queryParams.keyVal" style="width:315px; margin:0 15px;" size="mini" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>
            </div>
            <el-table :height='sideHeight' :data="list" style="width:100%;" fit v-loading="loading">
                <el-table-column label="来源" prop="source" width="120" align="center">
					<template slot-scope="scope">
						{{scope.row.source | getSource}}
					</template>
					
				</el-table-column>
				 <el-table-column label="身份" prop="identity"  align="center" />
                <el-table-column label="推手信息或代理信息" width="150" align="center">
                    <template slot-scope="scope">
						<div class="flex align-items-center justify-content-center">
							<img :src="setImgPath(scope.row.headPic)" width="30" height="30" class="radius" /> 
							<span class="ml5">{{scope.row.name}}</span>
						</div>
                    </template>
                </el-table-column>
				<el-table-column label="是否代理商推手" width="150" align="center">
				    <template slot-scope="scope">
				        <div v-if="scope.row.agentName&&scope.row.agentMobile">
				            <div>{{scope.row.agentName}}</div>
				            <span>{{scope.row.agentMobile}}</span>
				        </div>
						<div v-else>--</div>
				    </template>
				</el-table-column>
                <el-table-column prop="advName" label="接单顾问" width="120" align="center" />
                <el-table-column prop="brandName" label="订单产品" width="120" align="center" />
                <el-table-column prop="busId" label="单号" width="120" align="center" />
                <el-table-column label="成交时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.dayTime}}<br>
                        {{scope.row.hourTime}}
                    </template>
                </el-table-column>
                <el-table-column label="奖励方式" align="center">
                    <template slot-scope="scope">
						<el-tag v-if="scope.row.rebateType == 1 " type="danger">现金</el-tag>
						<el-tag v-if="scope.row.rebateType == 2 " type="info">券</el-tag>
						<el-tag v-if="scope.row.rebateType == 3 " type="primary">实物</el-tag>
                        <!-- <el-tag :type="scope.row.rebateType == 1 ? 'danger' : 'primary'">{{scope.row.rebateType == 1 ? '现金' : '实物'}}</el-tag> -->
                    </template>
                </el-table-column>
                <el-table-column label="奖励价值" width="100" align="center">
                    <template slot-scope="scope">
                        {{scope.row.rebateType == 1 ? scope.row.casePrice : scope.row.goodsPrice}}
                    </template>
                </el-table-column>
                <el-table-column label="提现时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.receiveDayTime}}<br>
                        {{scope.row.receiveHourTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <div class="operate">
                            <span v-if="isBtnPower('060208')">对应订单</span>
                            <span v-if="isBtnPower('060206')&&scope.row.status == 2" @click="qrcodeHandle(scope.row)">提现码</span>
                            <span v-if="isBtnPower('060207')" @click="previewCode(scope.row)">档案</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-content-end mt15">
                <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>
                
        </panel>

        <el-dialog :title="currentInfo.storeName" :visible.sync="qrCodeDialogVisible" width="300px" center @closed="dialogClose">
            <div class="textCenter"><img class="inlineBlock" :src="setImgPath(qrCodePath)" width="200" height="200" /></div>
        </el-dialog>

        <qr-code-dialog :visible.sync="qrcodeDialogVisible" :title="qrcodeTitle" :user-info="qrcodeUserInfo" :src="qrcodePath"></qr-code-dialog>

    </div>
</template>


<script>
import Sticky from '@/components/Sticky'
import Panel from '@/components/Panel'
import QrCodeDialog from '@/components/QrCodeDialog'
import power from '@/mixins/power'

import {setImgPath} from '@/utils'

import {getAdviserPushHandWelfares, getMoneyCode, eachWelfareStatus} from '@/api/marketing'
import {getSaleBrandDtos, getStoreList, getAdviserList,querySelectSaleCarType} from '@/api/common'
import {getPreviewCode} from '@/api/customer'

export default {
    components: {Sticky, Panel, QrCodeDialog},
	computed:{
			sideHeight(){
	// 			console.log(111)
	// 			console.log(this.$store.state.getContentSize)
					return this.$store.state.getContentSize -180
			}
		},
    mixins: [power],
    data() {
        return {
            loading: false,
            storeList: [],
            adviserList: [],
            rebateTypeList: [
                {label: '现金', value: 1},
                {label: '实物', value: 3},
            ],
            statusList: [
                {label: '已提现', value: 4},
                {label: '未提现', value: 2},
            ],
            agentList: [
				{label: '仅看代理商推手', value: 1},
				{label: '仅看代理商', value: 2},
				{label: '仅看门店推手', value: 3},
            ],
			carBrandList:[],
			carTypeList:[],
            list: [],
            total: 0,
            queryParams: {
				recordType:'',
                storeId: '',
                adviserId: '',
                rebateType: '',
                status: '',
                brandId: '',
                keyVal: '',
                pageSize: 10,
                curPage: 1,
				carTypeId:''
            },
            setImgPath: setImgPath,

            currentInfo: '',
            qrCodePath: '',
            qrCodeDialogVisible: false,
            realTimer: null,
            realTimeIntervalTime: 5000, // 实时轮询查看推手分润纪录状态时间

            // 档案
            qrcodeDialogVisible: false,
            qrcodeTitle: '',
            qrcodePath: '',
            qrcodeUserInfo: {},

        }
    },
    async created() {
		 this.loading = true
        await this.getPower('060206,060207,060208')
        let stores = await getStoreList()
        this.storeList = stores
		
        const brands = await getSaleBrandDtos()
        this.carBrandList = brands
		let query = this.$route.query
		console.log(query)
		if(query.brandId){
			this.queryParams.brandId = query.brandId
			const car = await querySelectSaleCarType({saleBrandId:query.brandId})
			this.carTypeList  = car;
		}
        this.getData()
    },
    methods: {
        async getData() {
            this.loading = true
            try {
                const params = {...this.queryParams}
				console.log(params.brandId,'params.brandId',typeof(params.brandId))
				if(params.brandId){
					const car = await querySelectSaleCarType({saleBrandId:params.brandId})
					this.carTypeList  = car;
					this.queryParams.brandId = params.brandId
				}else{
					this.carTypeList  = [];
					this.queryParams.carTypeId = ''
				}
                const res = await getAdviserPushHandWelfares(params)
                this.list = res.items
                this.total = res.total
            } catch (error) {
                console.error(error)
            }
            this.loading = false
        },
        // 切换门店
        async changeStore(storeId) {
            try {
                this.queryParams.adviserId = ''
                this.adviserList = []

                if(storeId){
                    // 某门店对应的顾问列表
                    const staff = await getAdviserList({sellerStoreId:storeId})
                    this.adviserList = staff
                }
                this.getData()
            } catch (error) {
                console.error(error)
            }
        },
        async qrcodeHandle(item) {
            // console.log(item)
            this.currentInfo = {...item}
			this.realTimer && clearTimeout(this.realTimer)
            this.$loading.show()
            try {
                const qr = await getMoneyCode({cateogry: item.id})
                this.qrCodePath = qr.filePath
                this.qrCodeDialogVisible = true

                this.getRealtimeStatus(item.id)
            } catch (error) {
                console.error(error)
            }
            this.$loading.hide()

        },
        // 实时更新客户扫码状态
        async getRealtimeStatus(logId) {
            try {
                const res = await eachWelfareStatus({logId})
				console.log(res)
				if(res){
					const _index = this.list.findIndex(item=>item.id == logId)
					this.list[_index].status =4;
					this.$message.warning('客户已扫码领取')
					clearTimeout(this.realTimer)
					this.realTimer = null
				}
				
               

            } catch (error) {
                // console.error(error)
                // 轮询
                this.realTimer = setTimeout(() => {
                    this.getRealtimeStatus(logId)
                }, this.realTimeIntervalTime)
            }
            
        },
        // 档案二维码
        async previewCode(item) {
            this.qrcodeTitle = '查看客户档案推手'
            
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
		dialogClose(){
			console.log('删除定时器')
			this.realTimer && clearTimeout(this.realTimer)
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
		getSource(status) {
			return ['--', '自然', '顾问分享名片', '顾问求关注海报', '顾问求线索海报', '顾问求推手海报', '顾问分享商品海报', '顾问自建客户', '客户指定顾问下单', '顾问代下单', '推手分享顾问海报', '推手发布线索', '后台网销导入', '后台外拓导入', '客户扫顾问到店码', '推手分享商品链接', '顾问分享商品链接', '推手分享商品链接', '客户分享商品链接', '客户分享商品海报','手分享商品海报', '客户分享顾问名片',][status]
		},
		getSaleStatusType(status) {
			return ['info', 'success', 'primary', 'info'][status]
		}
	},
    beforeDestroy() {
		console.log('删除定时器')
        this.realTimer && clearTimeout(this.realTimer)
    }
}
</script>