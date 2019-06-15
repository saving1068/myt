<template>
    <div class="top-filter" :class="isBetWeen ? 'between' : ''">
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        isBetWeen: Boolean
    }
}
</script>

<style lang="scss" scoped>
.top-filter {
    position: relative;
    display:flex;
    padding:12px;
    background:#fff;
    box-shadow: 0 1px 4px rgba(0,0,0,.1);

    &.between {
        justify-content: space-between;
    }
}
</style>
