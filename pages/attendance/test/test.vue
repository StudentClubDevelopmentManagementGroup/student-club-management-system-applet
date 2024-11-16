<template>
	<view class="container">
		<!-- 显示当前选中的社团名称 -->
		<p v-if="currentClub.clubName">{{ currentClub.clubName }}</p>

		<!-- 显示学号 -->
		<p>学号: {{ userInfo.userId }}</p>
		<!-- 显示当前社团的 ID -->
		<p v-if="currentClub.clubId">社团 ID: {{ currentClub.clubId }}</p>

		<!-- 判断签到状态 -->
		<p>{{ checkInStatus }}</p>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

	export default {
		data() {
			return {
				currentClub: {}, // 存储当前社团信息
				userInfo: {}, // 存储用户信息
				checkInStatus: '加载中...', // 用于存储签到状态
			};
		},

		onLoad() {
			// 获取全局数据
			const app = getApp();
			const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
			const userInfo = app.globalData.userData?.userInfo || {}; // 获取用户信息
			this.userInfo = userInfo; // 将用户信息存储到 data 中

			// 获取当前选中的社团索引，确保全局数据的正确访问
			const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;

			// 根据当前选择的社团下标获取当前社团信息
			const selectedClub = clubInfo[currentClubIndex] || {};

			// 将当前社团信息存储到 data 中
			this.currentClub = selectedClub;

			// 获取签到记录
			this.fetchLatestCheckInRecord();
		},

		methods: {
			async fetchLatestCheckInRecord() {
				try {
					const response = await http.get("/attendance/getLatestCheckInRecord", {

						userId: this.userInfo.userId,
						clubId: this.currentClub.clubId,
					});

					console.log("当前用户登录id", this.userInfo.userId);
					console.log("当前用户选择社团id", this.currentClub.clubId);

					// 如果请求成功并且返回数据
					if (response.status_code === 200) {
						// 如果已经签到，展示签到时间
						const checkInTime = response.data.checkInTime; // 获取签到时间
						const signInTime = new Date(checkInTime);
						this.checkInStatus = `已签到，时间: ${signInTime.toLocaleTimeString()}`;
					} else {
						this.checkInStatus = "尚未开始打卡"; // 如果没有签到记录
					}
				} catch (error) {
					console.error("请求错误:", error);
					this.checkInStatus = "获取签到记录失败";
				}
				console.log("签到状态", this.checkInStatus);
			},
		},
	};
</script>

<style scoped>
	/* 样式可以根据需求调整 */
</style>