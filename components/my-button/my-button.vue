<template>
	<view class="main_content" :class="isLoading?'loading':''">
		<text>{{text}}</text>
		<image v-show="isLoading" src="./loading.gif"></image>
	</view>
</template>

<script>
	export default {
		name:"my-button",
		props:{
			text:String,
			isLoading:Boolean
		},
	}
</script>

<style scoped>
	.main_content{
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #0272af;
		transition: 0.3s all;
	}
	.main_content.loading{
		background-color: #015c8d;
		pointer-events: none
	}
	image{
		height: 75%;
		width: auto;
		aspect-ratio: 1;
	}
	

</style>