<template>
  <view>
    <!-- 显示学号 -->
    <p>学号: {{ userInfo.userId }}</p>
    
    <!-- 显示姓名 -->
    <p>姓名: {{ userInfo.name }}</p>
    
    <!-- 显示当前选中的社团名称 -->
    <p v-if="currentClub.clubName">当前选中的社团：{{ currentClub.clubName }}</p>
    
    <!-- 显示当前社团的 ID -->
    <p v-if="currentClub.clubId">社团 ID: {{ currentClub.clubId }}</p>
    
    <view v-else>
      <text>暂无社团信息</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentClub: {},  // 存储当前社团信息
      userInfo: {}       // 存储用户信息
    };
  },
  onLoad() {
    // 获取全局数据
    const app = getApp();
    const clubInfo = app.globalData.userData?.clubInfo || [];  // 获取社团信息
    console.log("社团信息:", clubInfo);  // 打印社团信息

    // 获取用户信息
    const userInfo = app.globalData.userData?.userInfo || {};
    console.log("用户信息:", userInfo);  // 打印用户信息
    this.userInfo = userInfo;  // 将用户信息存储到 data 中

    // 获取当前选中的社团索引，确保全局数据的正确访问
    const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;

    // 根据当前选择的社团下标获取当前社团信息
    const selectedClub = clubInfo[currentClubIndex] || {};

    // 将当前社团信息存储到 data 中
    this.currentClub = selectedClub;
  }
};
</script>

<style scoped>
text {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}
</style>
