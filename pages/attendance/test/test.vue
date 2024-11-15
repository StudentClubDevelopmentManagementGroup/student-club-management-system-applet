<template>
	<view>
		<h2>考勤时长信息</h2>
		<view v-if="attendanceData.userId">
			<p>用户ID: {{ attendanceData.userId }}</p>
			<p>用户名称: {{ attendanceData.userName }}</p>
			<p>俱乐部名称: {{ attendanceData.clubName }}</p>
			<p>考勤时长: {{ formatDuration(attendanceData.attendanceDurationTime) }}</p>
		</view>
		<view v-else>
			<p>加载数据中...</p>
		</view>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

	export default {
		data() {
			return {
				attendanceData: {}, // 用对象来存储单个用户的数据
			};
		},

		mounted() {
			// 发起请求并获取数据
			this.fetchAttendanceData();
		},

		methods: {

			async fetchAttendanceData() {
				try {
					const response = await http.post("/attendance/durationTime", {
						clubId: 36,
						userName: "",
						userId: "2100301816",
						startTime: "2024-09-09 00:00:00",
						endTime: "2024-09-15 23:59:59",
					});

					// 检查请求是否成功
					if (response.status_code === 200 && response.data.length > 0) {
						this.attendanceData = response.data[0]; // 只取第一个用户数据
						console.log("用户一周打卡时长", this.attendanceData);
					} else {
						console.error("请求失败:", response.status_text);
					}
				} catch (error) {
					console.error("请求错误:", error);
				}
			},

			// 将秒数转换为时:分:秒格式
			formatDuration(seconds) {
				const hours = Math.floor(seconds / 3600); // 计算小时
				const minutes = Math.floor((seconds % 3600) / 60); // 计算分钟
				const remainingSeconds = seconds % 60; // 计算剩余的秒数

				// 格式化为时:分:秒
				return `${hours}小时 ${minutes}分钟 ${remainingSeconds}秒`;
			}
		},
	};
</script>

<style scoped>
	/* 样式可以根据需求调整 */
</style>