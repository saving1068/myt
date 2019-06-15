<template>
    <el-tooltip v-if="showFullScreenBtn" :content="value ? '退出全屏' : '全屏'" effect="dark" placement="bottom">
        <icon-svg icon-class="fullScreen" @click="handleChange" />
    </el-tooltip>
</template>


<script>
import screenfull from 'screenfull'
export default {
    name: 'Fullscreen',
    computed: {
        showFullScreenBtn () {
            return window.navigator.userAgent.indexOf('MSIE') < 0
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    mounted() {

        if (screenfull.enabled) {
            screenfull.on('change', () => {
                this.$emit('input', !this.value)
                this.$emit('on-change', !this.value)
            });
        
            let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
            isFullscreen = !!isFullscreen

            this.$emit('input', isFullscreen)
        }
    },
    methods: {
        handleChange () {
            if (!screenfull.enabled) {
                this.$message({
                    message: '你的浏览器不能工作！',
                    type: 'warning'
                })
                return false
            }
            screenfull.toggle()
        }
    }
}
</script>