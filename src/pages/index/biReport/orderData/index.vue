<template>
    <div class="report-order-data page-container">
        <el-tabs v-model="activeName" @tab-click="tabClick" class="top-filter-tab sticky">
            <el-tab-pane label="试驾单" v-if="isBtnPower('03020201')" name="testDrive">
                <test-drive v-if="activeName == 'testDrive'" />
            </el-tab-pane>
            <el-tab-pane label="选车单" v-if="isBtnPower('03020202')" name="selectCar">
                <select-car v-if="activeName == 'selectCar'" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import TestDrive from './testDrive'
import SelectCar from './selectCar'

import {setImgPath, checkPrice} from '@/utils'
import power from '@/mixins/power'

export default {
    components: {TestDrive, SelectCar},
    mixins: [power],
    data() {
        return {
            activeName: '',
        }
    },
    async created() {
        const menus = await this.getPower('03020201,03020202')

        const query = this.$route.query

        // console.log('query+++',this.$route)

        let activeName = 'testDrive'

        if(query.activeName){
            activeName = query.activeName
        }


        // 如果没有试驾单权限，默认是选车单
        if(!this.isBtnPower('03020201')){
            activeName = 'selectCar'
        }

        this.activeName = activeName
    },
    methods: {
        tabClick(e) {
            const path = location.origin + location.pathname
            history.replaceState('', '', `${path}?activeName=${e.name}`);
            // this.$router.replace({
            //     name: 'orderData',
            //     query: {
            //         activeName: e.name
            //     }
            // })
        }
    }
}
</script>
