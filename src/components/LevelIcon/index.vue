<template>
    <span class="level-icon" :style="className">
        <slot />
    </span>
</template>

<script>
export default {
    props: {
        background: {
            type: String,
            default: '#ffcc00'
        },
        color: {
            type: String,
            default: '#ffffff'
        }
    },
    computed: {
        className() {
            return {
                background: this.background,
                color: this.color
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.level-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right:5px;
    line-height: 18px;
    font-size: 14px;
    background: #ffcc00;
    color:#333;
    border-radius: 2px;
    text-align: center;
}
</style>

