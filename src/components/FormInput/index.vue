<template>
    <div class="account-form-input">
		<div v-if="classType == 'price'" class="price-box">
			<el-input  v-model="val" :maxlength="max" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
			<span>元</span>
		</div>
		
		
		<div v-if="classType == 'bigInput'" class="bigInput">
			<el-input  v-model="val" :maxlength="max" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
			<span class="total"><i>{{val.length || 0}}</i> / {{max}}</span>
		</div>
		
		
		<div v-if = "classType == 'bigTextarea'"  class="bigTextarea">
			<el-input type='textarea' resize="none" :autosize="{ minRows: 2, maxRows: 4}" v-model="val" :maxlength="max" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
			<span  class="total"><i>{{val.length || 0}}</i> / {{max}}</span>
		</div>
		
		
		<div v-if="classType == 'input'" class="input-box">
			<el-input v-if="classType == 'input'" v-model="val" :maxlength="max" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
			<span v-if="classType == 'input'||classType == 'textarea'" class="total"><i>{{val.length || 0}}</i> / {{max}}</span>
		</div>
		
		
		<div v-if="classType == 'textarea'" class="input-box">
			<el-input v-if="classType == 'textarea'" type='textarea' resize="none" :autosize="{ minRows: 2, maxRows: 4}" v-model="val" :maxlength="max" :size="size" :disabled="disabled" :placeholder="placeholder"></el-input>
			<span v-if="classType == 'input'||classType == 'textarea'" class="total"><i>{{val.length || 0}}</i> / {{max}}</span>
		</div>
    </div>
</template>

<script>
export default {
	created() {
		// console.log(this.classType)
	},
    props: {
		classType:'',
        value: '',
        disabled: Boolean,
        size: String,
        max: {
            type: Number,
            default: 11
        },
        placeholder: String
    },
    data() {
        return {
            val: this.value
        }
    },
    watch: {
        value(val) {
            this.val = val
        },
        val(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        change(val) {
            if(val && val.length > this.max){
                return 
            }
        }
    }
}
</script>

<style lang="scss">
.account-form-input {
    position: relative;
    width: 370px;
    display: inline-block;
    vertical-align: top;
	
	.bigInput{
		width: 345px;
		position: relative;
		.el-input {
			width: 280px;
		}
		
	}
	 .bigTextarea{
		 position: relative;
		 width: 360px;
		 .el-textarea{
		 	width: 280px;
		 }
	 }
	 .input-box{
		 position: relative;
		 width: 280px;
		 display: inline-block;
		 vertical-align: top;
	 }
	.price-box{
		position: relative;
		.el-input{
			width: 260px;
		}
		span{
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}

    .total {
        position: absolute;
        right: 15px;
        top:50%;
        transform: translateY(-50%);
        color:#999;
        i {
            color: #ff0000;
        }
    }
}
</style>

