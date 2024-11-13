<template>
  <view id="main-content">
    <!-- 查询条件 -->
    <view class="search-container">
      <input type="text" placeholder="姓名" class="input" v-model="name" />
      <input type="text" placeholder="时间" class="input" v-model="date" />
      <input type="text" placeholder="社团" class="input" v-model="club" />
      <button class="search-btn" @click="fetchDutyData">查询</button>
    </view>
    
    <!-- 动态渲染值日卡片 -->
    <view class="duty-card" v-for="(dutyItem, index) in filteredDutyData" :key="index">
      <view class="duty-info">
        <text class="duty-period">区域：{{ dutyItem.period }}</text>
        <text>时间：{{ dutyItem.date }}</text>
        <text>清理者：{{ dutyItem.cleaner_name }}</text> <!-- 只显示清理者 -->
        <div class="images">
          <img v-for="(image, index) in dutyItem.image_file" :key="index" :src="image" alt="值日图片" />
        </div>
      </view>
    </view>
  </view>
</template>

<script>
import http from "@/utils/http.ts";
import tools from "@/utils/tools.js";

export default {
  data() {
    return {
      clubs: [],
      dutyData: [], // 后端返回的值日数据
      name: '',     // 查询的姓名
      date: '',     // 查询的时间
      club: '',     // 查询的社团
    };
  },
  computed: {
    // 计算属性：根据条件动态过滤 dutyData
    filteredDutyData() {
      return this.dutyData.filter(duty => {
        const matchesName = this.name ? duty.cleaner_name.includes(this.name) : true; // 只根据清理者姓名过滤
        const matchesDate = this.date ? duty.date_time.includes(this.date) : true;
        const matchesClub = this.club ? duty.area.includes(this.club) : true; // 这里假设 club 用 area 字段来匹配
        return matchesName && matchesDate && matchesClub;
      });
    }
  },
  methods: {
    fetchDutyData() {
      const params = {
        club_id: 36,  // 可以根据需要调整
        number: '',
        name: '',
        page_num: 1,
        page_size: 1000
      };

      http.post('/club/duty/select', params)
        .then(res => {
          if (res.status_code === 200 && res.data.records) {
            // 处理后端返回的数据，适配到展示所需格式
            this.dutyData = res.data.records.map(record => ({
              period: record.number, // 假设 number 是时段
              date: record.date_time, // 假设 date_time 是时间
              cleaner_name: record.cleaner_name, // 只显示清理者
              image_file: record.image_file || [], // 图片数据
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching duty data:', error);
        });
    }
  },
  mounted() {
    this.fetchDutyData(); // 页面加载时自动请求数据
  }
};
</script>

<style lang="css" scoped>
@import './duty.css';  /* 导入外部的 CSS 文件 */
</style>
