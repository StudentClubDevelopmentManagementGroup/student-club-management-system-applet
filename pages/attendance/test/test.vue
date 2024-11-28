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
							<text>签退时间：{{ "未签退" }}</text>
						</view>
						<!-- 弹出选择日期和时间的区域 -->
						<view v-if="showPickerDialog" class="picker-dialog">
							<view class="picker-container">
								<!-- 顶部信息 -->
								<view>
									<view>
										<text>签到时间：{{ selectedRecord.checkInTime }}</text>
									</view>
									<view>
										<text>签退时间：{{ selectedDateTime || "未签退" }}</text>
									</view>

								</view>


								<!-- 时间选择器 -->
								<view class="time-selector">
									<picker mode="time" :start="getStartTime(selectedRecord.checkInTime)"
										@change="(e) => onTimeChange(e, selectedRecord.checkInTime)">
										<button type="default">选择签退时间</button>
									</picker>
								</view>

								<!-- 底部按钮区域 -->
								<view class="picker-actions">
									<!-- 关闭按钮 -->
									<button class="close-btn" @click="closePickerDialog()">关闭</button>
									<!-- 申请补卡按钮 -->
									<button class="replenish-btn"
										@click="replenish(selectedRecord.checkInTime, selectedDateTime)">确认申请补卡</button>
								</view>
							</view>
						</view>
					</view>
					<!-- 右侧申请补卡按钮 -->
					<view class="apply-makeup-btn">
						<button @click="showPicker(record)">申请补卡</button>
					</view>
				</view>
			</view>
			<view v-else>
				<text>&nbsp;&nbsp;&nbsp;暂无需要补卡的记录~</text>
			</view>
		</scroll-view>

		<!-- 加载更多按钮 -->
		<view class="load-more-section" v-if="!noMoreData">
			<button @click="loadMoreRecords" class="load-more-btn" :disabled="isLoading">
				{{ isLoading ? "加载中..." : "加载更多" }}
			</button>
		</view>

		<view class="loading" v-else>
			<text>没有更多记录了~</text>
		</view>
	</view>
</template>

<script>
	import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

	export default {
		data() {
			return {
				currentClub: {}, // 当前社团信息
				userInfo: {}, // 用户信息
				attendanceRecords: [], // 考勤记录
				selectedDate: "", // 日期
				selectedTime: "", // 时间
				selectedDateTime: "", // 用户选择完整日期时间
				showPickerDialog: false, // 弹窗显示控制
				currentPage: 1, // 当前页码
				pageSize: 8, // 每页显示数量
				noMoreData: false, // 是否还有更多数据
				isLoading: false, // 是否正在加载
				checkOutTime: "",
				selectedRecord: null, // 用来存储当前选中的考勤记录
			};
		},

		onLoad() {
			// 获取全局数据并初始化
			const app = getApp();
			const clubInfo = app.globalData.userData?.clubInfo || [];
			const userInfo = app.globalData.userData?.userInfo || {};
			this.userInfo = userInfo;
			const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;
			this.currentClub = clubInfo[currentClubIndex] || {};
			this.loadAllRecords();
		},

		methods: {
			// 显示弹窗
			showPicker(record) {
			  this.selectedRecord = record;  // 将当前记录保存到 selectedRecord
			  this.selectedDateTime = record.checkoutTime || "";  // 如果已有签退时间，就传递它
			  this.showPickerDialog = true;  // 显示弹窗
			},

			// 关闭弹窗
			closePickerDialog() {
				this.showPickerDialog = false;
			},

			//时间选择器开始时间
			getStartTime(checkInTime) {
				return checkInTime.split(" ")[1].substring(0, 5);
			},
			// 时间改变事件
			onTimeChange(e, checkInTime) {
				const time = e.detail.value;
				this.selectedTime = `${time}:59`;
				this.updateSelectedDateTime(checkInTime);
			},

			// 更新日期时间
			updateSelectedDateTime(checkInTime) {
			  if (this.selectedTime) {
			    this.selectedDateTime = `${checkInTime.split(" ")[0]} ${this.selectedTime}`;
			    this.selectedRecord.checkoutTime = this.selectedDateTime;  // 更新当前记录的签退时间
			  } else {
			    this.selectedDateTime = "";
			  }
			},
			// 加载考勤记录
			async loadAllRecords() {
				if (this.noMoreData || this.isLoading) return; // 防止重复加载

				this.isLoading = true; // 开始加载
				try {
					const response = await http.get("/attendance/getUnCheckOutRecordT", {
						clubId: this.currentClub.clubId,
						userId: this.userInfo.userId,
						currentPage: this.currentPage,
						pageSize: this.pageSize,
					});

					if (response.status_code === 200) {
						const newRecords = response.data.records;
						// 给每个记录添加 checkoutTime 字段
						this.attendanceRecords = [
							...this.attendanceRecords,
							...newRecords.map(record => ({
								...record,
								checkoutTime: ''  // 每个记录添加一个空的 checkoutTime
							}))
						];						
						// this.attendanceRecords = [...this.attendanceRecords, ...newRecords];

						// 判断是否还有更多数据
						if (newRecords.length < this.pageSize) {
							this.noMoreData = true; // 没有更多数据
						} else {
							this.currentPage += 1; // 增加页码
						}
					}
				} catch (error) {
					console.error("加载考勤记录失败：", error);
				} finally {
					this.isLoading = false; // 加载结束
				}
			},

			// 加载更多记录
			loadMoreRecords() {
				this.loadAllRecords();
			},

			// 补签请求
			async replenish(checkInTime, selectedDateTime) {
				console.log("补签签到时间", checkInTime);
				console.log("补签签退时间", selectedDateTime);
				try {
					const response = await http.post("/attendance/replenish", {
						clubId: this.currentClub.clubId,
						userId: this.userInfo.userId,
						checkInTime: checkInTime,
						checkoutTime: selectedDateTime,
					});

					if (response.status_code === 200) {
						// 关闭弹窗
						this.closePickerDialog();
						this.loadAllRecords();
						// 更新考勤记录
						this.attendanceRecords = response.data;
						console.log('this.attendanceRecords', this.attendanceRecords);
						// 显示补签成功提示
						uni.showToast({
							title: '补签成功',
							icon: 'success',
							duration: 2000,
						});
					} else {
						// 提示输入时间
						uni.showToast({
							title: '请输入有效的时间',
							icon: 'none',
							duration: 2000,
						});
					}
				} catch (error) {
					console.error("补签请求时出错：", error);
					uni.showToast({
						title: '请求失败，请稍后再试',
						icon: 'none',
						duration: 2000,
					});
				}
			}



		},
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
		background-color: #f5f5f5;
		color: red;
		border: none;
		border-radius: 20px;
		cursor: pointer;
	}

	.apply-makeup-btn button:disabled {
		background-color: #ccc;
		color: red;
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

	.picker-actions {
		display: flex;
		justify-content: space-between;
		/* 两端对齐 */
		margin-top: 20px;
	}

	.close-btn {
		background-color: #f5f5f5;
		color: #333;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.replenish-btn {
		background-color: #f5f5f5;
		color: #333;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
	}


	.load-more-btn {
		padding: 10px;
		background-color: #f7f7f7;
		border: none;
		border-radius: 10px;
		cursor: pointer;
	}

	.load-more-btn:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>