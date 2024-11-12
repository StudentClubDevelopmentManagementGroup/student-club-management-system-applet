<template>
  <view id="main-content" style="background-image: url('/static/images/背景.jpg');">
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
        <text class="duty-period">{{ dutyItem.period }}</text>
        <text>时间：{{ dutyItem.date }}</text>
        <text>人员：{{ dutyItem.people }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dutyData: [
        { period: '值日时段1', date: '2024-09-30', people: '张A, 李B, 赵CC' },
        { period: '值日时段2', date: '2024-10-01', people: '王D, 刘E, 陈F' },
        { period: '值日时段3', date: '2024-10-02', people: '赵G, 孙H, 周I' }
      ], // 初始化的值日数据
      name: '',     // 查询的姓名
      date: '',     // 查询的时间
      club: ''      // 查询的社团
    };
  },
  computed: {
    // 计算属性：根据条件动态过滤 dutyData
    filteredDutyData() {
      return this.dutyData.filter(duty => {
        const matchesName = this.name ? duty.people.includes(this.name) : true;
        const matchesDate = this.date ? duty.date.includes(this.date) : true;
        const matchesClub = this.club ? duty.people.includes(this.club) : true;
        return matchesName && matchesDate && matchesClub;
      });
    }
  },
  methods: {
    fetchDutyData() {
      // 现在数据已经在 data 中初始化，查询时直接使用 computed 属性进行过滤
      // 如果有需要，可以在此处扩展获取数据的逻辑
    }
  },
  mounted() {
    this.fetchDutyData(); // 组件加载时请求数据，尽管现在不再需要
  }
};
</script>

<style lang="css" scoped>
  @import url(./duty.css);
</style>
