<template>
  <view id="main-content" style="background-image: url('/static/images/背景.jpg');">
    <!-- 查询条件 -->
    <view class="search-container">
	  <button class="self-duty-btn" @click="fetchSelfDutyData">查看自己的值日</button>
      <button class="search-btn" @click="showPopup">更多查询 V</button>
    </view>
    <!-- 条件查询弹窗 -->
	<view v-show="isShowingPopup" class="fliter-popup">
		<view class="fliter-popup-mask" @click="hidePopup"></view>
		<view class="fliter-popup-content">
			<view style="display: flex; flex-direction: row;margin: 5px;">
				<text>区域:</text>
				<input type="text" placeholder="请输入区域" v-model="area" />
			</view>
			<view style="display: flex; flex-direction: row;margin: 5px;">
				<text>日期:</text>
				<input type="text" placeholder="请输入年月日,用'-'分隔,如'2024-06-03'" v-model="date" />
			</view>
			<view style="display: flex; flex-direction: row; margin: 5px;">
				<text>姓名:</text>
				<input type="text" placeholder="请输入清理者姓名" v-model="name" />
			</view>
			<button class="search-btn" @click="()=>{ hidePopup(); fetchDutyDataByTime()}">完成</button>
		</view>
	</view>
	
    
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
    <view v-if="selfDutyData.length > 0" style="display: flex; justify-content: center; width: 100%;">
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
import {baseUrl} from "@/private/backendInfo.ts"

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
      area: "", // 查询的区域
	  isShowingPopup:false,
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

  },
  methods: {
	//开启查询下拉菜单  
    showPopup(){
		this.isShowingPopup = true
	},
	hidePopup(){
		this.isShowingPopup = false
	},
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
        club_id: this.currentClub.clubId,
        page_num: 1,
        page_size: 1000,
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
	// 新增：根据日期查询值日数据
	  fetchDutyDataByTime() {
	    // 清空之前的数据
	    this.selfDutyData.splice(0); // 清空个人值日数据
	    this.dutyData.splice(0); // 清空其他值日数据，防止之前的数据残留
	
	    const params = {
	      club_id: this.currentClub.clubId,  // 固定的社团 ID
	      number: this.area,    // 可以根据需要进行调整
	      name: this.name,  // 这里可以使用查询条件中的姓名
	      duty_time: this.date+" 00:00:00",  // 使用查询条件中的日期
	      page_num: 1,
	      page_size: 1000,  // 设置每页显示的条数
	    };
	
	    http
	      .post('/club/duty/select_by_time', params)
	      .then((res) => {
	        if (res.status_code === 200 && res.data.records) {
	          this.dutyData = res.data.records.map((record) => ({
	            period: record.number,  // 假设 number 是时段
	            date: record.date_time,  // 假设 date_time 是时间
	            cleaner_name: record.cleaner_name, // 只显示清理者
	            cleaner_id: record.cleaner_id, // 添加 cleaner_id
	            image_file: record.image_file || [], // 图片数据
	          }));
	        }
	      })
	      .catch((error) => {
	        console.error("Error fetching duty data by time:", error);
	      });
	  },
	  
	  
uploadImage(dutyItem) {
  this.dutyData.splice(0); // 清空其他值日数据，防止之前的数据残留
  wx.chooseImage({
    count: 4,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      const files = res.tempFilePaths; // 获取选择的图片路径

      // 遍历文件，上传每一张
      files.forEach((filePath, index) => {
        // 使用 wx.uploadFile 上传文件
        wx.uploadFile({
          url: `${baseUrl}/club/duty/report_results`, // 后端上传接口
          filePath: filePath, // 本地文件路径
          name: 'file', // 后端接收的文件字段名
		  header: {
		  	"guet-s-c-m-s-token":getApp().globalData.userData.token
		  },
          formData: {
            date_time: dutyItem.date, // 时间
            member_id: this.userInfo.userId, // 用户ID
            club_id: this.currentClub.clubId, // 社团ID
          },
          success: (uploadRes) => {
            const resData = JSON.parse(uploadRes.data); // 解析返回的数据
            if (resData.status_code === 200) {
              console.log("图片上传成功", resData);
              dutyItem.image_file.push(filePath);  // 将上传的图片添加到页面
            } else {
              console.error("上传失败，服务器返回错误:", resData);
            }
			 this.fetchDutyData()
          },
          fail: (err) => {
            console.error("图片上传失败:", err);
          }
        });
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
