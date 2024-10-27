<template>
	<view id="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view id="user-info">
			<image id="avatar" src="../../static/images/avatars/特异人士2.png"></image>
			<view style="display: flex;flex-direction: column;">
				<text id="user-name">{{userName}}</text>
				<!-- <text id="user-department">XXXX社团</text> -->
			</view>
			<image @click="developing()" id="setting" src="../../static/svgs/mySelf_setting.svg"></image>
		</view>
		<view id="functionArea1">
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_补卡进程.svg"></image>
				<text>补卡进程</text>
			</view>
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_签到详情.svg"></image>
				<text>签到详情</text>
			</view>
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_账号安全.svg"></image>
				<text>账号安全</text>
			</view>
		</view>
		<view id="functionArea2">
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_help.svg"></image>
				<text>帮助中心</text>
			</view>
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_issue.svg"></image>
				<text>问题反馈</text>
			</view>
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_aboutUs.svg"></image>
				<text>关于我们</text>
			</view>
			<view class="item" @click="exit()">
				<image src="../../static/svgs/mySelf_exit.svg"></image>
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"
	export default {
		data() {
			return {
				app: null,
				userName: "",
				userDepartment: "",
			}
		},
		onLoad() {
			this.app = getApp()
			this.userName = this.app.globalData.userData.userInfo.name
		},

		methods: {
			exit() {
				http.post("/user/logout")
				uni.reLaunch({
					url: "/pages/login/login"
				})

			},
			developing() {
				uni.showToast({
					title: "该功能正在开发",
					icon: "none"
				})
				return
			}
		}
	}
</script>

<style scoped>
	@import url(./mySelf.css);
</style>