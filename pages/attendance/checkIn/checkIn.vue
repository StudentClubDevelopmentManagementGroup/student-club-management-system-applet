<template>
	<view class="container" style="background-image: url('/static/images/背景.jpg');">
		<!-- 第一部分：时间计时 -->
		<view class="section timer-section">
			<p class="timer">{{ formattedTime }}</p>
			<!-- 显示当前选中的社团名称 -->
			<view class="club">
				<image class="club-icon" src="/static/svgs/位置.svg"></image>
				<p class="club-name" v-if="currentClub.clubName">{{ currentClub.clubName }}</p>
			</view>
		</view>

		<!-- 第二部分：打卡记录 -->
		<view class="section log-section">
			<!-- 获取当天最新签到状态 -->
			<view class="checkin">
				<image class="checkin_time" src="/static/svgs/签到时钟.svg"></image>
				<p class="checkin-status">{{ checkInStatus }}</p>
			</view>

			<view class="checkout">
				<image class="checkout_time" src="/static/svgs/签到时钟.svg"></image>
				<p>{{ checkOutStatus }}</p>
			</view>

			<view class=" week-duration">
				<image class="duration-icon" src="/static/svgs/打卡时长.svg"></image>
				<view v-if="attendanceDuration">
					<p>本周总计打卡时间: {{ formatDuration(attendanceDuration) }}</p>
				</view>
				<view v-else>
					<p>本周未出勤！</p>
				</view>
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
				attendanceDuration: "", // 存储考勤时长数据
				weekStart: "", // 本周开始时间
				weekEnd: "", // 本周结束时间
				isClockingIn: false, // 是否正在打卡
				timerInterval: null, // 用来存储计时器的 ID
				elapsedTime: 0, // 计时的秒数

				checkInStatus: "", // 用于存储签到状态
				checkOutStatus: "", //签退状态
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
			// 恢复打卡状态
			const savedClockingStatus = wx.getStorageSync('isClockingIn');
			if (savedClockingStatus === 'true') {
				this.isClockingIn = true;
				const clockStartTime = wx.getStorageSync('clockStartTime');
				if (clockStartTime) {
					this.elapsedTime = Math.floor((Date.now() - clockStartTime) / 1000); // 恢复计时
					this.timerInterval = setInterval(() => {
						this.elapsedTime = Math.floor((Date.now() - clockStartTime) / 1000); // 继续计时
					}, 1000);
				}
			} else {
				this.isClockingIn = false;
			};

			// // 发起请求获取本周考勤时长数据
			this.fetchAttendanceDuration();
			//获取本周开始和结束时间，并且发请求时长
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

			// 初始化每日重置计时器
			initDailyResetTimer() {
				// 当前时间
				const now = new Date();
				// 今天的23:59:59时间戳
				const resetTime = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate(),
					23, 59, 59, 999 // 设置到当天的 23:59:59.999
				).getTime();

				// 计算距离 23:59:59 的时间间隔（毫秒）
				const timeUntilReset = resetTime - now.getTime();

				// 设置定时器
				setTimeout(() => {
					this.resetElapsedTime(); // 到时间后重置计时
				}, timeUntilReset);
			},

			// 重置计时逻辑
			resetElapsedTime() {
				//console.log("时间已到 23:59:59，重置计时器");
				clearInterval(this.timerInterval); // 停止计时
				wx.removeStorageSync('clockStartTime'); // 清除本地保存的时间戳
				this.elapsedTime = 0; // 重置计时
				this.isClockingIn = false; //打卡按钮标志 未打卡
				wx.setStorageSync('isClockingIn', 'false');

			},

			//获取本周一和周日时间
			getWeekStartEnd() {
				const now = new Date();
				// 如果一个变量是只读的或者是常量（用 const 声明），那么试图修改它会导致 TypeError。

				console.log("当前时间", now);
				let dayOfWeek = now.getDay(); // 获取当前星期几 (0-6，0代表星期日，1代表星期一...)
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
				this.weekStart = this.formatDate(monday, '00:00:00');
				this.weekEnd = this.formatDate(sunday, '23:59:59');
				// 保存到本地存储
				wx.setStorageSync('weekStart', this.weekStart);
				wx.setStorageSync('weekEnd', this.weekEnd);

			},


			//获取用户当天最新打卡记录
			async fetchLatestCheckInRecord() {
				try {
					const response = await http.get("/attendance/getLatestCheckInRecord", {

						userId: this.userInfo.userId,
						clubId: this.currentClub.clubId
					});

					// 如果请求成功并且返回数据
					if (response.status_code === 200) {
						// 如果已经签到，展示签到时间
						const checkInTime = response.data.checkInTime; // 获取签到时间
						const checkoutTime = response.data.checkoutTime;
						this.checkInStatus = `${checkInTime}开始打卡`;
						if (checkoutTime === null) {
							this.checkOutStatus = "暂无离开时间";
						} else {
							this.checkOutStatus = `${checkoutTime}结束打卡`;
						}
					} else {
						this.checkInStatus = "尚未开始打卡"; // 如果没有签到记录
						this.checkOutStatus = "暂无离开时间";
					}
				} catch (error) {
					console.error("请求错误:", error);
					this.checkInStatus = "获取签到记录失败";
				}
				// console.log("当天最新签到状态", this.checkInStatus);
				// console.log("当天最新签退状态", this.checkOutStatus);
			},

			// 发起请求获取本周考勤时长
			async fetchAttendanceDuration() {
				// 从本地存储读取时间
				this.weekStart = wx.getStorageSync('weekStart');
				this.weekEnd = wx.getStorageSync('weekEnd');

				console.log("发请求的本周一时间", this.weekStart);
				console.log("发请求的本周日时间", this.weekEnd);

				try {

					const response = await http.post("/attendance/durationTime", {
						clubId: this.currentClub.clubId, // 直接使用 this.currentClub.clubId
						userName: " ", // 用户名可为空
						userId: this.userInfo.userId, // 直接使用 this.userInfo.userId
						startTime: this.weekStart, // 可以根据需求调整时间范围
						endTime: this.weekEnd,
					});

					// 检查请求是否成功
					if (response.status_code === 200 && response.data.length !== 0) {
						console.log("本周时长数据", response.data.length)
						this.attendanceDuration = response.data[0].attendanceDurationTime;
						console.log("用户一周打卡时长", this.attendanceDuration);
						console.log("本周时长数据", response.data)

					} else {
						console.error("请求失败:", response.status_text);
					}
				} catch (error) {
					console.error("请求错误:", error);
				}
			},


			async checkInRequest() {
				try {
					const response = await http.post("/attendance/checkIn", {
						clubId: this.currentClub.clubId,
						userId: this.userInfo.userId
					});
					if (response.status_code === 200 && response.data) {
						wx.setStorageSync('isClockingIn', 'true');
						this.initDailyResetTimer();
						this.isClockingIn = true;
						const startTime = Date.now();
						wx.setStorageSync('clockStartTime', startTime);
						this.timerInterval = setInterval(() => {
							this.elapsedTime++;
						}, 1000);

						// 获取最新记录更新状态
						this.fetchLatestCheckInRecord();
						uni.showToast({
							title: '签到成功',
							icon: 'success',
							duration: 2000,
						});
					} else {
						// 错误处理保持不变...
					}
				} catch (error) {
					// 错误处理保持不变...
				}
			},
			// 修改后的签退请求
			async checkOutRequest() {
				try {
					const response = await http.patch("/attendance/checkout", {
						clubId: this.currentClub.clubId,
						userId: this.userInfo.userId
					});
					if (response.status_code === 200 && response.data) {
						wx.setStorageSync('isClockingIn', 'false');
						this.isClockingIn = false;
						clearInterval(this.timerInterval);
						this.elapsedTime = 0;
						wx.removeStorageSync('clockStartTime');

						// 更新状态和时长
						this.fetchLatestCheckInRecord();
						setTimeout(() => {
							this.fetchAttendanceDuration();
						}, 500);

						uni.showToast({
							title: '签退成功',
							icon: 'success',
							duration: 2000,
						});
					} else {
						// 错误处理保持不变...
					}
				} catch (error) {
					// 错误处理保持不变...
				}
			},
			// 修改后的获取最新记录方法（确保处理空值）
			async fetchLatestCheckInRecord() {
				try {
					const response = await http.get("/attendance/getLatestCheckInRecord", {
						userId: this.userInfo.userId,
						clubId: this.currentClub.clubId
					});
					if (response.status_code === 200) {
						const record = response.data;
						this.checkInStatus = record.checkInTime ?
							`${record.checkInTime} 开始打卡` : "尚未开始打卡";
						this.checkOutStatus = record.checkoutTime ?
							`${record.checkoutTime} 结束打卡` : "暂无离开时间";
					} else {
						this.checkInStatus = "尚未开始打卡";
						this.checkOutStatus = "暂无离开时间";
					}
				} catch (error) {
					console.error("请求错误:", error);
					this.checkInStatus = "获取记录失败";
					this.checkOutStatus = "获取记录失败";
				}
			},

			// 将秒数转换为时:分:秒格式
			formatDuration(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const remainingSeconds = seconds % 60;
				return `${hours}小时${minutes}分钟${remainingSeconds}秒`;

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
				this.checkInRequest();
			},

			// 结束打卡
			endClockingIn() {
				this.checkOutRequest();
			},



			//获取签到时间前一秒
			getCurrentTime() {
				let now = new Date();
				let oneSecondAgo = new Date(now.getTime() - 1000); // 减去 1000 毫秒，即 1 秒
				return oneSecondAgo;

			},


			// 将时间格式化为 yyyy-mm-dd hh:mm:ss
			requestFormatDate(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},

			formatDate(date, time) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day} ${time}`;
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