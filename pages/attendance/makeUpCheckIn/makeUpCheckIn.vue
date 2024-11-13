<template>
  <view>
    <view v-if="clubInfo.length > 0">
      <view v-for="(club, index) in clubInfo" :key="index" class="club-item">
        <p>社团名称：{{ club.clubName }}</p>
        <p>社团 ID：{{ club.clubId }}</p>
        <p>部门名称：{{ club.departmentName }}</p>
        <p>角色：{{ club.role }}</p>
        <hr />
      </view>
    </view>
    <view v-else>
      <p>你尚未加入任何社团。</p>
    </view>
  </view>
</template>
<script>
	export default {
		data() {
			return {
				clubInfo: [] // 存储社团信息
			}
		},
		created() {
			// 获取全局数据
			const app = getApp();
			this.clubInfo = app.globalData.userData?.clubInfo || [];
		}
	}
</script>
<style scoped>
.club-item {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
}

p {
  margin: 5px 0;
}
</style>
