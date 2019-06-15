<template>
    <div class="staff-library">
        
        <panel class="staff-content">
            <template slot="head">
                <div class="left flex">
                    <el-select v-model="queryParams.storeId" size="mini" clearable placeholder="全部销售分组" @change="changeStore" style="width:130px">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.adviserId" size="mini" clearable placeholder="全部顾问" @change="getData" style="width:120px;margin-left:15px;">
                        <el-option
                            v-for="item in adviserList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.sortType" size="mini" placeholder="选择排序" @change="getData" style="max-width:140px;margin-left:15px;">
                        <el-option
                            v-for="item in sortList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParams.source" size="mini" clearable placeholder="全部来源" @change="getData" style="width:120px; margin-left:15px">
                        <el-option
                            v-for="item in sourceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
					<el-select v-model="queryParams.agentId" size="mini" clearable placeholder="全部代理商" @change="getData" style="width:120px; margin-left:15px">
					    <el-option
					        v-for="item in agentList"
					        :key="item.value"
					        :label="item.name"
					        :value="item.id">
					    </el-option>
					</el-select>
                    <el-input placeholder="输入推手名称、手机" v-model="queryParams.keyVal" style="width:210px; margin:0 15px;" size="mini" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                    </el-input>
                </div>
            </template>
            <div class="staff-adviser__content">
                <el-table :data="pusherList" fit style="width: 100%" v-loading="loading" :height="sideHeight">
                    <el-table-column prop="source" label="来源" width="80" align="center" />
					<el-table-column label="是否代理商推手" width="150" align="center">
					    <template slot-scope="scope">
					       <!-- <div class="flex align-items-center justify-content-center">
					            <img :src="setImgPath(scope.row.avatarUrl)" width="30" height="30" class="radius" /> 
					            <span class="ml5">{{scope.row.name}}</span>
					        </div> -->
							<div v-if="scope.row.agentMobile&&scope.row.agentName">
								<div>{{scope.row.agentName}}</div>
								<div>{{scope.row.agentMobile}}</div>
							</div>
							<div v-else>否</div>
					    </template>
					</el-table-column>
                    <el-table-column label="推手信息" width="220" align="center">
                        <template slot-scope="scope">
                            <div class="flex align-items-center justify-content-center">
                                <img :src="setImgPath(scope.row.avatarUrl)" width="30" height="30" class="radius" /> 
								<span class="ml5" v-if="scope.row.name&&!scope.row.nickName">{{scope.row.name}}</span>
								<span class="ml5" v-if="scope.row.name&&scope.row.nickName">{{scope.row.name}}丨{{scope.row.nickName}}</span>
                                <span class="ml5" v-if="scope.row.nickName&&!scope.row.name">{{scope.row.nickName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="storeName" label="所属销售分组" min-width="120" align="center" />
                    <el-table-column prop="advName" label="所属顾问" width="120" align="center" />
                    <el-table-column prop="mobile" label="注册手机" width="120" align="center" />
                    <el-table-column label="注册时间" width="150" align="center">
                        <template slot-scope="scope">
                            {{scope.row.dayTime}}<br>
                            {{scope.row.hourTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="customerNun" label="客户量" width="100" align="center" />
                    <el-table-column prop="targetDealTotal" label="成交量" width="100" align="center" />
					 <el-table-column prop="reflect" label="已提现" width="100" align="center" />
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <div class="operate">
                                <span v-if="isBtnPower('05020116')"@click="previewCode(scope.row)">档案</span>
                                <span v-if="isBtnPower('080101')" @click="toCustomerList(scope.row)">下线客户</span>
                                <!-- <span v-if="isBtnPower('080101')">订单</span> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex justify-content-end mt15">
                    <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </panel>

        <qr-code-dialog :visible.sync="qrcodeDialogVisible" :title="qrcodeTitle" :user-info="qrcodeUserInfo" :src="qrcodePath"></qr-code-dialog>

    </div>
</template>

<script>
import Panel from '@/components/Panel'
import Sticky from '@/components/Sticky'
import QrCodeDialog from '@/components/QrCodeDialog'
import power from '@/mixins/power'

import {setImgPath, queryParams} from '@/utils'

import {getStoreList, getAdviserList, } from '@/api/common'
import {getPreviewCode} from '@/api/customer'
import {getPushHands,sellerAgentList,adviserList} from '@/api/staff'

export default {
    components: {Panel, Sticky, QrCodeDialog},
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
			showArchives:true,
            storeList: [],
            adviserList: [],
			agentListName:[],
            sourceList: [
                { value: '', label: '全部来源'},
                { value: 1, label: '网销'},
                { value: 2, label: '到店'},
                { value: 3, label: '外拓'},
                { value: 4, label: '分配'},
                { value: 5, label: '推手'},
                { value: 6, label: '顾问'},
                { value: 7, label: '自然'},
            ],
			agentList:[
			],

            sortList: [
                {value: 1, label: '按下线客户量	'}, 
                {value: 2, label: '按最新注册时间'}, 
                {value: 3, label: '按成交量'}
            ],

            loading: false,
            pusherList: [],
            total: 0,
            queryParams: {
                storeId: '',
                adviserId: '',
                source: '',
                sortType: 1,
                keyVal: '',
                pageSize: 10,
                curPage: 1,
				agentId:''
            },
            setImgPath: setImgPath,

            qrcodeDialogVisible: false,
            qrcodeTitle: '',
            qrcodePath: '',
            qrcodeUserInfo: {},
        }
    },
    async created() {
       

        try {
            await this.getPower('080101','05020116')
			 this.$loading.show()
			 this.loading = true
            const {storeId, adviserId,agentId} = this.$route.query
            const urlParams = queryParams()
			
            const stores = await getStoreList()//销售分组
			console.log(stores)
            this.storeList = stores;
			const agentList  = await sellerAgentList()//全部代理商
			 this.agentList = agentList;
            // istop防止参数互串
            if(!urlParams.istop && storeId && stores.find(v => v.id == storeId)){
                this.queryParams.storeId = storeId
				
            }

            if(!urlParams.istop && this.queryParams.storeId && adviserId){
				
                const staff = await adviserList({sellerStoreId:storeId})//全部顾问
                this.queryParams.adviserId = adviserId
                this.adviserList = staff
            }
			if(agentId){
			    this.queryParams.agentId = agentId
			}

            this.getData()
        } catch (error) {
            console.error(error)
        }

        this.$loading.hide()
    },
    methods: {
        async getData() {
            try {
                this.loading = true
				console.log({...this.queryParams})
                const res = await getPushHands({...this.queryParams})
                this.pusherList = res.items
                this.total = res.total
            } catch (error) {
                
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
                    const staff = await adviserList({sellerStoreId:storeId})
                    this.adviserList = staff
                }
                this.getData()
            } catch (error) {
                
            }
        },
        // 档案二维码
        async previewCode(item) {
            this.qrcodeTitle = '查看客户档案推手'
            
            this.$loading.show()
            try {
                const res = await getPreviewCode({userId: item.userId})
                if(!res.length){
                    this.$loading.hide()
                    return this.$message.error('没找到生成二维码')
                }
                this.qrcodeUserInfo = {name: item.name, mobile: item.mobile}
                this.qrcodePath = res
                this.qrcodeDialogVisible = true
            } catch (error) {
                console.error(error)
            }
            this.$loading.hide()

            
        },
        // 客户库
        toCustomerList(item) {
            this.$router.push({
                name: 'customerList',
                query: {
                    storeId: item.storeId,
                    adviserId: item.adviserId,
                    pushHandId: item.id
                }
            })
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
        getStatus(status = 0){
            if(status !== 1){
                return '启用'
            }else{
                return '停用'
            }
        }
    }
}
</script>

