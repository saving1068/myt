<template>
    <store-article isEdit :id="id" />
</template>


<script>
import StoreArticle from '../component/StoreArticle'
export default {
    props: ['id'],
    components: {StoreArticle}
}
</script>