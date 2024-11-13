<template>
  <view>
    <!-- 第一部分：选择开始时间和结束时间，点击查询按钮 -->
    <view class="search-section">
      <view>
        <text>开始时间：</text>
        <input type="date" v-model="startTime" />
      </view>
      <view>
        <text>结束时间：</text>
        <input type="date" v-model="endTime" />
      </view>
      <button @click="searchAttendance">查询</button>
    </view>

    <!-- 第二部分：展示考勤记录 -->
    <view class="attendance-list">
      <view v-if="attendanceRecords.length > 0">
        <view v-for="(record, index) in attendanceRecords" :key="index">
          <view>
            <text>部门：{{ record.departmentName }}</text>
          </view>
          <view>
            <text>俱乐部：{{ record.clubName }}</text>
          </view>
          <view>
            <text>用户名：{{ record.userName }}</text>
          </view>
          <view>
            <text>签到时间：{{ record.checkInTime }}</text>
          </view>
          <view>
            <text>签退时间：{{ record.checkoutTime }}</text>
          </view>
          <view>
            <text>出勤时长：{{ record.attendanceDuration }} 分钟</text>
          </view>
          <view><hr/></view>
        </view>
      </view>
      <view v-else>
        <text>没有符合条件的出勤记录。</text>
      </view>

      <!-- 加载更多按钮 -->
      <button v-if="currentPage < totalPages" @click="loadMoreRecords">查看更多考勤记录</button>
    </view>
  </view>
</template>

<script>
import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

export default {
  data() {
    return {
      startTime: "", // 开始时间
      endTime: "",   // 结束时间
      attendanceRecords: [], // 存储考勤记录
      currentPage: 1, // 当前页数
      pageSize: 5,    // 每页记录数
      totalPages: 1   // 总页数
    };
  },
  methods: {
    // 查询出勤记录
    async searchAttendance() {
      this.currentPage = 1; // 重置当前页为 1
      this.attendanceRecords = []; // 清空当前记录
      this.loadMoreRecords(); // 加载第一页数据
    },
    // 加载考勤记录
    async loadMoreRecords() {
      try {
        const response = await http.post("/attendance/record", {
			
			clubId: 36,  // 社团ID
			userName: "", // 用户名（可以从全局状态或其他方式获取）
			userId: "", // 用户ID（可以从全局数据中获取）
			startTime: "", // 开始时间
			endTime: "", // 结束时间
			currentPage: this.currentPage, // 当前页
			pageSize: 2 // 每页显示记录数
        });
        if (response.data && response.data.records) {
          // 如果是第一页，清空已有数据
          if (this.currentPage === 1) {
            this.attendanceRecords = response.data.records;
          } else {
            this.attendanceRecords = [...this.attendanceRecords, ...response.data.records];
          }
          this.totalPages = response.data.total_pages; // 设置总页数
        }
      } catch (error) {
        console.error("获取出勤记录时出错：", error);
      }
    }
  },
  watch: {
    // 监听 currentPage 的变化，加载更多数据
    currentPage(newPage) {
      if (newPage > 1) {
        this.loadMoreRecords();
      }
    }
  }
};
</script>

<style scoped>
/* 样式部分： */

.search-section {
  margin-bottom: 20px;
}

.search-section view {
  margin-bottom: 10px;
}

.attendance-list {
  margin-top: 20px;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
