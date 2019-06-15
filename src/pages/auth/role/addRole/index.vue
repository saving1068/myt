<template>
	<div class="log-record page-container">
		<panel>
			<template slot="head">
				<div class="left">
					<span class="title">角色管理</span> &gt;
					<i class="small">编辑角色</i>
				</div>
			</template>
			<div class="flex">
				<el-form :model="formInfo" label-width="100px" v-loading='loading'>
					<el-form-item label="角色编号">
						{{formInfo.code}}
					</el-form-item>
					<el-form-item label="角色名称">
						<form-input v-model="formInfo.name" classType='bigInput' :max='20' sizi='mini'></form-input>
					</el-form-item>
					<el-form-item label="角色描述">
						<form-input v-model="formInfo.content" classType='bigTextarea' :max='1000' sizi='mini'></form-input>
					</el-form-item>
					<el-form-item label="角色状态">
						<el-radio-group v-model="formInfo.status">
							<el-radio :label="0">禁用</el-radio>
							<el-radio :label="1">启用</el-radio>
						</el-radio-group>
					</el-form-item>
					<div class="btn flex">
						<el-button size="mini" type="primary" @click='keep'>保存</el-button>
						<el-button size="mini" type="warning" @click='$router.go(-1)'>返回</el-button>
					</div>
				</el-form>
				
				<div class="setPower">
					<div class="head">角色的权限设置<span>（权限变更后重新登陆方可生效，或五分钟后自动生效。）</span></div>
					<div class="data">
						<el-tree :data="data" @check-change='currentChange' show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps">
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
	import {roleDatas,listDatasSave} from '@/api/auth'
	export default {
		components: {
			Panel,
			NoData,
			formInput
		},
		async created() {
			if(this.$route.query.id){
				
			}else{
				this.loading = true;
				// await userRoleDatas()
				let res =  await roleDatas();
				// console.log(res)
				this.data = res;
				this.loading = false;
			}
			
			
		},
		
		data() {
			return {
				formInfo: {
					code: '',
					name: '',
					content: "",
					status: 1,
				},
				cheakAll:[],
				defaultProps: {
					children: 'adminResourceLists',
					label: 'name'
				},
				data: [],
			}
		},
		methods:{
			async keep(){
				if(this.formInfo.name&&this.formInfo.content){
					if(this.cheakAll.length){
						let {name,content,status} = {...this.formInfo};
						let rolePowers = JSON.stringify(this.cheakAll);
						// console.log({name,content,status,rolePowers})
						this.$loading.show('请稍等。。。')
						try{
							await listDatasSave({name,content,status,rolePowers})
							this.$message.success('新增成功')
							this.$loading.hide();
							this.$router.go(-1);
						}catch(e){
							this.$loading.hide();
							//TODO handle the exception
						}
					}else{
						this.$message.warning('最少选择一个角色')
					}
					
				}else{
					this.$message.warning('请填写完整信息')
				}
				
				
			},
			currentChange(data){
				// console.log(data);
				let res = this.$refs.tree.getCheckedNodes();
				// console.log(res)
				let arr = []
				res.forEach((item) => {
					let send = {
						resId:0,
						resCode:item.code,
						isDel:0
					}
					arr.push(send)
				})
				this.cheakAll = arr;
				// console.log(arr)
			}
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
