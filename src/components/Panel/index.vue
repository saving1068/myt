<template>
    <div class="app-panel boxshadow">
        <div class="app-panel__head" v-if="showHead"><slot name="head" /></div>

        <template v-if="$slots.content">
            <slot name="content" />
        </template>
        <template v-else>
            <div class="app-panel__content" v-if="showContent">
                <slot />
            </div>
        </template>

        <div class="app-panel__foot" v-if="showFoot">
            <slot name="foot" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showHead: {
            type: Boolean,
            default: true
        },
        showContent: {
            type: Boolean,
            default: true
        },
        showFoot: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/var';

.app-panel {
    background:#fff;

    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:10px 15px;
        
        span,.left {
            font-size: 20px;
            line-height: 24px;

            .small {
                font-size: 14px;
                color:#666;
            }
        }

        .right {
            font-size: 12px;
            color:#aaa;
        }
    }

    &__content {
        padding: 10px;
        min-height: 50px;
        border-top:1px  solid $borderColor;
    }
}
</style>
