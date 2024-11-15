<template>
  <view>
    <!-- 显示当前选中的社团名称 -->
    <text>{{ currentClub.clubName }}</text>
    
    <!-- 显示当前社团的 ID -->
    <text>社团 ID: {{ currentClub.clubId }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentClub: {}  // 存储当前社团信息
    };
  },
  onLoad() {
    // 获取全局数据
    const app = getApp();
    const clubInfo = app.globalData.userData?.clubInfo || [];  // 获取社团信息

    // 获取当前选中的社团索引
    const currentClubIndex = app.globalData.appData.currentClubIndex || 0;

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
}
</style>
