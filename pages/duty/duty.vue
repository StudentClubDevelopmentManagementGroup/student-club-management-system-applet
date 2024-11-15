<template>
  <view id="main-content">
    <!-- 查询条件 -->
    <view class="search-container">
      <input type="text" placeholder="姓名" class="input" v-model="name" />
      <input type="text" placeholder="时间" class="input" v-model="date" />
      <input type="text" placeholder="社团" class="input" v-model="club" />
      <button class="search-btn" @click="fetchDutyData">查询</button>
    </view>
    
    <!-- 查看自己的签到按钮 -->
    <button class="self-duty-btn" @click="fetchSelfDutyData">查看自己的签到</button>
    
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
    
    <!-- 如果有自己的签到数据，单独显示 -->
    <view v-if="selfDutyData.length > 0">
      <view class="duty-card" v-for="(dutyItem, index) in selfDutyData" :key="index">
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
  </view>
</template>


<script>
import http from "@/utils/http.ts";
import tools from "@/utils/tools.js";

export default {
  data() {
    return {
      clubs: [],               // 社团数据
      dutyData: [],            // 后端返回的所有值日数据
      selfDutyData: [],        // 用户个人签到的数据
      name: '',                // 查询的姓名
      date: '',                // 查询的时间
      club: '',                // 查询的社团
    };
  },
  computed: {
    // 计算属性：根据条件动态过滤 dutyData
    filteredDutyData() {
      return this.dutyData.filter(duty => {
        const matchesName = this.name ? duty.cleaner_name.includes(this.name) : true;
        const matchesDate = this.date ? duty.date.includes(this.date) : true;
        const matchesClub = this.club ? duty.area.includes(this.club) : true;
        return matchesName && matchesDate && matchesClub;
      });
    }
  },
  methods: {
    // 查询所有值日数据
    fetchDutyData() {
      // 清空之前的数据
      this.dutyData.splice(0);  // 使用 splice 清空数组
      this.selfDutyData.splice(0); // 清空个人签到数据，防止残留数据

      const params = {
        club_id: 36,
        number: '',
        name: '',
        page_num: 1,
        page_size: 1000
      };

      http.post('/club/duty/select', params)
        .then(res => {
          if (res.status_code === 200 && res.data.records) {
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
    },
    
    // 查询个人签到数据
    fetchSelfDutyData() {
      // 清空之前的数据
      this.selfDutyData.splice(0);  // 清空个人签到数据
      this.dutyData.splice(0); // 清空其他值日数据，防止之前的数据残留

      const params = {
        club_id: 36,
        page_num: 1,
        page_size: 10000
      };

      http.post('/club/duty/selectself', params)
        .then(res => {
          if (res.status_code === 200 && res.data.records) {
            this.selfDutyData = res.data.records.map(record => ({
              period: record.number,
              date: record.date_time,
              cleaner_name: record.cleaner_name,
              image_file: record.image_file || [],
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching self duty data:', error);
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
