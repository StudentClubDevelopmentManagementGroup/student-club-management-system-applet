<template>
	<view class="tabbar">
		<view v-for="item in list" :key="item.text" @click="switchTabBar(item.pagePath)" 
		class="item" :class="currentPagePath === item.pagePath?'active':''">
			<image :src="item.pagePath === currentPagePath?item.selectedIconPath:item.iconPath"></image>
			<text>{{item.text}}</text>
		</view>
		<view class="midButton" :class="currentPagePath === midButtonIcon.pagePath?'active':''" v-if="list.length % 2 == 0" @click="switchTabBar(midButtonIcon.pagePath)">
			<image :src="currentPagePath === midButtonIcon.pagePath?midButtonIcon.selectedIconPath:midButtonIcon.iconPath"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-tabbar",
		data() {
			return {
				midButtonIcon:{
					"pagePath": "/pages/functionArea/functionArea",
					"iconPath": "../../static/images/tabbar_function.png",
					"selectedIconPath": "../../static/images/tabbar_function_selected.png",
				},
				list:[
					{
						"pagePath": "/pages/notice/notice",
						"iconPath": "../../static/images/tabbar_notice.png",
						"selectedIconPath": "../../static/images/tabbar_notice_selected.png",
						"text": "公告"
					},
					{
						"pagePath": "/pages/mySelf/mySelf",
						"iconPath": "../../static/images/people.png",
						"selectedIconPath": "../../static/images/people_selected.png",
						"text": "我的"
					},
			
				]
			};
		},
		props:{
			currentPagePath:String,
		},
		methods:{
			switchTabBar(pagePath){
				uni.reLaunch({
					url:pagePath
				})
			}
		}
	}
</script>

<style scoped>
@import url(./my-tabbar.css);
</style>