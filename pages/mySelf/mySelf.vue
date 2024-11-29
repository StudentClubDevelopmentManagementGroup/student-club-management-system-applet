<template>
	<view id="main-content" style="background-image: url('/static/images/背景.jpg');">
		<view id="user-info">
			<image id="avatar" src="../../static/images/avatars/特异人士2.png"></image>
			<view style="display: flex;flex-direction: column;">
				<text id="user-name">{{userName}}</text>
				<text id="user-department">{{app.globalData.appData.currentClubIndex === null?'暂无社团':clubName}}</text>
			</view>
			<picker id="setting"
				mode="selector"
				:range="app.globalData.userData.clubInfo"
				range-key="clubName"
				:value="app.globalData.appData.currentClubIndex"
				@change="changeClub"
				:disabled="disablePicker"
			>
				<image src="../../static/svgs/mySelf_setting.svg"></image>
			</picker>
		</view>
		<view id="functionArea1">
			<view class="item" @click="developing()">
				<image src="../../static/svgs/mySelf_补卡进程.svg"></image>
				<text>补卡进程</text>
			</view>
			<view class="item" @click="toViewRecord()">
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
			<view class="item" @click="reportBug()">
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
	<!--
	<my-tabbar currentPagePath="/pages/notice/notice"></my-tabbar>
	-->
</template>

<script>
	import http from "@/utils/http.ts"
	export default {
		data() {
			return {
				app: null,
				userName: "",
				userDepartment: "",
				clubName:"",
				disablePicker:null
			}
		},
		onLoad() {
			this.app = getApp()
			this.userName = this.app.globalData.userData.userInfo.name
			if(this.app.globalData.appData.currentClubIndex !== null){
				this.disablePicker = false
				this.clubName = this.app.globalData.userData.clubInfo[this.app.globalData.appData.currentClubIndex].clubName
			}
			else{
				this.disablePicker = true
				this.clubName = "暂无社团"
			}
		},

		methods: {
			toViewRecord() {
				// 跳转到指定的路由页面
				uni.navigateTo({
					url: '/pages/attendance/viewRecord/viewRecord'
				});
			},
			toTest() {
				// 跳转到指定的路由页面
				uni.navigateTo({
					url: '/pages/attendance/test/test'
				});
			},
			changeClub(e){
				let index = e.detail.value
				this.app.globalData.appData.currentClubIndex = index
				this.clubName = this.app.globalData.userData.clubInfo[index].clubName
				uni.showToast({
					title:"切换社团成功",
					icon:'success'
				})
			},
			exit() {
				http.post("/user/logout")
				this.app.globalData.appData.currentClubIndex = null
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
			},
			reportBug() {
				uni.navigateTo({
					url: "/pages/report-bug/ReportBug"
				})
			}
		}
	}
</script>

<style scoped>
	@import url(./mySelf.css);
</style>