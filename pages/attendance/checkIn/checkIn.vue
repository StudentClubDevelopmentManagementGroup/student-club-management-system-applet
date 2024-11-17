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
			<!-- 获取当天最新签到状态 -->
			<p>{{ checkInStatus }}</p>
			<p>{{ signOutTimeTest }}</p>

			<!-- 			<p>{{ signInTime ? signInTime +  ' 开始打卡' : '尚未开始打卡' }}</p>
			<p>{{ signOutTime ? signOutTime +' 结束打卡': '暂无离开时间' }} </p> -->

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

		<!-- 第四部分：签到按钮 -->
		<view class="button-section">
			<button @click="checkInRequest()" class="clocking-button">
				签到按钮
			</button>
		</view>

		<!-- 第五部分：签退按钮 -->
		<view class="button-section">
			<button @click="checkOutRequest()" class="clocking-button">
				签退按钮
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
				signOutTimeTest: "", //签退状态
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
			this.fetchAttendanceDuration();
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

			//获取本周一和周日时间
			getWeekStartEnd() {
				const now = new Date();
				// 如果一个变量是只读的或者是常量（用 const 声明），那么试图修改它会导致 TypeError。

				console.log("当前时间", now);
				let dayOfWeek = now.getDay(); // 获取当前星期几 (0-6，0代表星期日，1代表星期一...)
				console.log("今天是", dayOfWeek)
				// 计算本周一的日期
				// 将星期日视为本周的最后一天
				if (dayOfWeek === 0) {
					dayOfWeek = 7; // 把星期日视为第7天
				}

				const monday = new Date(now);
				monday.setDate(now.getDate() - dayOfWeek + 1); // 将当前日期设置为本周一

				// 计算本周日的日期
				const sunday = new Date(now);
				sunday.setDate(now.getDate() - dayOfWeek + 7); // 将当前日期设置为本周日

				// 设置时间格式为 "yyyy-mm-dd 00:00:00" 和 "yyyy-mm-dd 23:59:59"
				this.weekStart = this.formatDate(monday, "00:00:00");
				this.weekEnd = this.formatDate(sunday, "23:59:59");
				// console.log("本周一时间", this.weekStart);
				// console.log("本周日时间", this.weekEnd);
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

					// 如果请求成功并且返回数据
					if (response.status_code === 200) {
						// 如果已经签到，展示签到时间
						const checkInTime = response.data.checkInTime; // 获取签到时间
						const checkoutTime = new Date(response.data.checkoutTime);
						const signInTime = new Date(checkInTime);
						console.log("最新签到时间", signInTime);
						this.checkInStatus = `${this.requestFormatDate(signInTime)}开始打卡`;

						if (checkoutTime === null) {
							this.signOutTimeTest = "暂无离开时间";
						} else {
							this.signOutTimeTest = `${this.requestFormatDate(checkoutTime)}结束打卡`;
						}

					} else {
						this.checkInStatus = "尚未开始打卡"; // 如果没有签到记录
					}
				} catch (error) {
					console.error("请求错误:", error);
					this.checkInStatus = "获取签到记录失败";
				}
				console.log("当天最新签到状态", this.checkInStatus);
			},



			// 发起请求获取本周考勤时长
			async fetchAttendanceDuration() {
				try {

					const response = await http.post("/attendance/durationTime", {
						clubId: this.currentClub.clubId, // 直接使用 this.currentClub.clubId
						userName: "", // 用户名可为空
						userId: this.userInfo.userId, // 直接使用 this.userInfo.userId
						startTime: this.weekStart, // 可以根据需求调整时间范围
						endTime: this.weekEnd,

						// "startTime": "2024-11-11 00:00:00",
						// "endTime": "2024-11-17 23:59:59"
					});

					console.log("当前登录用户id", this.userInfo.userId);
					console.log("当前用户选择社团id", this.currentClub.clubId);
					console.log("本周一时间", this.weekStart);
					console.log("本周日时间", this.weekEnd);
					// 检查请求是否成功
					if (response.status_code === 200 && response.data) {
						this.attendanceData = response.data[0];
						console.log("用户一周打卡时长", this.attendanceData.attendanceDurationTime);

					} else {
						console.error("请求失败:", response.status_text);
					}
				} catch (error) {
					console.error("请求错误:", error);
				}
			},

			// 发起签到请求
			async checkInRequest() {
				try {
					// 发起 HTTP POST 请求
					const response = await http.post("/attendance/checkIn", {
						clubId: this.currentClub.clubId, // 使用 this.currentClub.clubId
						userId: this.userInfo.userId, // 使用 this.userInfo.userId
						checkInTime: this.requestFormatDate(new Date()), // 调用 getCurrentTime 获取签到时间
					});
					console.log("签到时间",this.requestFormatDate(new Date()) )

					// 检查请求是否成功
					if (response.status_code === 200 && response.data) {
						// 假设返回的数据格式中 data 是一个对象
						this.attendanceData = response.data;
						console.log("签到成功:", this.attendanceData);
					} else {
						console.error("请求失败:", response.status_text);
					}
				} catch (error) {
					console.error("请求错误:", error);
				}
			},
			
			// 发起签退请求
			async checkOutRequest() {
				try {
					// 发起 HTTP POST 请求
					const response = await http.patch("/attendance/checkout", {
						clubId: this.currentClub.clubId, // 使用 this.currentClub.clubId
						userId: this.userInfo.userId, // 使用 this.userInfo.userId
						checkoutTime: this.requestFormatDate(new Date()), // 调用 getCurrentTime 获取签到时间
					});
					console.log("签退时间",this.requestFormatDate(new Date()))
			
					// 检查请求是否成功
					if (response.status_code === 200 && response.data) {
						// 假设返回的数据格式中 data 是一个对象
						this.attendanceData = response.data;
						console.log("签退成功:", this.attendanceData);
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

				// 打印到控制台
				console.log('Hours:', hours);
				console.log('Minutes:', minutes);
				console.log('Remaining Seconds:', remainingSeconds);
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
				this.signInTime = this.requestFormatDate(new Date());
				console.log("打卡时间", this.signInTime);
				this.isClockingIn = true;
				this.elapsedTime = 0; // 重置计时
				this.timerInterval = setInterval(() => {
					this.elapsedTime++; // 每秒增加1秒
				}, 1000);
			},

			// 结束打卡
			endClockingIn() {
				this.signOutTime = this.requestFormatDate(new Date());
				console.log("签退时间", this.signOutTime);
				this.isClockingIn = false;
				clearInterval(this.timerInterval); // 停止计时
				this.elapsedTime = 0; // 重置计时
			},


			
			// 获取当前时间并格式化为 yyyy-mm-dd hh:mm:ss
			//requestFormatDate(new Date())

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