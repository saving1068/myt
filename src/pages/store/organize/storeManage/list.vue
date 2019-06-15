<template>
	<div class="store-list page-container">
		<panel>
			<template slot="head">
				<span class="left">销售分组</span>
				<div class="right">
					<!-- <el-button type="info" size="mini">门店BI数据</el-button> -->
					<el-button type="warning" size="mini" v-if="isBtnPower('05020203')" @click="$router.push({name: 'addStore'})">创建分组</el-button>
				</div>
			</template>

			<el-table :data="storeList" style="width: 100%" :height="sideHeight" v-loading="loading">
				<el-table-column prop="name" label="组长信息" min-width="150" align="center">
					<template slot-scope="scope">
						<div class="flex" style="align-items: center;justify-content: center;">
							<div class="infoPic" v-if="scope.row.avatarUrl">
								<img :src='setImgPath(scope.row.avatarUrl)'>
							</div>
							<div class="infoName" style="padding-left: 5px;">
								<div>
									<span v-if="scope.row.userName"> {{scope.row.userName}}丨</span>
									<span v-if="scope.row.nickName">{{scope.row.nickName}}</span>
								</div>
								<div v-if="scope.row.mobile">{{scope.row.mobile}}</div>
							</div>
						</div>
						<div v-if='!scope.row.userName&&!scope.row.nickName'>--</div>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="销售分组名称" width="120" align="center" />
				<el-table-column prop="adviserNum" label="管理顾问账号" align="center" />
				<el-table-column prop="customerNum" label="客户总数" align="center" />
				<el-table-column label="状态" width="100" align="center">
					<template slot-scope="scope">
						<el-tag size="small" v-if='scope.row.status||scope.row.status==0' :type="scope.row.status | getTypeStatus">{{scope.row.status | getStoreStatus}}</el-tag>
						<el-tag size="small" v-else :type="scope.row.stautsStr | getTypeStautsStr">{{scope.row.stautsStr}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间	" align="center">
					<template slot-scope="scope">
						{{scope.row.dayTime}} <br>{{scope.row.hourTime}}
					</template>
				</el-table-column>
				<el-table-column prop="adviserNum" label="当月目标" align="center" >
					<template slot-scope="scope">
						<div v-if="scope.row.targetDealTotal&&scope.row.targetDealFx">
							<div>总成交 {{scope.row.targetDealTotal}}</div>
							<div>分销成交 {{scope.row.targetDealFx}}</div>
						</div>
						<div v-else>--</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="250">
					<template slot-scope="scope">
						<div class="operate">
							<span v-if="scope.row.status == 0" @click="checkAccount(scope.row)">审核</span>
							<div v-if="scope.row.status">
								<!-- <span v-if="isBtnPower('05020201')" @click="setStatus(scope.row)">{{scope.row.status | getStatus}}</span> -->
								<span v-if="isBtnPower('05020201')&&scope.row.status !=2" @click="setStatus(scope.row)">停用</span>
								<!-- <span v-if="scope.row.status == 0" @click="">审核</span> -->
								<span v-else-if="scope.row.status == 3">审核未通过</span>
							</div>
							<template v-if="scope.row.status != 0">
								<span v-if="isBtnPower('05020204')" @click="editStore(scope.row.id)">编辑</span>
								<span @click="getTaget(scope.row)">设置月目标</span>
								<span v-if="isBtnPower('05020202')" @click="downGroupCode(scope.row)">下载分组码</span>
								<!-- <span v-if="isBtnPower('05020206')" @click="revoke(scope.row)">撤销分组</span> -->
								<!-- <span v-if="isBtnPower('05020101')" @click="toAdviser(scope.row.id)">查看团队</span> -->
								<span @click="toAdviser(scope.row.id,'adviser')">顾问团队</span>
								<span @click="toAdviser(scope.row.id,'pushHander')">推手</span>
								<span @click="goTo('customerManage',scope.row)">客户</span>
								<span v-if="isBtnPower('05020210')" @click="toOrderData(scope.row,'testDrive')">试驾单</span>
								<span v-if="isBtnPower('05020211')" @click="toOrderData(scope.row,'selectCar')">选车单</span>
								<!-- <span @click="toAdviser(scope.row.id,'adviser')">订单</span> -->
								<span v-if="isBtnPower('05020105')">登录日志</span>
							</template>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="flex justify-content-end mt15">
				<el-pagination background layout="prev, pager, next" :page-size="queryParams.pageSize" :current-page.sync="queryParams.curPage"
				 :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
			</div>
		</panel>

		<el-dialog title="设置月目标" :visible.sync="taget" width="500px" class='tagetBox'>
			<div class="tagetTop">
				<span class="tips">设定销售分组的销售目标，如下：</span>
				<div class="tagetVal"><span class="valTxt">每月，总成交单量目标：</span>
					<el-input-number :min='0' v-model="tagetInfo.targetDealTotal" size="mini"></el-input-number>
				</div>
				<div class="tagetVal"><span>每月，转介绍（分销）成交单量目标：</span>
					<el-input-number :min='0' v-model="tagetInfo.targetDealFx" size="mini"></el-input-number>
				</div>
				<span class="tips">如，不做修改，则沿用每月进度数据统计中</span>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="taget = false">取 消</el-button>
				<el-button type="primary" v-if="!editTagetBtn" @click="setTaget">确 定</el-button>
				<el-button type="primary" v-else @click="editTaget">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog :visible.sync="groupCode" width="500px">
			<div slot="title">
				「{{groupInfo.name}}」的「{{managerInfo.codeDesc}}」和「{{adviserInfo.codeDesc}}」
			</div>
			<div class="flex justify-content-center">
				<div class="groupCode">
					<div class="groupCodeName">{{managerInfo.codeDesc}}</div>
					<div class="groupCodeValue">
						<img :src='setImgPath(managerInfo.codePath)'>
					</div>
					<div class="groupCodeDown">
						<el-button type="primary" @click='downManagerQrcode' size="mini">下载</el-button>
					</div>
				</div>
				<div class="groupCode">
					<div class="groupCodeName">{{adviserInfo.codeDesc}}</div>
					<div class="groupCodeValue">
						<img :src='setImgPath(adviserInfo.codePath)'>
					</div>
					<div class="groupCodeDown">
						<el-button type="primary" @click='downAdviserInfoQrcode' size="mini">下载</el-button>
					</div>
				</div>
			</div>
			<!-- <span slot="footer" class="dialog-footer">
			<el-button @click="groupCode = false">取 消</el-button>
		  </span> -->
		</el-dialog>

		<qr-code-dialog :visible.sync="qrCodeDialogVisible" :title="qrCodeTitle" :src="qrCodePath">
			<a :href="setImgPath(this.storeInfo.codeUrl)" target="_blank">
				<el-button type="primary">下载</el-button>
			</a>
		</qr-code-dialog>
		

	</div>
</template>


<script>
	import Panel from '@/components/Panel'
	import QrCodeDialog from '@/components/QrCodeDialog'
	import {
		setImgPath
	} from '@/utils'
	import {
		storeList,
		stopStatus,
		querySellerQrcode,
		querySellerStorePlan,
		addSellerStorePlan,
		editStoreTarget,
		repealStore,
		auditStatus
	} from '@/api/store'

	import power from '@/mixins/power'

	export default {
		components: {
			Panel,
			QrCodeDialog
		},
		computed:{
				sideHeight(){
		// 			console.log(111)
		// 			console.log(this.$store.state.getContentSize)
						return this.$store.state.getContentSize -120
				}
				},
		mixins: [power],
		data() {
			return {
				
				
				taget: false,
				tagetInfo: {
					targetDealTotal: 0,
					targetDealFx: 0,
				},
				editTagetBtn: false,

				groupCode: false,
				managerInfo: {},
				adviserInfo: {},
				groupInfo: {},

				storeList: [],
				btnPower: {},
				loading: true,
				qrCodeDialogVisible: false,
				qrCodePath: '',
				qrCodeTitle: '',
				storeInfo: '',

				total: 0,
				queryParams: {
					curPage: 1,
					pageSize: 10,
				},
				setImgPath: setImgPath,
			}
		},
		async created() {
			await this.getPower('05020203,05020204,05020201,05020101,05020202,05020206,05020211,05020210')
			this.getData()
		},
		methods: {
			toOrderData(item,type){//Bi报表
			console.log(item)
				this.$router.push({
				    name: 'orderData',
				    query: {
				        activeName: type,
						storeId:item.id,
				    }
				})
			},
			goTo(place,item) {
				console.log(item)
				this.$router.push({
					name: place,
					query:{
						storeId:item.id
					}
				})
			},
			async getData() {
				try {
					const params = { ...this.queryParams
					}
					const res = await storeList(params)
					this.total = res.total

					this.storeList = res.items
				} catch (error) {
					this.$message.error(JSON.stringify(error))
				}
				this.loading = false
			},
			editStore(id) {
				this.$router.push({
					name: 'editStore',
					query: {
						id
					}
				})
			},
			downManagerQrcode() {
				const a = document.createElement("a"); // 生成一个a元素
				const event = new MouseEvent("click"); // 创建一个单击事件
				a.download = "photo"; // 设置图片名称
				a.href = setImgPath(this.managerInfo.codePath); // 将生成的URL设置为a.href属性
				a.dispatchEvent(event);

				this.qrCodeDialogVisible = false
			},
			downAdviserInfoQrcode() {
				const a = document.createElement("a"); // 生成一个a元素
				const event = new MouseEvent("click"); // 创建一个单击事件
				a.download = "photo"; // 设置图片名称
				a.href = setImgPath(this.adviserInfo.codePath); // 将生成的URL设置为a.href属性
				a.dispatchEvent(event);

				this.qrCodeDialogVisible = false
			},
			async downGroupCode(item) {
				this.groupInfo = { ...item
				};
				try {
					let managerInfo = await querySellerQrcode({
						storeId: item.id,
						type: 12
					});
					let adviserInfo = await querySellerQrcode({
						storeId: item.id,
						type: 1
					})
					this.managerInfo = { ...managerInfo
					};
					this.adviserInfo = { ...adviserInfo
					};
					this.groupCode = true;
				} catch (e) {
					//TODO handle the exception
				}

			},
			async revoke(item) {
				const txt = '撤销分组';
				const tips = `您确认撤销【${item.name}】分组?`;
				const sureTxt = '撤销';
				this.$confirm(tips, `${txt}`, {
					confirmButtonText: sureTxt,
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await repealStore({
						id: item.id
					})
					this.$message.success(`撤销成功`)
					this.getData()
				}).catch(_ => {

				})

			},

			initTagetInfo() {
				let info = {
					targetDealTotal: 0,
					targetDealFx: 0,
				}
				this.tagetInfo = info;
			},
			async editTaget() {
				console.log(this.tagetInfo)
				try {
					this.$loading.show('请稍等。。。')
					let {
						targetDealTotal,
						targetDealFx,
						sellerStoreId,
						id
					} = { ...this.tagetInfo
					};
					await editStoreTarget({
						targetDealTotal,
						targetDealFx,
						id: sellerStoreId,
						planId: id
					});
					this.getData()
					this.$message.success(`保存成功`)
					this.$loading.hide()
					this.initTagetInfo()
					this.taget = false;

				} catch (e) {
					this.$loading.hide()
				}
			},
			async setTaget(item) {
				console.log(this.tagetInfo)
				try {
					this.$loading.show('请稍等。。。')
					let {
						targetDealTotal,
						targetDealFx,
						sellerStoreId
					} = { ...this.tagetInfo
					};
					await addSellerStorePlan({
						targetDealTotal,
						targetDealFx,
						sellerStoreId
					});
					this.getData()
					this.$message.success(`设置成功`)
					this.$loading.hide()
					this.initTagetInfo()
					this.taget = false;
				} catch (e) {
					this.$loading.hide()
				}

			},
			async getTaget(item) {
				console.log(item)
				let info = await querySellerStorePlan({
					storeId: item.id
				})
				console.log(info)
				if (info) {
					this.tagetInfo = { ...info
					};
					this.editTagetBtn = true;
				} else {
					this.tagetInfo.sellerStoreId = item.id;
				}

				this.taget = true;
			},
			checkAccount(item) {
				console.log(item)
				const {
					id,
					name,
					userName
				} = item
				let textName =  item.userName? item.userName : item.nickName? item.nickName:''

				this.$confirm(`【${name}的组长「${textName}】申请开通组长账号，是否同意开通？`, `审核账号开通`, {
					confirmButtonText: '允许开通',
					cancelButtonText: '不开通',
					type: 'warning',
					dangerouslyUseHTMLString: true,
					closeOnClickModal: false,
					distinguishCancelAndClose: true
				}).then(async () => {
					this.$loading.show('请稍等。。。')
					let res =  await auditStatus({
						recordId: item.recordId,
						status: 1
					})
					this.getData()
					this.$loading.hide()
					console.log(res)
					this.$message.success(res)
				}).catch(async (e) => {
					console.log(e)
					if (e == 'cancel') {
						this.$loading.show('请稍等。。。')
						let res =  await auditStatus({
							recordId: item.recordId,
							status: 3
						})
						this.$message.success(res)
						this.$loading.hide()
						// const res = await auditAdviser({adviserId: id, status: 3})
						this.getData()
						// this.$message.error(`审核不通过`)
					}
				})

			},
			setStatus(item) {
				console.log(item)
				const txt = '停用';
				const name =  item.userName? item.userName: item.nickName?item.nickName:''
				const tips = `您确认停用【${item.name}】的组长【${name}】的组长账号?`;
				const sureTxt = '停用';
				this.$confirm(tips, `${txt}`, {
					confirmButtonText: sureTxt,
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					this.$loading.show('请稍等。。。')
					const res = await stopStatus({
						recordId: item.recordId
					})
					this.$message.success(`${txt}成功`)
					this.getData()
					this.$loading.hide()
				}).catch(_ => {
					this.$loading.hide()
				})
			},
			previewCode(item) {
				this.storeInfo = item
				const {
					name,
					typeName,
					codeUrl
				} = item
				this.qrCodeTitle = name + typeName
				this.qrCodePath = codeUrl
				this.qrCodeDialogVisible = true
			},
			// 查看某分店下的顾问列表
			toAdviser(storeId, activeName) {
				this.$router.push({
					name: 'team',
					query: {
						activeName,
						storeId
					}
				})
			},
			// 下载二维码图片到本地
			downQrcode() {
				const a = document.createElement("a"); // 生成一个a元素
				const event = new MouseEvent("click"); // 创建一个单击事件
				a.download = "photo"; // 设置图片名称
				a.href = setImgPath(this.storeInfo.codeUrl); // 将生成的URL设置为a.href属性
				a.dispatchEvent(event);

				this.qrCodeDialogVisible = false
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
			getStatus(status = 0) {
				if (status !== 1) {
					return '启用'
				} else {
					return '停用'
				}
			},
			getStoreStatus(status) {
				if (status == 1) {
					return '已通过'
				} else if (status == 2) {
					return '已停用'
				} else if (status == 0) {
					return '待审核'
				} else {
					return '未通过'
				}
			},
			getTypeStautsStr(string) {
				if (string == '暂无') {
					return 'info'
				}
			},
			getTypeStatus(status) {
				if (status !== 1) {
					return 'info'
				} else {
					return 'success'
				}
			}
		}
	}
</script>
<style scoped="scoped" lang="scss">
	.infoPic {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		overflow: hidden
	}

	.tagetBox {
		.tagetTop {
			.tips {
				color: #999;
			}

			.tagetVal {
				padding: 5px 0;
				display: flex;
				align-items: center;
			}
		}
	}

	.groupCode {
		margin: 0 20px;
		text-align: center;

		.groupCodeValue {
			width: 150px;
			height: 150px;
			background: salmon;
			margin: 10px 0;
		}
	}
</style>
