<template>
	<div class="log-record page-container">
		<panel>
			<template slot="head">
				<div class="left">
					<span class="title">用户管理</span> &gt;
					<i class="small">编辑用户</i>
				</div>
			</template>
			<div class="flex">
				<el-form :model="formInfo" label-width="100px">
					<el-form-item label="登录名称">
						<form-input v-model="formInfo.loginName" classType='bigInput' :max='20' sizi='mini'></form-input>
						<span>4~20个字符，不区分大小写。建议英文字母加数字组合！</span>
					</el-form-item>
					<el-form-item label="真实姓名">
						<form-input v-model="formInfo.realName" classType='bigInput' :max='10' sizi='mini'></form-input>
					</el-form-item>
					<el-form-item label="手机号码">
						<form-input v-model="formInfo.mobile" classType='bigInput' :max='11' sizi='mini'></form-input>
					</el-form-item>
					<!-- <el-form-item label="管理门店">
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						  <div style="margin: 15px 0;"></div>
						  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
							<el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
						  </el-checkbox-group>
					</el-form-item> -->
					<el-form-item label="用户状态">
						<el-radio-group v-model="formInfo.isDelete">
							<el-radio :label="0">启用</el-radio>
							<el-radio :label="1">禁用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="创建人">
						{{formInfo.creator}}
					</el-form-item>
					<el-form-item label="创建时间">
						{{formInfo.createTime}}
					</el-form-item>
					<div class="btn flex">
						<el-button size="mini" type="primary" @click='keep'>保存</el-button>
						<el-button size="mini" type="warning" @click='$router.go(-1)'>返回</el-button>
					</div>
				</el-form>
				<div class="setPower">
					<div class="head">用户的角色设置<span>（权限变更后重新登陆方可生效，或五分钟后自动生效。）</span></div>
					<div class="data" v-loading='loading'>
						<el-tree :data="data" show-checkbox default-expand-all node-key="code" ref="tree" 
						 highlight-current :props="defaultProps" :default-checked-keys="checkArr" @check='check' current-node-key @check-change="handleCheckChange">
						</el-tree>
					</div>

				</div>
			</div>
		</panel>
	</div>
</template>

<script>
	import Panel from '@/components/Panel'
	import NoData from '@/components/NoData'
	import formInput from '@/components/FormInput'
	import {
		userListDatas,editUser,getUser
	} from '@/api/auth'
	import {
		validMobile,
		validChinese
	} from '@/utils/index'
	export default {
		components: {
			Panel,
			NoData,
			formInput
		},
		async created() {
				this.getData(this.$route.query.userId)

		},

		data() {
			return {
				loading: false,
				dataChange:false,
				formInfo: {
					loginName: "",
					loginPass: '111111',
					realName: '',
					mobile: "",
					isDelete: 0,
					userRoles: ""
				},
				checkArr: [],
				initArr:[],
				userRolesList:[],
				defaultProps: {
					children: 'type',
					label: 'name'
				},
				data: [],
			}
		},
		methods: {
			handleCheckChange () {
			  let res = this.$refs.tree.getCheckedNodes()
			  let arr = []
			  res.forEach((item) => {
				  let obj = {
					id:0,
					roleCode:item.code,
					isDel:0,
				  }
				arr.push(obj)
			  })
			  this.userRolesList = arr;
			  // console.log(this.userRolesList)
			},
			async getData(id){
				try{
					this.$loading.show('请稍等');
					let info =  await getUser({id});
					this.formInfo = {...info};
					let cheakArr = info.adminUserRoles;//一开始选中的数组
					this.$loading.hide();
					try{
						this.loading = true;
						let res = await userListDatas()
						for(let i=0;i<cheakArr.length;i++){
							for(let j=0;j<res.length;j++){
								if(cheakArr[i].roleCode == res[j].code){//一开始选中的数组是否存在于列表里面
									this.checkArr.push(res[j].code)//在列表钟选中的code
									this.initArr.push(cheakArr[i])//在列表钟选中的对象
								}
							}
						}
						// console.log(this.initArr,'列表钟选中的对象');
						this.data = res;
						this.loading = false;
					}catch(e){
						//TODO handle the exception
					}
				}catch(e){
					//TODO handle the exception
				}
				
			},
			async keep() {
				let sendArr = [];
				let notChoiceArr = []
				if(this.dataChange){//有重新选择
					if(this.userRolesList.length){
						this.initArr.forEach((item,index) =>{
							const findObj = this.userRolesList.find(v => v.roleCode == item.roleCode);
							
							// console.log(findObj,item)
							if(!findObj){//删除的
								this.userRolesList.push({
									id:item.id,
									roleCode:item.roleCode,
									isDel:1
								})
							}else{//没变
								
								const _index = this.userRolesList.findIndex(v => v.roleCode == item.roleCode);
								this.userRolesList[_index].id = item.id;
								// debugger
							}
						})
						sendArr = [...this.userRolesList];
						// console.log(sendArr)
						try{
							let {loginName,realName,mobile,isDelete,id} = {...this.formInfo} ;
							let userRoles = JSON.stringify(sendArr)
							// console.log({loginName,realName,mobile,isDelete,userRoles,loginPass:'null',id})
							// debugger
							this.$loading.show('请稍等。。。')
							await editUser({loginName,realName,mobile,isDelete,userRoles,loginPass:'null',id})
							this.$message.success('修改成功')
							this.$loading.hide();
							this.$router.go(-1);
						}catch(e){
							this.$loading.hide();
						}
					}else{
						this.$message.warning('最少选择一个角色')
					}
				}else{//没有重新选中
				if(this.initArr.length){
					for(let j=0;j<this.initArr.length;j++){
						let send = {
							id:this.initArr[j].id,
							roleCode:this.initArr[j].roleCode,
							isDel:0
						}
						sendArr.push(send)
					}
					try{
						let {loginName,realName,mobile,isDelete,id} = {...this.formInfo} ;
						let userRoles = JSON.stringify(sendArr)
						// console.log({loginName,realName,mobile,isDelete,userRoles,loginPass:'null',id})
						this.$loading.show('请稍等。。。')
						await editUser({loginName,realName,mobile,isDelete,userRoles,loginPass:'null',id})
						this.$message.success('修改成功')
						this.$loading.hide();
						this.$router.go(-1);
					}catch(e){
						this.$loading.hide();
					}
				}else{
					this.$message.warning('最少选择一个角色')
				}
					
				}
				
				
				
				// console.log(sendArr)

			},
			check(data) {
				this.dataChange = true;
				// console.log(data)
			}
			// 			handleCheckAllChange(val) {
			// 				this.checkedCities = val ? this.cityOptions : [];
			// 				this.isIndeterminate = false;
			// 			  },
			// 			  handleCheckedCitiesChange(value) {
			// 				let checkedCount = value.length;
			// 				this.checkAll = checkedCount === this.cities.length;
			// 				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			// 			  }
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.btn {
		justify-content: center;
	}

	.setPower {
		margin-left: 50px;

		.head {
			font-size: 16px;

			span {
				color: #dd514c;
				font-size: 12px;
			}
		}

		.data {
			margin-top: 10px;
			padding: 5px;
			background: #fbf9f9;
			height: 500px;
			overflow-y: scroll;
			overflow-x: auto;
		}
	}
</style>
