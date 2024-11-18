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
					<view>
						<text>签到时间：{{ record.checkInTime }}</text>
					</view>
					<view>
						<text>签退时间：{{ record.checkoutTime }}</text>
					</view>
				</view>
			</view>
			<view v-else>
				<text>&nbsp;&nbsp;&nbsp;暂无需要补卡的记录~</text>
			</view>
		</scroll-view>

		<!-- 底部加载更多按钮 -->
		<view v-if="currentPage < totalPages" class="load-more-section">
			<button @click="loadMoreRecords" :disabled="isLoading">
				{{ isLoading ? '加载中...' : '加载更多' }}
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
				attendanceRecords: [], // 存储考勤记录
				currentPage: 1, // 当前页数
				pageSize: 9, // 每页记录数
				totalPages: 1, // 总页数
				totalItems: 0, // 总记录数
				isLoading: false // 加载状态
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
			// 初始加载一条数据获取总记录数
			async loadInitialRecords() {
				try {
					const response = await http.post("/attendance/record", {
						clubId: this.currentClub.clubId,
						userName: "",
						userId: this.userInfo.userId,
						startTime: "",
						endTime: "",
						currentPage: 1,
						pageSize: 1 // 获取第一页数据
					});

					if (response.status_code === 200) {
						this.totalItems = response.data.total_item;
						console.log('考勤次数:', this.totalItems);
						return this.totalItems; // 返回总记录数
					}
				} catch (error) {
					console.error("获取初始出勤记录时出错：", error);
				}
			},

			// 加载所有数据
			async loadAllRecords() {
				this.isLoading = true;

				try {
					// 等待 loadInitialRecords 完成并返回 totalItems
					const totalItems = await this.loadInitialRecords();

					// 使用 totalItems 作为 pageSize 加载全部记录
					const response = await http.post("/attendance/record", {
						clubId: this.currentClub.clubId,
						userName: "",
						userId: this.userInfo.userId,
						startTime: "",
						endTime: "",
						currentPage: 1,
						pageSize: totalItems // 使用返回的总记录数加载所有数据
					});
					if (response.status_code === 200) {
						this.attendanceRecords = response.data.records.filter(record => record.isDeleted);
						console.log('All filtered records:', this.attendanceRecords);
					}

				} catch (error) {
					console.error("获取全量出勤记录时出错：", error);
				} finally {
					this.isLoading = false;
				}
			},


			// 加载更多记录（按需实现）
			loadMoreRecords() {
				if (this.currentPage < this.totalPages && !this.isLoading) {
					this.currentPage++;
					this.loadAllRecords();
				}
			}
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		/* 占满整个屏幕高度 */
	}

	/* 顶部提示词样式 */
	.header-tips {
		background-color: #d1ecf1;
		/* 浅蓝色背景 */
		color: #0c5460;
		/* 深蓝色字体 */
		padding: 10px;
		text-align: center;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.attendance-list {
		flex: 1;
		/* 占据剩余空间 */
		overflow-y: auto;
		background-color: #fff;
	}

	.record-item {
		padding: 15px;
		border-bottom: 1px solid #e0e0e0;
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
</style>