<template>
	<view class="container">
		<!-- 第一部分：时间计时 -->
		<view class="section timer-section">
			<p>{{ formattedTime }}</p>
			<!-- 显示当前选中的社团名称 -->
			<p v-if="currentClub.clubName">{{ currentClub.clubName }}</p>
		</view>

		<!-- 第二部分：打卡记录 -->
		<view class="section log-section">
			<!-- 判断签到状态 -->
			<p>{{ checkInStatus }}</p>
			<p>{{ signInTime ? signInTime +  ' 开始打卡' : '尚未开始打卡' }}</p>

			<p>{{ signOutTime ? signOutTime +' 结束打卡': '暂无离开时间' }} </p>
			<view v-if="attendanceData.userId">
				<p>本周总计打卡时间: {{ formatDuration(attendanceData.attendanceDurationTime) }}</p>
			</view>
			<view v-else>
				<p>加载数据中...</p>
			</view>
		</view>

		<!-- 第三部分：单一按钮 -->
		<view class="button-section">
			<button @click="toggleClocking" class="clocking-button">
				{{ isClockingIn ? '结束打卡' : '开始打卡' }}
			</button>
		</view>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

	export default {
		data() {
			return {
				
				currentClub: {}, // 存储当前社团信息
				userInfo: {}, // 存储用户信息
				attendanceData: {}, // 用对象来存储单个用户的数据
				weekStart: "", // 本周开始时间
				weekEnd: "", // 本周结束时间
				signInTime: null, // 签到时间
				signOutTime: null, // 签退时间
				isClockingIn: false, // 是否正在打卡
				timerInterval: null, // 用来存储计时器的 ID
				elapsedTime: 0, // 计时的秒数
				
				checkInStatus: "", // 用于存储签到状态
			};
		},

		onLoad() {
			// 获取全局数据
			const app = getApp();
			const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
			const userInfo = app.globalData.userData?.userInfo || {};
			this.userInfo = userInfo; // 将用户信息存储到 data 中

			// 获取当前选中的社团索引，确保全局数据的正确访问
			const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;

			// 根据当前选择的社团下标获取当前社团信息
			const selectedClub = clubInfo[currentClubIndex] || {};

			// 将当前社团信息存储到 data 中
			this.currentClub = selectedClub;

			// 发起请求并获取数据
			this.fetchAttendanceData();
			// 获取本周开始和结束时间
			this.getWeekStartEnd();
			// 获取签到记录
			this.fetchLatestCheckInRecord();
		},

		computed: {
			formattedTime() {
				const hours = String(Math.floor(this.elapsedTime / 3600)).padStart(2, '0');
				const minutes = String(Math.floor((this.elapsedTime % 3600) / 60)).padStart(2, '0');
				const seconds = String(this.elapsedTime % 60).padStart(2, '0');
				return `${hours} : ${minutes} : ${seconds}`;
			},
		},

		methods: {
			
			
			getWeekStartEnd() {
				const now = new Date();

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
				console.log("本周一时间", this.weekStart);
				console.log("本周日时间", this.weekEnd);
			},

			formatDate(date, time) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day} ${time}`;
			},
			//获取用户当天最新打卡记录
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
						console.log("签到时间",signInTime);
						this.checkInStatus = `已签到，时间: ${this.requestFormatDate(signInTime)}`;
					} else {
						this.checkInStatus = "尚未开始打卡"; // 如果没有签到记录
					}
				} catch (error) {
					console.error("请求错误:", error);
					this.checkInStatus = "获取签到记录失败";
				}
				console.log("签到状态", this.checkInStatus);
			},
			


			// 发起请求获取考勤数据
			async fetchAttendanceData() {
				try {
					const response = await http.post("/attendance/durationTime", {
						clubId: 36, // 直接使用 this.currentClub.clubId
						userName: "", // 用户名可为空
						userId: "2100301816", // 直接使用 this.userInfo.userId
						startTime: "2024-09-09 00:00:00", // 可以根据需求调整时间范围
						endTime: "2024-09-15 23:59:59",
					});
					console.log("当前登录用户id", this.userInfo.userId);
					console.log("当前用户选择社团id", this.currentClub.clubId);
					// 检查请求是否成功
					if (response.status_code === 200 && response.data) {
						this.attendanceData = response.data[0];
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
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const remainingSeconds = seconds % 60;
				return `${hours} 小时 ${minutes} 分钟 ${remainingSeconds} 秒`;
			},

			// 切换打卡状态
			toggleClocking() {
				if (this.isClockingIn) {
					this.endClockingIn();
				} else {
					this.startClockingIn();
				}
			},

			// 开始打卡
			startClockingIn() {
				this.signInTime = this.getCurrentTime();
				console.log("打卡时间", this.signInTime);
				this.isClockingIn = true;
				this.elapsedTime = 0; // 重置计时
				this.timerInterval = setInterval(() => {
					this.elapsedTime++; // 每秒增加1秒
				}, 1000);
			},

			// 结束打卡
			endClockingIn() {
				this.signOutTime = this.getCurrentTime();
				console.log("签退时间", this.signOutTime);
				this.isClockingIn = false;
				clearInterval(this.timerInterval); // 停止计时
				this.elapsedTime = 0; // 重置计时
			},


			// 获取当前时间并格式化为 yyyy-mm-dd hh:mm:ss
			getCurrentTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			
			requestFormatDate(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},


		},

		beforeDestroy() {

			// 清理计时器，避免内存泄漏
			if (this.timerInterval) {
				clearInterval(this.timerInterval);
			}
		},
	};
</script>

<style scoped>
	@import url(./checkIn.css);
</style>