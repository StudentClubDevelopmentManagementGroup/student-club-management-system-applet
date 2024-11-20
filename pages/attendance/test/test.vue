<template>
	<view class="container">
		<!-- 顶部提示词 -->
		<view class="header-tips">
			<text>补卡</text>
		</view>

		<!-- 第二部分：展示考勤记录 -->
		<scroll-view class="attendance-list" scroll-y :scroll-with-animation="true" @scrolltolower="loadMoreRecords">
			<view v-if="attendanceRecords.length > 0">
				<view v-for="(record, index) in attendanceRecords" :key="index" class="record-item">
					<view class="record-info">
						<view>
							<text>签到时间：{{ record.checkInTime }}</text>
						</view>
						<view>
							<text>签退时间：{{ "未签退"  }}</text>
						</view>
						<!-- 弹出选择日期和时间的区域 -->
						<view v-if="showPickerDialog" class="picker-dialog">
							<view class="picker-container">
								<view>
									<view>
										<text>签到时间：{{ record.checkInTime }}</text>
									</view>
									<view>
										<text>签退时间：{{ selectedDateTime || "未签退" }}</text>
									</view>
								</view>

								<view>

									<!-- 时间选择器 -->
									<picker mode="time" @change="(e) => onTimeChange(e, record.checkInTime)">
										<button type="default">选择时间</button>
									</picker>
									<!-- 关闭弹窗按钮 -->
									<button type="default" @click="closePickerDialog">关闭</button>
								</view>


							</view>
						</view>
					</view>

					<!-- 右侧申请补卡按钮 -->
					<view class="apply-makeup-btn">
						<button @click="showPicker">
							申请补卡
						</button>
					</view>
				</view>

			</view>
			<view v-else>
				<text>&nbsp;&nbsp;&nbsp;暂无需要补卡的记录~</text>
			</view>
		</scroll-view>
	</view>

</template>


<script>
	import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

	export default {
		data() {
			return {
				currentClub: {}, // 存储当前社团信息
				userInfo: {}, // 存储用户信息
				attendanceRecords: [], // 存储考勤记录
				selectedDate: "", // 选择的日期
				selectedTime: "", // 选择的时间（时分秒）
				selectedDateTime: "", // 完整的日期时间
				showPickerDialog: false, // 控制弹窗显示
				checkOutTime: "",
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
			const selectedClub = clubInfo[currentClubIndex] || {};
			this.currentClub = selectedClub; // 将当前社团信息存储到 data 中
			// 先加载一条数据以获取总记录数，然后加载所有数据
			this.loadAllRecords();
		},


		methods: {
			// 显示选择日期和时间的弹窗
			showPicker() {
				this.showPickerDialog = true;
			},
			// 关闭选择日期和时间的弹窗
			closePickerDialog() {
				this.showPickerDialog = false;
			},

			// 时间改变事件
			onTimeChange(e, checkInTime) {
				const time = e.detail.value;
				this.selectedTime = `${time}:00`;
				this.updateSelectedDateTime(checkInTime);
			},

			// 更新完整的日期时间显示
			updateSelectedDateTime(checkInTime) {
				if (this.selectedTime) {
					this.selectedDateTime = `${checkInTime.split(" ")[0]} ${this.selectedTime}`;
				} else {
					this.selectedDateTime = "";
				}
			},



			// 加载所有数据
			async loadAllRecords() {


				try {
					const response = await http.get("/attendance/getUnCheckOutRecord", {
						clubId: this.currentClub.clubId,
						userId: this.userInfo.userId,

					});
					if (response.status_code === 200) {
						this.attendanceRecords = response.data;
						console.log('this.attendanceRecords', this.attendanceRecords);
					}
				} catch (error) {
					console.error("获取全量出勤记录时出错：", error);
				}
			},



		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	/* 顶部提示词样式 */
	.header-tips {
		background-color: #d1ecf1;
		color: #0c5460;
		padding: 10px;
		text-align: center;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.attendance-list {
		flex: 1;
		overflow-y: auto;
		background-color: #fff;
	}

	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid #e0e0e0;
	}

	.record-info {
		flex: 1;
	}

	.apply-makeup-btn button {
		padding: 3px 5px;
		background-color: #F5F5F5;
		/* 白色背景 */
		/* 天蓝色背景 */
		color: red;
		/* 红色字体 */
		border: none;
		border-radius: 20px;
		cursor: pointer;
	}

	.apply-makeup-btn button:disabled {
		background-color: #ccc;
		/* 灰色背景 */
		color: red;
		/* 红色字体 */
		cursor: not-allowed;
	}


	.load-more-section {
		padding: 10px;
		text-align: center;
		background-color: #f7f7f7;
	}

	.loading {
		text-align: center;
		color: #666;
		padding: 10px;
	}

	.picker-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.picker-container {
		background-color: white;
		padding: 60px;
		border-radius: 10px;
	}
</style>