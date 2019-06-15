<template>
    <div class="log-record page-container">
        <panel>
            <template slot="head">
                <div class="left">
                    <span class="title">日志管理</span>
                </div>
            </template>
            <no-data>开发中....</no-data>
        </panel>
    </div>
</template>


<script>
import Panel from '@/components/Panel'
import NoData from '@/components/NoData'
export default {
    components: {Panel, NoData}
}
</script>