<template>
	<view id="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view class="content">
			<view class="content-header">
				<image src="../../static/svgs/functionArea_app.svg"></image>
				<text> 日 / 常 / 打 / 卡</text>
				<image src="../../static/svgs/functionArea_app.svg"></image>
			</view>
			<view class="content-body">
				<view class="item" @click="developing()">
					<image style="background-color: #759fe0;" src="/static/svgs/functionArea_打卡.svg"></image>
					<text style="color: #759fe0;">打卡</text>
				</view>
				<view class="item" @click="developing()">
					<image style="width: 36px; height: 36px; padding: 14px; background-color: #8898f2;" src="/static/svgs/functionArea_补卡.svg"></image>
					<text style="color: #8898f2;">补卡</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content-header">
				<image src="../../static/svgs/functionArea_info.svg"></image>
				<text> 社 / 团 / 信 / 息</text>
				<image src="../../static/svgs/functionArea_info.svg"></image>
			</view>
			<view class="content-body">
				<view class="item" @click="developing()">
					<image style="width: 40px; height: 40px; padding: 12px;	background-color: #9f92f2;" src="/static/svgs/functionArea_座位.svg"></image>
					<text style="color: #9f92f2;">座位表</text>	
				</view>
				<view class="item" @click="developing()">
					<image style="	background-color: #72cde6;" src="/static/svgs/functionArea_值日.svg"></image>
					<text style="color: #72cde6;">值日表</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
			developing(){
				uni.showToast({
					title:"该功能正在开发",
					icon:"none"
				})
				return
			}
		}
	}
</script>

<style lang="css" scoped>
	@import url(./functionArea.css);
</style>
