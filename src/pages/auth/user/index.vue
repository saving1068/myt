<template>
    <div class="user-auth page-container">
        <panel>
            <template slot="head">
                <div class="left">
                    <span class="title">用户管理</span>
                </div>
				<div class="right" style="display: flex;">
					<el-select v-model="sendData.queryStatus" clearable size="mini" placeholder="全部状态" @change="seachStatus">
						<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-input v-model="sendData.queryKeywords" clearable placeholder="用户名称/手机号码" @change="inputChange" style="width:200px; margin:0 15px;" size="mini" class="input-with-select">
						<el-button slot="append" icon="el-icon-search" @click='getData'></el-button>
					</el-input>
					<el-button type="warning" size="mini" v-if="isBtnPower('020201')"  @click="$router.push({name: 'addUser'})">新增用户</el-button>
				</div>
            </template>
			<el-table :data="tableData" style="width: 100%" :height='sideHeight'  v-loading='loading'>
				<el-table-column prop="loginName" label="登录名称" align="center"/>
				<el-table-column prop="name" label="真实姓名	" align="center">
					 <template slot-scope="scope">
					    <div class="flex align-items-center">
					        <!-- <img :src="setImgPath(scope.row.headPic)" width="30" height="30" class="radius" /> -->
							<div style="width: 100%;" >
								<div>{{scope.row.realName}}</div>
								<div>{{scope.row.mobile}}</div>
							</div>
					    </div>
					</template>
				</el-table-column>
				<el-table-column prop="allRoleNames" label="用户的角色" align="center"/>
				<!-- <el-table-column prop="admin" label="管理门店" align="center"/> -->
				<el-table-column prop="statu" label="状态" align="center">
					<template slot-scope="scope">
					    <el-tag :type="scope.row.isDelete | getAdvTagStatus" size="small">{{scope.row.isDelete | getAdvStatus}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"/>
				<!-- <el-table-column prop="set" label="已绑定设置" align="center" /> -->
				<el-table-column prop="address" label="操作" align="center">
					 <template slot-scope="scope">
					 <div class="operate">
						<span v-if="isBtnPower('020202')" @click="goTO('editUser',scope.row)">编辑</span>
						<span v-if="isBtnPower('020204')" @click="resetPwd(scope.row)">重置密码</span>
						<span v-if="isBtnPower('020203')" @click="changeStatus(scope.row)">{{scope.row.isDelete == 0?'禁用':'启用'}}</span>
						<!-- <span>绑定设置</span> -->
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
import {userRoleDatas,resetPwd,userEditStatus} from '@/api/auth'
export default {
    components: {Panel, NoData},
	mixins: [power],
	computed:{
			sideHeight(){
			// 			console.log(111)
			// 			console.log(this.$store.state.getContentSize)
							return this.$store.state.getContentSize -120
					}
		},
	data(){
		return{
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
					value: 0
				},
				{
					label: '禁用',
					value: 1
				}
			],
			tableData: [
				
			]
		}
	},
	async created() {
		await this.getPower('020201,020202,020203,020204');
		this.getData()
	},
	methods:{
		inputChange(value){
			if(!value){
				this.getData()
			}
		},
		resetPwd(item){
			// console.log(item)
			const txt = `你确认重置【${item.realName}】的密码吗？`
			this.$confirm(txt, `提示`, {
				confirmButtonText:'确认',
				cancelButtonText: '取消',
				type: 'warning',
				dangerouslyUseHTMLString: true
			}).then(async () => {
				const res = await resetPwd({id:item.id})
				this.$message.success(`重置${item.realName}密码成功`)
				this.getData()
			}).catch(_ => {
				
			})
		},
		seachStatus(value){
			
			this.getData();
		},
		changeStatus(item){
			console.log(item)
			const {isDelete, id, realName} = item
			const statusTxt = isDelete == 0 ? '禁用' : '启用'
			const txt = `您确认${statusTxt}【${realName}】角色？`
			this.$confirm(txt, `提示`, {
				confirmButtonText: statusTxt,
				cancelButtonText: '取消',
				type: 'warning',
				dangerouslyUseHTMLString: true
			}).then(async () => {
				const res = await userEditStatus({id, status: isDelete == 0 ? 1 : 0})
				this.$message.success(`${statusTxt}${realName}用户成功`)
				this.getData()
			}).catch(_ => {
				
			})
		},
		goTO(place,item){
			if(place =='editUser'){
				this.$router.push({
					name:'editUser',
					query:{
						userId:item.id
					}
				})
			}
		},
		async getData(){
			let send = this.sendData;
			// console.log(send);
			try{
				this.loading = true;
				let res = await userRoleDatas(send);
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
		    return ['启用','禁用'][status]
		},
	    getAdvTagStatus(status) {
	        return ['success','danger','info','danger'][status]
	    }
	}
}
</script>
<style lang="scss" scoped="scoped">
	.operate{
		span{
			cursor: pointer;
		}
	}
</style>