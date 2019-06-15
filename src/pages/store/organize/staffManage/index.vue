<template>
    <div class="staff-manage page-container">
			 <el-tabs v-model="activeName" @tab-click="tabClick" class="top-filter-tab sticky">
			    <el-tab-pane label="销售顾问库" v-if="isBtnPower('05020101')" name="adviser">
			        <adviser-list v-if="activeName == 'adviser'" />
			    </el-tab-pane>
			    <el-tab-pane label="推手库" v-if="isBtnPower('05020105')" name="pushHander">
			        <push-hander-list v-if="activeName == 'pushHander'" />
			    </el-tab-pane>
				<el-tab-pane label="代理商库" v-if="isBtnPower('05020108')" name="agentHander">
				    <agenter-list v-if="activeName == 'agentHander'" />
				</el-tab-pane>
			</el-tabs>
    </div>
</template>

<script>
import AdviserList from './adviser/list'
import PushHanderList from './pushHander/list'
import agenterList from './agentList/list'

import {setImgPath, checkPrice} from '@/utils'
import {message} from '@/mixins'
import power from '@/mixins/power'

export default {
    components: {AdviserList, PushHanderList,agenterList},
    mixins: [power, message],
    data() {
        return {
            activeName: '',
        }
    },
    async created() {
        const menus = await this.getPower('05020101,05020105,05020108')

        const query = this.$route.query

        let activeName = 'adviser'

        if(query.activeName){
            activeName = query.activeName
        }


        // 如果没有销售顾问列表权限，默认是推手库
        if(!this.isBtnPower('05020101')){
            activeName = 'pushHander'
        }

        this.activeName = activeName?activeName: this.activeName

    },
    methods: {
        tabClick(e) {
			// console.log(e)
            const path = location.origin + location.pathname
            // 这里加一个istop参数，只要是在tab左右是，防止query里的{storeId 或 adviserId}互带，
            // 因为replaceState设置URL参数是不会把vue的query里的参数去掉的
            // history.replaceState('', '', `${path}?activeName=${e.name}&istop=1`);
            this.$router.replace({
                name: 'team',
                query: {
                    activeName: e.name
                }
            })
        }
    }
}
</script>
<style scoped="scoped" lang="scss">
	.topWarp{
		display: flex;
		justify-content: space-between;
	}
</style>