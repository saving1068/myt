<template>
    <div class="real-time page-container">
        <panel>
            <template slot="head">
                <span class="left">实时实况</span>
                <span class="right">更新时间2018-12-12</span>
            </template>
            <el-button type="primary">click</el-button>
        </panel>
    </div>
</template>


<script>
import Panel from '@/components/Panel'

export default {
    components: {Panel}
}
</script>