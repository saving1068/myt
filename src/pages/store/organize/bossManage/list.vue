<template>
    <div class="boss page-container">
        <panel>
            <template slot="head">
                <div class="left">BOSS账号管理</div>
                <div class="right">
					<el-select v-model="status" size="mini" clearable placeholder="全部BOSS账号" @change="changeStatus" style="width:150px">
					    <el-option
					        v-for="item in statusList"
					        :key="item.id"
					        :label="item.label"
					        :value="item.value">
					    </el-option>
					</el-select>
                    <el-button v-if="isBtnPower('05020303')" type="warning" size="mini" @click="previewCode">下载BOSS码</el-button>
                </div>
            </template>

            <el-table :data="bossList" style="width: 100%" fit v-loading="loading" :height="sideHeight">
				 <el-table-column label="审核状态" width="100" align="center">
				    <template slot-scope="scope">
				        <el-tag size="small" :type="scope.row.status | getTypeStatus">{{scope.row.status | getBossStatus}}</el-tag>
				    </template>
				</el-table-column>
                <el-table-column label="BOSS信息" min-width="120" align="center">
                    <div slot-scope="scope" class="flex align-items-center justify-content-center">
                        <img v-if="scope.row.avatarUrl" :src="setImgPath(scope.row.avatarUrl)" width="30" height="30" class="radius" />
                        <span class="ml5">
                            <template v-if="scope.row.name">{{scope.row.name}} | </template>
                            <template v-if="scope.row.nickName">{{scope.row.nickName}}</template>
                        </span>
                    </div>
                </el-table-column>
                <el-table-column prop="mobile" label="注册手机" width="120" align="center" />
                <el-table-column label="是否有顾问账号" min-width="180" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sellerStoreName">
                            {{scope.row.sellerStoreName}} {{scope.row.adviserName}}({{scope.row.nickName}})
                        </span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column label="开通时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.authDate}} <br>{{scope.row.authHours}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" >
                    <template slot-scope="scope">
                        <div class="operate">
                            <span v-if="isBtnPower('05020302')&&scope.row.status !=2" @click="setStatus(scope.row)">
                                {{scope.row.status | getStatusTxt}}
                            </span>
                            <!-- <span v-if="scope.row.status == 1 && isBtnPower('05020304')">登录日志</span> -->
                        </div>
                    </template>
                </el-table-column>
            </el-table>

        </panel>

        <qr-code-dialog :visible.sync="qrCodeDialogVisible" title="BOSS码" :src="qrCodePath">
            <a :href="setImgPath(qrCodePath)" target="_blank"><el-button type="primary">下载</el-button></a>
        </qr-code-dialog>

    </div>
</template>


<script>
import Panel from '@/components/Panel'
import QrCodeDialog from '@/components/QrCodeDialog'

import {setImgPath} from '@/utils'
import power from '@/mixins/power'
import {message} from '@/mixins'

import {bossList, editBossStatus, getBossCode} from '@/api/store'

export default {
    components: {Panel, QrCodeDialog},
    mixins: [power, message],
	computed:{
			sideHeight(){
	// 			console.log(111)
	// 			console.log(this.$store.state.getContentSize)
					return this.$store.state.getContentSize -75
			}
			},
    data() {
        return {
			statusList:[
				 {
				    value: "",
				    label: '全部BOSS账号'
				}, 
				 {
				    value: 0,
				    label: '待审核'
				}, 
				 {
				    value: 1,
				    label: '已通过'
				}, 
				 {
				    value: 3,
				    label: '未通过'
				}, 
			],
			status:'',
			
            loading: false,
            bossList: [],
			
            qrCodeDialogVisible: false,
            qrCodePath:'',
            setImgPath,
        }
    },
    async created() {
        this.$loading.show()

        try {
            await this.getPower('05020302,05020303,05020304')
            this.getData()
        } catch (error) {
            console.error(error)
        }

        this.$loading.hide()
    },
    methods: {
		async changeStatus(value){
			this.getData()
		},
        async getData(){
			this.loading = true;
            try {
				let send = {
					status:this.status
				}
                const res = await bossList(send)
                this.bossList = res
                
            } catch (error) {
                console.error(error)
            }
            this.loading = false
        },
		 checkAccount({name, id, status}) {
		    this.$confirm(`「${name}」申请开通BOSS账号是否同意开通？`, `审核账号开通`, {
		        confirmButtonText: '允许开通',
		        cancelButtonText: '不开通',
		        type: 'warning',
		        dangerouslyUseHTMLString: true,
		        closeOnClickModal: false,
		        distinguishCancelAndClose: true
		    }).then(async () => {
		        const res = await auditAdviser({adviserId: id, status: 1})
		        this.getData()
		        this.$message.success(`审核通过`)
		    }).catch(async (e) => {
		        console.log(e)
		        if(e == 'cancel'){
		            // const res = await auditAdviser({adviserId: id, status: 3})
		            // this.getData()
		            // this.$message.success(`停用成功`)
		        }
		    })
		
		},

        setStatus(item) {
			console.log(item)
            const txt = item.status != 0 ? '停用' : '审核账号开通'
			let name = item.name? item.name : item.nickName? item.nickName:''
			
			if(item.mobile){
				name  = name +item.mobile
			}
			
			const tips = item.status != 0 ? `您确认${txt}「${name}」账号?<br><span style='color:red;'>停用后则不能使用BOSS工作台</span>`:`「${name}」申请开通BOSS账号是否同意开通？`;
			const suerTxt = item.status != 0 ? '停用' : '允许开通'
			const cancelTxt = item.status != 0 ? '取消':'不开通'
            this.$confirm(tips, `${txt}提示`,{
				 confirmButtonText: suerTxt,
				cancelButtonText: cancelTxt,
				closeOnClickModal: false,
				type: 'warning',
				dangerouslyUseHTMLString: true,
				distinguishCancelAndClose: true
			}).then(async () => {
				let itemStatus = null
				if(item.status != 0){//停用
					itemStatus = 2
				}else{
					itemStatus = 1
				}
                const res = await editBossStatus({userId: item.id, status:itemStatus})
                this.$message.success(`${txt}成功`)
                this.getData()
            }).catch( async (e) => {
				console.log(e)
				if(item.status != 0){
					
				}else{
					if (e == 'cancel') {
						const res = await editBossStatus({userId: item.id, status:3})
						this.$message.success('审核设置成功')
						 this.getData()
						}
				}
// 				
			})
        },

        async previewCode() {
            if(this.qrCodePath){
                this.qrCodeDialogVisible = true
            }else{
                this.$loading.show()
                try {
                    const res = await getBossCode()
                    this.qrCodePath = res
                    this.qrCodeDialogVisible = true
                } catch (error) {
                }
                this.$loading.hide()
            }
        }
    },
    filters: {
        getStatusTxt(status){
            return ['审核', '停用', '停用', '停用'][status]
        },
        getBossStatus(status) {
            return ['待审核', '审核通过', '停用', '审核不通过'][status]
        },
        getTypeStatus(status) {
            return ['warning','success', 'danger', 'info'][status]
        }
    }
}
</script>