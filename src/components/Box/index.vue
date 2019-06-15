<template>
    <div class="app-box">
        <div class="app-box__head">
            <template v-if="$slots.head">
                <slot name="head" />
            </template>
            <span class="title" v-else>{{title}}</span>
        </div>
        <div class="app-box__content">
            <slot />
        </div>
    </div>
</template>


<script>
export default {
    props: {
        title: [String, Number]
    }
}
</script>

<style lang="scss" scoped>
.app-box {
    &__head {
        padding:10px;
        background: #eef1f6;

        .title {
            font-size: 16px;
        }
    }

    &__content {
        padding:10px 20px;
    }
}
</style>
