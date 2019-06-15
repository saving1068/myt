<template>
	<div class="member-auth page-container">
		<panel>
			<template slot="head">
				<div class="left">
					<span class="title">角色管理</span>
				</div>
				<div class="right" style="display: flex;">
					<el-select v-model="sendData.queryStatus" size="mini" placeholder="全部状态" @change="seachStatus">
						<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-input placeholder="角色名称" v-model="sendData.queryKeywords" style="width:200px; margin:0 15px;" size="mini" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click='getData'></el-button>
					</el-input>
					<el-button type="warning" size="mini" @click="$router.push({name: 'addRole'})"  v-if="isBtnPower('020101')">新增角色</el-button>
				</div>
			</template>
			<el-table :data="tableData" :height='sideHeight' style="width: 100%" v-loading='loading'>
				<el-table-column prop="code" label="编号" align="center"/>
				<el-table-column prop="name" label="名称" align="center"/>
				<el-table-column prop="content" label="描述" width="500" align="center">
				</el-table-column>
				<el-table-column prop="statu" label="状态" align="center">
					<template slot-scope="scope">
					    <el-tag :type="scope.row.status | getAdvTagStatus" size="small">{{scope.row.status | getAdvStatus}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"/>
				<el-table-column prop="address" label="操作" align="center">
					 <template slot-scope="scope">
					 <div class="operate">
						<span v-if="isBtnPower('020102')" @click="goTo('editRole',scope.row)">编辑</span>
						<span v-if="isBtnPower('020103')" @click="changeStatus(scope.row)">{{scope.row.status == 0?'启用':'禁用'}}</span>
					</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="flex justify-content-end mt15">
			    <el-pagination background layout="prev, pager, next" :page-size="sendData.pageSize" :current-page.sync="sendData.pageNo" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
			</div>
		</panel>
	</div>
</template>


<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import power from '@/mixins/power'
	import {listDatas,listDatasSave,listDatasUpdate,listDatasEditStatus} from '@/api/auth'
	export default {
		components: {
			Panel,
			NoData
		},
		mixins: [power],
		async created() {
			  await this.getPower('020101,020102,020103');
			  this.getData()
		},
		computed:{
				sideHeight(){
		// 			console.log(111)
		// 			console.log(this.$store.state.getContentSize)
						return this.$store.state.getContentSize -120
				}
			},
		data() {
			return {
				sendData:{
					queryStatus:"",
					pageSize:10,
					queryKeywords:'',
					pageNo:1,
				},
				loading:false,
				total:10,
				statusList: [{
						label: '启动',
						value: 1
					},
					{
						label: '禁用',
						value: 0
					}
				],
				tableData: [
					
				]
			}
		},
		methods:{
			changeStatus(item){
				console.log(item)
				const {status, id, name} = item
				const statusTxt = status == 1 ? '禁用' : '启用'
				const txt = `您确认${statusTxt}【${name}】角色？`
				this.$confirm(txt, `提示`, {
					confirmButtonText: statusTxt,
					cancelButtonText: '取消',
					type: 'warning',
					dangerouslyUseHTMLString: true
				}).then(async () => {
					const res = await listDatasEditStatus({id, status: status == 1 ? 0 : 1})
					console.log(res)
					this.$message.success(`${statusTxt}${name}角色成功`)
					this.getData()
				}).catch(_ => {
					console.log(22222)
				})
			},
			goTo(place,item){
				if(place=='editRole'){
					this.$router.push({
						name:'editRole',
						query:{
							roleId:item.id
						}
					})
				}
			},
			seachStatus(value){
				
				this.getData();
			},
			async getData(){
				let send = this.sendData;
				// console.log(send);
				try{
					this.loading = true;
					let res = await listDatas(send);
					// console.log(res)
					this.tableData = res.items;
					this.total = res.total;
					this.loading = false;
				}catch(e){
					console.log(e)
				}
				
			},
			 handleSizeChange(pageSize) {
				this.sendData.pageSize = pageSize;
			    this.getData();
			},
			handleCurrentChange(pageNum) {
				this.sendData.pageNo = pageNum;
			    this.getData();
			}
		},
		filters: {
			getAdvStatus(status) {
			    return ['禁用','启用'][status]
			},
		    getAdvTagStatus(status) {
		        return ['danger','success','info','danger'][status]
		    }
		}
	}
</script>
