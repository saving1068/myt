<template>
    <div class="test-drive boxshadow">

        <div class="test-drive-filter">
            <div class="test-drive-filter__item">
                <label class="title">筛选：</label>
                <el-select v-model="queryParams.querySource" size="mini" placeholder="用户来源" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in sourceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="queryParams.queryType" size="mini" placeholder="下单方式" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in orderTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="queryParams.queryStatus" size="mini" placeholder="订单状态" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="queryParams.queryBrandId" size="mini" placeholder="按车系" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="queryParams.queryStoreId" size="mini" placeholder="全部销售分组" clearable @change="getStore" class="selects">
                    <el-option
                        v-for="item in storeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="queryParams.queryAdviserId" size="mini" placeholder="全部顾问" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in adviserList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
				<el-select v-model="queryParams.distributionType" size="mini" placeholder="全部试驾单" clearable @change="initData" class="selects">
				    <el-option
				        v-for="item in distribution"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				    </el-option>
				</el-select>
            </div>

            <div class="test-drive-filter__item">
                <label class="title">时间：</label>

                <el-select v-model="queryParams.queryTimeMode" size="mini" placeholder="时间方式" clearable @change="initData" class="selects">
                    <el-option
                        v-for="item in timeModeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <el-radio-group v-model="queryParams.queryTimeType" size="mini" class="filters-radio" @change="dateChange">
                    <el-radio-button :label="item.value" :key="item.value" v-for="item in dateList">{{item.label}}</el-radio-button>
                </el-radio-group>

                <el-date-picker
                    style="margin:0 0 0 20px;"
                    v-model="dateTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    size="mini"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="pickerChange"
                >
                </el-date-picker>
            </div>
            <div class="test-drive-filter__item">
                <label class="title">搜索：</label>
                <el-input v-model="queryParams.queryKeywords" size="mini" clearable @clear="initData" placeholder="输入关键字" style="width: 300px;">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button type="warning" :loading="tableLoading" size="mini" icon="el-icon-search" class="ml15" @click="initData">查询</el-button>
                <el-button type="primary" size="mini" class="ml15" plain @click="reset">重置</el-button>
            </div>
        </div>

        <panel class="data-box">
            <template slot="head">
                <div class="left">
                    订单数据总览
                </div>
                <div class="right data-total">
                    <div class="data-total__time">启用时间 {{statisticsInfo.enableTime}}</div>
                    <div class="data-total__content">
                        <div class="data-total--item">
                            <div class="title">总预约试驾用户</div>
                            <div class="num">{{statisticsInfo.keyone | formatNum}}</div>
                        </div>
                        <div class="data-total--item">
                            <div class="title">总实际试驾用户</div>
                            <div class="num">{{statisticsInfo.keytwo | formatNum}}</div>
                        </div>
                    </div>
                </div>
            </template>
            
            <div class="test-drive__content">
                <box class="table-box">
                    <div class="table-box-head flex justify-content-spacebetween align-items-center" slot="head">
                        <div class="left" style="font-size:16px">相关报表</div>
                        <div class="right">
                            <el-button type="warning" size="mini" @click="exportExcel">导出报表</el-button>
                        </div>
                    </div>

                    <el-table :data="tableData" ref="table" fit class="tableList" style="width:100%;" v-loading="tableLoading">
                        <el-table-column prop="realName" label="客户姓名" width="120" align="center" />
                        <el-table-column prop="mobile" label="客户手机" width="120" align="center" />
                        <el-table-column prop="levelId" label="意向" width="80" align="center" />
                        <el-table-column prop="source" label="客户来源" width="120" align="center" />
                        <!-- <el-table-column prop="意向" label="所属推手" width="180" align="center" /> -->
                        <el-table-column label="接单顾问" width="120" align="center">
                            <template slot-scope="scope">
                                {{scope.row.adviserName}}<br />
                                {{scope.row.adviserMobile}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="storeName" label="接单分组" min-width="120" align="center" />
						 <el-table-column label="是否有推手" width="120" align="center">
						    <template slot-scope="scope">
						    	<div v-if="!scope.row.pushHandMobile&&!scope.row.pushHandName">
						    		--
						    	</div>
						    	<div v-else>
						    		{{scope.row.pushHandName}}<br />
						    		{{scope.row.pushHandMobile}}
						    	</div>
						    </template>
						</el-table-column>
						 <el-table-column label="是否有代理" width="120" align="center">
						    <template slot-scope="scope">
								<div v-if="!scope.row.agentMobile&&!scope.row.agentName">
									--
								</div>
								<div v-else>
									{{scope.row.agentName}}<br />
									{{scope.row.agentMobile}}
								</div>
						        
						    </template>
						</el-table-column>
						<el-table-column prop="distributionType" label="分销类型" min-width="120" align="center" />
                        <el-table-column prop="ordersId" label="订单号" align="center" />
                        <el-table-column label="车系车型" min-width="180" align="center">
                            <template slot-scope="scope">
                                {{scope.row.brandName}}
                                {{scope.row.carTypeName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="下单时间" width="100" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.placeOrderDay">
                                    {{scope.row.placeOrderDay}}<br>
                                    {{scope.row.placeOrderHour}}
                                </span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                       <!-- <el-table-column label="预约时间" width="100" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.testDriveDay">
                                    {{scope.row.testDriveDay}}<br>
                                    {{scope.row.testDriveHour}}
                                </span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="试驾时间" width="100" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.testDriveDay">
                                    {{scope.row.testDriveDay}}<br>
                                    {{scope.row.testDriveHour}}
                                </span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态" width="100" align="center">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.orderStatus | getType">
                                    {{scope.row.orderStatusDesc}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="下单方式" width="120" align="center">
                            <template slot-scope="scope">
                                {{scope.row.type == 1 ? '顾问代下单' : '客户下单'}}
                            </template>
                        </el-table-column>
						<el-table-column label="预计分佣金额" prop="welfareAmount"   align="center">
						   <!-- <template slot-scope="scope">
						        {{scope.row.type == 1 ? '顾问代下单' : '客户下单'}}
						    </template> -->
						</el-table-column>
                    </el-table>
                </box>
            </div>

            <div class="flex justify-content-end mt15">
                <el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.pageNo" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </panel>

    </div>


</template>


<script>
import Panel from '@/components/Panel'
import Box from '@/components/Box'

import {getDictInfos, getStoreList, getAdviserList, getSaleBrandDtos} from '@/api/common'
import {testdriveList, getOrderStatistics} from '@/api/bi'
import tableHeaderSticky from '@/mixins/table_header_sticky'
import excel from '@/utils/excel'

const defaultParams = {
    querySource: '',
    queryType: '',
    queryStatus: '',
    queryBrandId: '',
    queryStoreId: '',
    queryAdviserId: '',
    queryTimeType: 3,
    queryTimeMode: '',
    queryStartDate: '',
    queryEndDate: '',
    queryKeywords: '',
    pageNo: 1,
    pageSize: 10,
	distributionType:'',
}

export default {
    components: {Panel, Box},
    mixins: [tableHeaderSticky],
    data() {
        return {
			distribution:[
				{label: '顾问单', value: 1},
				{label: '推手单', value: 2},
				{label: '代理直推单', value: 3},
			],
            statisticsInfo: '',
            sourceList: [
                {label: '网销', value: 1},
                {label: '到店码', value: 2},
                {label: '外拓', value: 3},
                {label: '分配', value: 4},
                {label: '顾问自主拉新', value: 5},
                {label: '自然流入', value: 6},
                {label: '推手拉新', value: 7},
            ],
            orderTypeList: [
                {label: '顾问代下单', value: 1},
                {label: '客户下单', value: 2},
            ],
            // ['未知', '已下单', '未到店', '已选车', '已取消', '已到店', '已成交', '已取消', '未成交', '已退车'][state || 0]
            statusList: [
                {label: '未到店', value: 2},
                {label: '已到店', value: 5},
                {label: '已取消', value: 7},
            ],
            brandList: [],
            storeList: [],
            adviserList: [],
            timeModeList: [
                {label: '下单时间', value: 1},
                {label: '预约时间', value: 2},
                {label: '试驾时间', value: 3},
            ],
            dateList: [
                {label: '今日', value: 2},
                {label: '昨日', value: 1},
                {label: '近7天', value: 3},
                {label: '近30天', value: 6},
                // {label: '本月', value: 4},
                // {label: '上月', value: 5},
            ],
            
            dateTime: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },

            tableLoading: false,
            tableData: [],

            queryParams: {...defaultParams},
            total: 0,
        }
    },
    async created() {
        this.$loading.show()
        
        try {
            const [brands, stores, statistics] = await Promise.all([
                getSaleBrandDtos(),
                getStoreList(),
                getOrderStatistics({orderType: 1})
            ])

            this.brandList = brands
            this.storeList = stores
            this.statisticsInfo = statistics
			
			const query = this.$route.query
			
			
			if(query.storeId){
				this.queryParams.queryStoreId = query.storeId;
				const adviserList = await getAdviserList({sellerStoreId:this.queryParams.queryStoreId});
				this.adviserList = adviserList;
				this.queryParams.queryAdviserId = query.adviserId;
				console.log(this.queryParams)
			}
			

            this.getData()
        } catch (error) {
            
        }

        this.$loading.hide()
    },

    methods: {
        async getData(e) {
            this.$loading.show()
            this.tableLoading = true

            try {
                const res = await testdriveList(this.queryParams)
                this.tableData = res.items
                this.total = res.total
            } catch (error) {
                
            }

            this.tableLoading = false
            this.$loading.hide()
        },
        initData() {
            this.queryParams.pageNo = 1
            this.getData()
        },
        // 门店
        async getStore(storeId) {
            this.queryParams.queryAdviserId = ''
            const adviserList = await getAdviserList({sellerStoreId:storeId})
            this.adviserList = adviserList
            
            this.initData()
        },
        // 时间选择
        dateChange(e) {
            this.dateTime = ''
            this.queryParams.queryStartDate = ''
            this.queryParams.queryEndDate = ''
            this.initData()
        },
        // 时间筛选
        pickerChange(d) {
            if(d){
                this.queryParams.queryTimeType = ''
                this.queryParams.queryStartDate = d[0]
                this.queryParams.queryEndDate = d[1]
            }else{
                this.queryParams.queryStartDate = ''
                this.queryParams.queryEndDate = ''
                this.queryParams.queryTimeType = 3
            }
            this.initData()
        },
        handleSizeChange(pageSize) {
            this.queryParams.pageSize = pageSize;
            this.queryParams.pageNo = 1;
            this.getData();
        },
        handleCurrentChange(pageNum) {
            this.queryParams.pageNo = pageNum;
            this.getData();
        },
        reset() {
            this.dateTime = ''
            this.tableLoading = false
            this.queryParams = {...defaultParams}
            this.getData()
        },
        async exportExcel() {

            this.$loading.show('正在导出中...')
            try {
                const res = await testdriveList({loadMode: 1, ...this.queryParams})
                const list = res.items.map(v => {
                    v.orderType = v.type == 1 ? '顾问代下单' : '客户下单'
                    return v
                })

                 if (list.length) {
                    const params = {
                        title: ['客户姓名', '客户手机', '意向', '客户来源', '接单顾问', '顾问手机', '接单门店', '订单号', '车系车型', '下单时间', '预约时间', '试驾时间', '订单状态', '下单方式'],
                        key: ['realName', 'mobile', 'levelId', 'source', 'adviserName', 'adviserMobile', 'storeName', 'ordersId', 'brandName,carTypeName', 'placeOrderDay,placeOrderHour', 'testDriveDay,testDriveHour', 'signTimeDay,signTimeHour', 'orderStatusDesc', 'orderType'],
                        data: list,
                        autoWidth: true,
                        filename: '试驾单报表'
                    }
                    excel.export_array_to_excel(params)
                } else {
                    this.$Message.info('表格数据不能为空！')
                }
            } catch (error) {
                
            }
            this.$loading.hide()
        }
    },
    filters: {
        getType(status = 0) {
            return ['info', 'primary', 'warning', 'primary', 'info', 'success', 'success', 'info', 'warning', 'danger'][status]
        },
        formatNum(num) {
            let n = num
            if(num >= 10000){
                n = (num / 10000).toFixed(1) + '万'
            }
            return n
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../../../../styles/var.scss';

.test-drive {
    background: #fff;
    
    &-filter {
        padding:15px;
        border-bottom:1px solid $borderColor;

        &__item {
            display: flex;
            align-items: center;

            &:not(:first-child) {
                margin-top:15px;
            }

            .selects {
                width:120px;
                margin-right:15px;
            }

            .title {
                width:60px;
                margin-right: 10px;
                text-align: right;
                color:#999;
            }
        }
    }

    .data-box {
        margin-top:10px;
        box-shadow: none;

        .data-total {
            display: flex;
            align-items: flex-end;

            &__time {
                margin-right: 20px;
                color:#999;
            }
            &__content {
                display: flex;
            }
            &--item {
                padding:5px 10px;
                margin-left:5px;
                background: $orange;
                color:#333;
                .title {
                    margin-right: 50px;
                }
                .num {
                    font-size: 20px;
                    text-align: right;
                }
            }
        }
    }
}
</style>


<style lang="scss">
.data-box .app-panel__head {
    padding-bottom: 0!important;
}

.table-box .app-box__content {
    padding-left:0!important;
    padding-right: 0!important;
}
</style>
