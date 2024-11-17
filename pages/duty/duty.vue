<template>
  <view id="main-content">
    <!-- 查询条件 -->
    <view class="search-container">
      <input type="text" placeholder="姓名" class="input" v-model="name" />
      <input type="text" placeholder="时间" class="input" v-model="date" />
      <input type="text" placeholder="社团" class="input" v-model="club" />
      <button class="search-btn" @click="fetchDutyData">查询</button>
    </view>
    
    <!-- 查看自己的值日按钮 -->
    <button class="self-duty-btn" @click="fetchSelfDutyData">查看自己的值日</button>
    
    <!-- 动态渲染值日卡片 -->
    <view class="duty-card" v-for="(dutyItem, index) in filteredDutyData" :key="index">
      <view class="duty-info">
        <text class="duty-period">区域：{{ dutyItem.period }}</text>
        <text>时间：{{ dutyItem.date }}</text>
        <text>清理者：{{ dutyItem.cleaner_name }}</text>
        <div class="images">
          <img v-for="(image, imgIndex) in dutyItem.image_file" :key="imgIndex" :src="image" alt="值日图片" />
        </div>
        <!-- 上传图片按钮 -->
        <button v-if="dutyItem.cleaner_id === userInfo.userId" @click="uploadImage(dutyItem)">上传图片</button>
      </view>
    </view>
    
    <!-- 如果有自己的值日数据，单独显示 -->
    <view v-if="selfDutyData.length > 0">
      <view class="duty-card" v-for="(dutyItem, index) in selfDutyData" :key="index">
        <view class="duty-info">
          <text class="duty-period">区域：{{ dutyItem.period }}</text>
          <text>时间：{{ dutyItem.date }}</text>
          <text>清理者：{{ dutyItem.cleaner_name }}</text>
          <div class="images">
            <img v-for="(image, imgIndex) in dutyItem.image_file" :key="imgIndex" :src="image" alt="值日图片" />
          </div>
          <!-- 上传图片按钮 -->
          <button v-if="dutyItem.cleaner_id === userInfo.userId" @click="uploadImage(dutyItem)">上传图片</button>
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
      currentClub: {}, // 当前社团信息
      userInfo: {}, // 用户信息
      clubs: [], // 社团数据
      dutyData: [], // 后端返回的所有值日数据
      selfDutyData: [], // 用户个人值日的数据
      name: "", // 查询的姓名
      date: "", // 查询的时间
      club: "", // 查询的社团
    };
  },
  computed: {
    // 计算属性：根据条件动态过滤 dutyData
    filteredDutyData() {
      return this.dutyData.filter((duty) => {
        const matchesName = this.name ? duty.cleaner_name.includes(this.name) : true;
        const matchesDate = this.date ? duty.date.includes(this.date) : true;
        const matchesClub = this.club ? duty.area.includes(this.club) : true;
        return matchesName && matchesDate && matchesClub;
      });
    },
  },
  onLoad() {
    const app = getApp();
    const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
    const userInfo = app.globalData.userData?.userInfo || {}; // 获取用户信息
    this.userInfo = userInfo; // 将用户信息存储到 data 中
    const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0; // 当前社团索引

    // 设置当前社团
    this.currentClub = clubInfo[currentClubIndex] || {};

    // 获取座位信息
    if (this.currentClub.clubId) {
      this.fetchSeats();
    }
  },
  methods: {
    // 查询所有值日数据
    fetchDutyData() {
      // 清空之前的数据
      this.dutyData.splice(0); // 使用 splice 清空数组
      this.selfDutyData.splice(0); // 清空个人值日数据，防止残留数据

      const params = {
        club_id: this.currentClub.clubId,
        number: "",
        name: "",
        page_num: 1,
        page_size: 1000,
      };

      http
        .post("/club/duty/select", params)
        .then((res) => {
          if (res.status_code === 200 && res.data.records) {
            this.dutyData = res.data.records.map((record) => ({
              period: record.number, // 假设 number 是时段
              date: record.date_time, // 假设 date_time 是时间
              cleaner_name: record.cleaner_name, // 只显示清理者
              cleaner_id: record.cleaner_id, // 添加 cleaner_id
              image_file: record.image_file || [], // 图片数据
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching duty data:", error);
        });
    },

    // 查询个人值日数据
    fetchSelfDutyData() {
      // 清空之前的数据
      this.selfDutyData.splice(0); // 清空个人值日数据
      this.dutyData.splice(0); // 清空其他值日数据，防止之前的数据残留

      const params = {
        club_id: 36,
        page_num: 1,
        page_size: 10000,
      };

      http
        .post("/club/duty/selectself", params)
        .then((res) => {
          if (res.status_code === 200 && res.data.records) {
            this.selfDutyData = res.data.records.map((record) => ({
              period: record.number,
              date: record.date_time,
              cleaner_name: record.cleaner_name,
              cleaner_id: record.cleaner_id, // 添加 cleaner_id
              image_file: record.image_file || [],
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching self duty data:", error);
        });
    },

    uploadImage(dutyItem) {
      wx.chooseImage({
        count: 4,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const files = res.tempFilePaths; // 获取选择的图片路径
          const formData = new FormData();
          const dateTime = dutyItem.date; // 获取日期
          console.log("值日时间：", dateTime);
      
          // 直接构建查询参数
          const url = `/club/duty/report_results?date_time=${encodeURIComponent(dateTime)}&member_id=${this.userInfo.userId}&club_id=${this.currentClub.clubId}`;
      
          // 将每个文件添加到 formData
          files.forEach((file, index) => {
            formData.append("file", {
              uri: file,
              name: `file[${index}]`,  // 确保 name 字段与后端接收一致
              type: "image/jpeg",  // 或者根据文件格式设置
            });
          });
      
          // 发送请求上传图片，不设置 Content-Type 让浏览器/微信小程序处理
          http.post(url, formData)
            .then((uploadRes) => {
              if (uploadRes.status_code === 200) {
                console.log("图片上传成功", uploadRes);
                // 成功后将图片文件添加到 dutyItem
                dutyItem.image_file.push(...files);
              }
            })
            .catch((error) => {
              console.error("图片上传失败:", error);
            });
        },
        fail: (err) => {
          console.error("选择图片失败:", err);
        },
      });
    }



,
  },
  mounted() {
    this.fetchDutyData(); // 页面加载时自动请求数据
  },
};
</script>

<style lang="css" scoped>
@import './duty.css';  /* 导入外部的 CSS 文件 */
</style>
