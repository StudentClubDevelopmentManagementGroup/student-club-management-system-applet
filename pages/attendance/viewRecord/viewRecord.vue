<template>
	<view class="container">
		<!-- 顶部提示词 -->
		<view class="header-tips">
			<text>考勤记录</text>
		</view>

		<!-- 第二部分：展示考勤记录 -->
		<scroll-view
			class="attendance-list"
			scroll-y
			:scroll-with-animation="true"
			@scrolltolower="loadMoreRecords"
		>
			<view v-if="attendanceRecords.length > 0">
				<view v-for="(record, index) in attendanceRecords" :key="index" class="record-item">
					<view>
						<text>签到时间：{{ record.checkInTime }}</text>
					</view>
					<view>
						<text>签退时间：{{ record.checkoutTime }}</text>
					</view>
					<view>
						<text>出勤时长：{{ formatDuration(record.attendanceDuration) }}</text>
					</view>
				</view>
			</view>
			<view v-else>
				<text>暂无出勤记录~</text>
			</view>
		</scroll-view>
		
		<!-- 第三部分底部加载更多按钮 -->
		<view v-if="currentPage < totalPages" class="load-more-section">
			<button @click="loadMoreRecords" :disabled="isLoading">
				{{ isLoading ? '加载中...' : '加载更多' }}
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
			currentClub: {}, // 存储当前社团信息
			userInfo: {}, // 存储用户信息

			attendanceRecords: [], // 存储考勤记录
			currentPage: 1, // 当前页数
			pageSize: 7, // 每页记录数
			totalPages: 1, // 总页数
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
		
		this.loadMoreRecords();
	},

	methods: {
		// 将秒数转换为时:分:秒格式
		formatDuration(seconds) {
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const remainingSeconds = seconds % 60;
			return `${hours} 小时 ${minutes} 分钟 ${remainingSeconds} 秒`;
		},

		// 查询出勤记录
		async searchAttendance() {
			this.currentPage = 1; // 重置当前页为 1
			this.attendanceRecords = []; // 清空当前记录
			this.loadMoreRecords(); // 加载第一页数据
		},

		// 加载考勤记录
		async loadMoreRecords() {
			if (this.isLoading || this.currentPage > this.totalPages) return;
			this.isLoading = true;

			try {
				const response = await http.post("/attendance/record", {
					clubId: this.currentClub.clubId,
					userName: "",
					userId: this.userInfo.userId,
					startTime: this.startTime,
					endTime: this.endTime,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				});

				if (response.data && response.data.records) {
					// 过滤掉 isDeleted 为 true 的记录
					const validRecords = response.data.records.filter(record => !record.isDeleted);

					this.attendanceRecords = [
						...this.attendanceRecords,
						...validRecords
					];
					this.totalPages = response.data.total_pages;
					this.currentPage++;
				}
			} catch (error) {
				console.error("获取出勤记录时出错：", error);
			} finally {
				this.isLoading = false;
			}
		}
	}
};
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh; /* 占满整个屏幕高度 */
}

/* 顶部提示词样式 */
.header-tips {
	background-color: #d1ecf1; /* 浅蓝色背景 */
	color: #0c5460; /* 深蓝色字体 */
	padding: 10px;
	text-align: center;
	border-radius: 4px;
	margin-bottom: 10px;
}

.attendance-list {
	flex: 1; /* 占据剩余空间 */
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
