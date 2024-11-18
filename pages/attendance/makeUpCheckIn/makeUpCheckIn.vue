<template>
	<view>
		<!-- 显示学号 -->
		<p>学号: {{ userInfo.userId }}</p>

		<!-- 显示姓名 -->
		<p>姓名: {{ userInfo.name }}</p>

		<!-- 显示当前选中的社团名称 -->
		<p v-if="currentClub.clubName">当前选中的社团：{{ currentClub.clubName }}</p>

		<!-- 显示当前社团的 ID -->
		<p v-if="currentClub.clubId">社团 ID: {{ currentClub.clubId }}</p>

		<!-- 当没有社团信息时展示 -->
		<view v-else>
			<text>暂无社团信息</text>
		</view>

		<!-- 显示本周开始和结束时间 -->
		<p>本周开始时间: {{ weekStart }}</p>
		<p>本周结束时间: {{ weekEnd }}</p>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentClub: {}, // 存储当前社团信息
				userInfo: {}, // 存储用户信息
				weekStart: "", // 本周开始时间
				weekEnd: "" // 本周结束时间
			};
		},
		onLoad() {
			// 获取全局数据
			const app = getApp();
			const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
			console.log("社团信息:", clubInfo); // 打印社团信息

			// 获取用户信息
			const userInfo = app.globalData.userData?.userInfo || {};
			console.log("用户信息:", userInfo); // 打印用户信息
			this.userInfo = userInfo; // 将用户信息存储到 data 中

			// 获取当前选中的社团索引，确保全局数据的正确访问
			const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;

			// 根据当前选择的社团下标获取当前社团信息
			const selectedClub = clubInfo[currentClubIndex] || {};

			// 将当前社团信息存储到 data 中
			this.currentClub = selectedClub;

			// 获取本周开始和结束时间
			this.getWeekStartEnd();
		},

		methods: {
			getWeekStartEnd() {
				const now = new Date('2024-11-01');
				console.log("时间", now);
				const dayOfWeek = now.getDay(); // 获取当前星期几 (0-6，0代表星期日，1代表星期一...)

				// 计算本周一的日期
				const monday = new Date(now);
				monday.setDate(now.getDate() - dayOfWeek + 1); // 将当前日期设置为本周一

				// 计算本周日的日期
				const sunday = new Date(now);
				sunday.setDate(now.getDate() - dayOfWeek + 7); // 将当前日期设置为本周日

				// 设置时间格式为 "yyyy-mm-dd 00:00:00" 和 "yyyy-mm-dd 23:59:59"
				this.weekStart = this.formatDate(monday, "00:00:00");
				this.weekEnd = this.formatDate(sunday, "23:59:59");
			},

			formatDate(date, time) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day} ${time}`;
			}
		}
	};
</script>

<style scoped>
	/* 页面样式，可以根据需要修改 */
	p {
		font-size: 16px;
		color: #333;
		margin: 10px 0;
	}

	text {
		font-size: 16px;
		color: #333;
		margin: 5px 0;
	}
</style>