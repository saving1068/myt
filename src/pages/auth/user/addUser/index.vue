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
					<el-form-item label="初始化密码">
						{{formInfo.loginPass}}
					</el-form-item>
					<div class="btn flex">
						<el-button size="mini" type="primary" @click='keep'>保存</el-button>
						<el-button size="mini" type="warning" @click='$router.go(-1)'>返回</el-button>
					</div>
				</el-form>
				<div class="setPower">
					<div class="head">用户的角色设置<span>（权限变更后重新登陆方可生效，或五分钟后自动生效。）</span></div>
					<div class="data" v-loading='loading'>
						<el-tree :data="data" @check='check' show-checkbox default-expand-all node-key="id" ref="tree"
						 highlight-current :props="defaultProps" >
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
		userListDatas,addUser,getUser
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
				this.loading = true;
				let res = await userListDatas()
				this.data = res;
				this.loading = false;

		},

		data() {
			return {
				// 				checkAll: false,
				// 				checkedCities:[],
				// 				cities:['上海', '北京', '广州', '深圳'],
				// 				cityOptions:['上海', '北京', '广州', '深圳'],
				// 				isIndeterminate: true,
				loading: false,
				formInfo: {
					loginName: "",
					loginPass: '111111',
					realName: '',
					mobile: "",
					isDelete: 0,
					userRoles: ""
				},
				checkArr: [],
				defaultProps: {
					children: 'type',
					label: 'name'
				},
				data: [],
			}
		},
		methods: {
			handleNodeClick(data) {
				// console.log(data);
			},
			async getData(id){
				try{
					this.$loading.show('请稍等');
					let info =  await getUser({id});
					// console.log(info)
					this.formInfo = {...info};
					this.$loading.hide();
				}catch(e){
					//TODO handle the exception
				}
				
			},
			async keep() {
					if(this.formInfo.loginName){
						if(!validChinese(this.formInfo.loginName)){
							this.$message.warning('请输入正确格式')
							return
						}
					}else{
						this.$message.warning('请输入正确格式')
						return
					}
					
					if(!validMobile(this.formInfo.mobile)){
						this.$message.warning('请输入正确手机号码')
						return
					}
					let userRoles = [...new Set(this.checkArr)];
					if(userRoles.length>0){
						
						let sendArr = [];
						for(let i =0;i<userRoles.length;i++){
							let obj = {
								id:0,
								roleCode:userRoles[i],
								isDel:0
							}
							sendArr.push(obj)
						}
						this.formInfo.userRoles = JSON.stringify(sendArr)
						this.$loading.show('请稍等。。。')
						try{
							await addUser(this.formInfo)
							this.$message.success('新增成功')
							this.$loading.hide();
							this.$router.go(-1);
							// console.log(sendArr)
						}catch(e){
							// console.log(e)
							this.$loading.hide()
							//TODO handle the exception
						}
						
					}else{
						this.$message.warning('最少选择一个角色')
					}
					


			},
			check(data) {
					this.checkArr.push(data.code)

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
