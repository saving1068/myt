<template>
    <div :style="{height:height+'px', position: parentPosition, top:0, zIndex:zIndex}">
        <div :class="className" :style="{top:stickyTop+'px',zIndex:zIndex, position:childPisition, top:childTop, width:width,height:height+'px'}">
            <slot>
                <div>sticky</div>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Sticky',
    props: {
        stickyTop: {
            type: Number,
            default: 0
        },
        zIndex: {
            type: Number,
            default: 10
        },
        className: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            active: false,
            parentPosition: 'sticky',
            childPisition: 'relative',
            childTop: 0,
            width: undefined,
            height: undefined
        }
    },
    mounted() {
        const rect = this.$el.getBoundingClientRect()
        this.height = rect.height

        if(!this.isSupportCss('position', 'sticky')){
            // this.parentPosition = 'relative'
            // this.childPisition = 'fixed'
            // this.childTop = rect.top +'px'
            // this.width = rect.width + 'px'
        }

    },
    methods: {
        // 是否支持CSS3属性
        isSupportCss(prop, val) {
            const div = document.createElement('div')
            div.style[prop] = val
            return div.style[prop] === val
        }
    }
}
</script>
