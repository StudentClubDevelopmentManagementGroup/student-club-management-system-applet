<template>
	<view class="main-content">
		
	</view>
</template>

<script>
	export default {
		name:"Tabbar",
		data() {
			return {
				tabList:[
					{
						path:"pages/notice/notice",
						title:"公告"
						
					},
					{
						path:"pages/mySelf/mySelf",
						
					}
				]
			};
		}
	}
</script>

<style scoped>
	.main-content{
		background-color: white;
		position: fixed;
		z-index: 100;
		left: 0;
		bottom: 0;
		width: 100vw;
		height: 56px;
		display: flex;
		
	}

</style>