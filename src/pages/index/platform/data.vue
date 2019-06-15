<template>
	<div class="log-record page-container" v-loading='loading'>

		<div class="title boxshadow">
			<span class="left">
				<el-select v-model="queryParams.storeId" size="mini" placeholder="全部销售分组" @change="getData" clearable>
					<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</span>
			<span class="right">
				<el-radio-group v-model="queryParams.dataType" size="mini" class="filters-radio" @change="getData">
					<el-radio-button :label="item.value" :key="item.value" v-for="item in dateList">{{item.label}}</el-radio-button>
				</el-radio-group>
			</span>
		</div>
		<panel style='margin-top: 10px;'>
			<template slot="head">
				<div class="left">实时概况</div>
				<div class="right">更新时间：{{date}}</div>
			</template>
			<div class="content">
				<div class="value">
					<div class="value-top">
						<!-- <div class="value-top-icon">
							<icon-svg icon-class="dealMoney" />
						</div> -->
						<div style="margin-left: 20px;" :style="{background:item.background}" class="value-top-item" v-for="(item,index) in info">
							<div class="item-name">
								<div class="name-icon">
									<icon-svg :icon-class="item.icon" />
								</div>
								<div style="text-align:center;width: 100%;">{{item.name}}</div>
							</div>
							<div class="item-number">{{keepPoints(item.number)}}</div>
						</div>
					</div>
					<div class="value-bottom">
						<div id='form'>

						</div>
					</div>
				</div>
				<div class="data">
					<ul class="list">
						<li class="list-item" v-for="(item,index) in iconList">
							<div class="list-item-icon"  :style="{background:item.bg}">
								<icon-svg :icon-class="item.icon" />
							</div>
							<div class="list-item-data">
								<span>{{keepPoints(item.number)}}</span>
								<div class="data-name">{{item.name}}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</panel>
		<!-- <no-data>开发中....</no-data> -->
		</panel>
	</div>
</template>


<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import {
		queryCountNums
	} from '@/api/platform'
	import {
		getStoreList
	} from '@/api/common'
	import {
		keepPoints
	} from '@/utils/index'
	import {
		queryBarChat
	} from '@/api/bi'
	import echarts from 'echarts'
	export default {
		components: {
			Panel,
			NoData
		},
		data() {
			return {
				keepPoints: keepPoints,
				queryParams: {
					storeId: '',
					dataType: ''
				},
				date: new Date().toLocaleString(),
				saleList: [],
				iconList: [{
					icon: 'rudian',
					number: '',
					name: '进店量（人）',
					bg:'#308BEF'
				}, {
					icon: 'liudang',
					number: '',
					name: '留档量（人）',
					bg:'#FF9801'
				}, {
					icon: 'carIcon',
					number: '',
					name: '试驾量（单）',
					bg:'#1FBC6B'
				}, {
					icon: 'yuding',
					number: '',
					name: '预订量（单）',
					bg:'#EC411B'
				}, {
					icon: 'fanweng',
					number: '',
					name: '平台访客数',
					bg:'#E36CB9'
				}, {
					icon: 'liulan',
					number: '',
					name: '页面浏览量',
					bg:'#9966E3'
				}, {
					icon: 'huiyuan',
					number: '',
					name: '认证会员数',
					bg:'#99B6E3'
				}, {
					icon: 'tuishou',
					number: '',
					name: '申请推手量',
					bg:'#7BD5D4'
				}, {
					icon: 'daili',
					number: '',
					name: '代理量',
					bg:'#7B8D99'
				}, {
					icon: 'xiaoshao',
					number: '',
					name: '网销线索量',
					bg:'#92A563'
				}, {
					icon: 'zhanbai',
					number: '',
					name: '战败量',
					bg:'#58575E'
				}],
				info:  [{
					name: '总成交量',
					number: 0,
					background:'#03cbcb',
					icon:'chengjiao'
				}, {
					'name': '网销成交量',
					number: 0,
					background:'#ffcb02',
					icon:'wangxiao'
				}, {
					'name': '转介绍成交量',
					number: 0,
					background:'#1995da',
					icon:'jieshao'
				}],
				dateList: [{
						label: '今日',
						value: 1
					},
					{
						label: '昨日',
						value: 2
					},
					{
						label: '近7天',
						value: 3
					},
					{
						label: '近15天',
						value: 4
					},
					{
						label: '近30天',
						value: 5
					},
					{
						label: '本月',
						value: 6
					},
					{
						label: '上月',
						value: 7
					},

				],
				loading: false,
				day: [], //日期
				introduceVolumeList: [], //转介绍成交量
				salesVolumeList: [], //网销成交量
				totalVolumeList: [], //总成交量
			}
		},
		async created() {
			this.loading = true;
			this.queryParams.dataType = this.dateList[0].value
			const stores = await getStoreList()
			this.saleList = stores;
			await this.getFromInfo()
			await this.getData()
			this.initChart()

			console.log('created')
		},
		async mounted() {
			console.log('mounted')
		},
		methods: {
			async getFromInfo() {
				const formInfo = await queryBarChat();
				formInfo.titleList.forEach((item, index) => {
					if ((index + 1) % 5 == 0) {
						this.day.push(item)
					}
				})
				this.day.unshift(formInfo.titleList[0])
				this.day.pop();
				this.day.push(formInfo.titleList[formInfo.titleList.length - 1])


				//转介绍
				var introduceVolumeList = {
					first: 0,
					second: 0,
					third: 0,
					fourth: 0,
					fifth: 0,
					sixth: 0
				}
				for (let i = 0; i <= 4; i++) {
					introduceVolumeList.first += formInfo.introduceVolumeList[i]
				}
				for (let i = 5; i <= 9; i++) {
					introduceVolumeList.second += formInfo.introduceVolumeList[i]
				}
				for (let i = 10; i <= 14; i++) {
					introduceVolumeList.third += formInfo.introduceVolumeList[i]
				}
				for (let i = 15; i <= 19; i++) {
					introduceVolumeList.fourth += formInfo.introduceVolumeList[i]
				}
				for (let i = 20; i <= 24; i++) {
					introduceVolumeList.fifth += formInfo.introduceVolumeList[i]
				}
				for (let i = 24; i < formInfo.introduceVolumeList.length; i++) {
					introduceVolumeList.sixth += formInfo.introduceVolumeList[i]
				}
				let introduceList = [introduceVolumeList.first, introduceVolumeList.second, introduceVolumeList.third,
					introduceVolumeList.fourth, introduceVolumeList.fifth, introduceVolumeList.sixth
				]
				introduceList.unshift(formInfo.introduceVolumeList[0])
				this.introduceVolumeList = introduceList
				let introduceNumber = 0;
				introduceList.forEach((item)=>{
					introduceNumber += item
				})
				// console.log(introduceList,salesList,totalList)
				this.info[2].number = introduceNumber
				


				//网销成交量
				var salesVolumeList = {
					first: 0,
					second: 0,
					third: 0,
					fourth: 0,
					fifth: 0,
					sixth: 0
				}
				for (let i = 0; i <= 4; i++) {
					salesVolumeList.first += formInfo.salesVolumeList[i]
				}
				for (let i = 5; i <= 9; i++) {
					salesVolumeList.second += formInfo.salesVolumeList[i]
				}
				for (let i = 10; i <= 14; i++) {
					salesVolumeList.third += formInfo.salesVolumeList[i]
				}
				for (let i = 15; i <= 19; i++) {
					salesVolumeList.fourth += formInfo.salesVolumeList[i]
				}
				for (let i = 20; i <= 24; i++) {
					salesVolumeList.fifth += formInfo.salesVolumeList[i]
				}
				for (let i = 24; i < formInfo.salesVolumeList.length; i++) {
					salesVolumeList.sixth += formInfo.salesVolumeList[i]
				}
				let salesList = [salesVolumeList.first, salesVolumeList.second, salesVolumeList.third, salesVolumeList.fourth,
					salesVolumeList.fifth, salesVolumeList.sixth
				]
				salesList.unshift(formInfo.salesVolumeList[0])
				this.salesVolumeList = salesList
				let salesNumber = 0;
				salesList.forEach((item)=>{
					salesNumber += item
				})
				// console.log(introduceList,salesList,totalList)
				this.info[1].number = salesNumber
				


				//总成交量
				var totalVolumeList = {
					first: 0,
					second: 0,
					third: 0,
					fourth: 0,
					fifth: 0,
					sixth: 0
				}
				for (let i = 0; i <= 4; i++) {
					totalVolumeList.first += formInfo.totalVolumeList[i]
				}
				for (let i = 5; i <= 9; i++) {
					totalVolumeList.second += formInfo.totalVolumeList[i]
				}
				for (let i = 10; i <= 14; i++) {
					totalVolumeList.third += formInfo.totalVolumeList[i]
				}
				for (let i = 15; i <= 19; i++) {
					totalVolumeList.fourth += formInfo.totalVolumeList[i]
				}
				for (let i = 20; i <= 24; i++) {
					totalVolumeList.fifth += formInfo.totalVolumeList[i]
				}
				for (let i = 24; i < formInfo.totalVolumeList.length; i++) {
					totalVolumeList.sixth += formInfo.totalVolumeList[i]
				}
				let totalList = [totalVolumeList.first, totalVolumeList.second, totalVolumeList.third, totalVolumeList.fourth,
					totalVolumeList.fifth, totalVolumeList.sixth
				]
				
				totalList.unshift(formInfo.totalVolumeList[0])
				let totalNumber = 0;
				totalList.forEach((item)=>{
					totalNumber += item
				})
				// console.log(introduceList,salesList,totalList)
				this.info[0].number = totalNumber
				this.totalVolumeList = totalList
				
				console.log(this.info)
			},
			async getData() {
				this.loading = true;
				let res = await queryCountNums(this.queryParams)
// 				this.info = [{
// 					name: '总成交量',
// 					number: res.totalVolume,
// 					background:'rgba(0, 204, 204, 1)',
// 					icon:'chengjiao'
// 				}, {
// 					'name': '网销成交量',
// 					number: res.salesVolume,
// 					background:'#ffcc00',
// 					icon:'wangxiao'
// 				}, {
// 					'name': '转介绍成交量',
// 					number: res.introduceVolume,
// 					background:'#308BEF',
// 					icon:'jieshao'
// 				}]
				this.iconList[0].number = res.intoShopNum;
				this.iconList[1].number = res.keepFileNum;
				this.iconList[2].number = res.testDriveNum;
				this.iconList[3].number = res.reservationNum;
				this.iconList[4].number = res.visitorsNum;
				this.iconList[5].number = res.browseNum;
				this.iconList[6].number = res.certificationVipNum;
				this.iconList[7].number = res.pushHandNum;
				this.iconList[8].number = res.agentNum;
				this.iconList[9].number = res.salesCluesNum;
				this.iconList[10].number = res.defeatNum;
				this.loading = false;
			},
			initChart() {
				// console.log(this.day)
				// 基于准备好的dom，初始化echarts实例
				// console.log(document.getElementById('form'))
				let myChart = echarts.init(document.getElementById('form'));


				// console.log([...arr], Array.isArray(arr))
				let option = {
					legend: {
						data: [{
								name: '总成交量',
								textStyle: {
									color: '#03cbcb'
								}
							},
							{
								name: '网销成交量',
								// 设置文本为红色
								textStyle: {
									color: '#ffcb02'
								}
							},
							{
								name: '转介绍成交量',
								// 设置文本为红色
								textStyle: {
									color: '#1995da'
								}
							}
						]
					},
					color: ['#03cbcb', '#ffcb02', '#1995da'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: [{
						// this.day["5日","10日","15日","20日","25日","30日"]
						type: 'category',
						data: this.day,
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							name: '总成交量',
							type: 'line',
							barWidth: '60%',
							lineStyle: {
								color: 'rgb(0, 204, 204)'
							},
							data: this.totalVolumeList
						},
						{
							name: '网销成交量',
							type: 'line',
							barWidth: '60%',
							lineStyle: {
								color: 'rgb(255, 204, 0)'
							},
							data: this.salesVolumeList
						},
						{
							name: '转介绍成交量',
							type: 'line',
							barWidth: '60%',
							lineStyle: {
								color: 'rgb(48, 139, 239)'
							},
							data: this.introduceVolumeList
						},
					]
				};

				this.$nextTick(_ => {
					myChart.setOption(option)

				})

				//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
				window.addEventListener('resize', function() {
					myChart.resize()
				});
			},
		}
	}
</script>
<style lang="scss">
	.name-icon{
		svg{
			width: 100% !important;
			height: 100% !important;
		}
	}
</style>
<style scoped="scoped" lang="scss">
	
	#form {
		height: 300px;
	}

	.title {
		display: flex;
		background: #fff;
		padding: 10px 15px;
		justify-content: space-between;
		align-items: center;
	}

	.content {
		padding-top: 10px;
		display: flex;
		// justify-content: space-between;

		.data {

			.list {
				width: 550px;
				display: flex;
				flex-wrap: wrap;

				.list-item {
					display: flex;
					width: 160px;
					overflow: hidden;
					margin-bottom: 30px;
					border-radius: 5px;
					 box-shadow: 0 0 5px rgba(0,0,0,.2);
					 margin-right: 10px;
					.list-item-icon {
						width: 45px;
						height: 100%;
						background: aqua;
						display: flex;
						justify-content: center;
						align-items: center;
						svg {
							width: 20px;
							height: 20px;
						}
					}

					.list-item-data {
						padding-top: 10px;
						margin-left: 5px;
						text-align: center;
						flex: 1;
						.data-name {
							font-size: 12px;
						}

						span {
							font-size: 22px;
							font-weight: 600;
						}
					}
				}
			}

		}


		.value {
			flex: 1;
			padding-right: 20px;
			.value-top {
				display: flex;
				align-items: center;
				justify-content: center;
				.value-top-item{
					color: #fff;
					width: 150px;
					border-radius: 5px;
					opacity: .9;
					.item-name{
						display: flex;
						align-items: center;
						border-bottom: .5px solid #fff;
						font-size: 12px;
						padding: 5px 10px;
						position: relative;
						.name-icon{
							width: 20px;
							height: 20px;
							position: absolute;
							top: 5px;
							left: 10px
						}
					}
					.item-number{
						padding: 10px 0 20px;
						font-size: 18px;
						font-weight: 600;
						text-align: center;
					}
				}
				.value-top-icon {
					width: 50px;
					height: 50px;

					svg {
						width: 100%;
						height: 100%;
					}
				}

				p {
					font-size: 16px;
					padding-bottom: 10px;
				}

				span {
					font-weight: 600;
					font-size: 22px;
				}
			}

			.value-bottom {
				width: 100%;
				margin-top: 20px;

				#from {
					width: 100%;
				}
			}
		}

	}
</style>
