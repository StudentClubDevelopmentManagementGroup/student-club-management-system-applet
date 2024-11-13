<template>
  <view class="container">
    <!-- 第一部分：时间计时 -->
    <view class="section timer-section">
      <p>{{ formattedTime }}</p>
    </view>

    <!-- 第二部分：打卡记录 -->
    <view class="section log-section">
      <p>签到时间：{{ signInTime || '未签到' }}</p>
      <p>签退时间：{{ signOutTime || '未签退' }}</p>
      <p>本周累计打卡时长：{{ totalTime }} 小时</p>
    </view>

    <!-- 第三部分：单一按钮 -->
    <view class="button-section">
      <button @click="toggleClocking" class="clocking-button">
        {{ isClockingIn ? '结束打卡' : '开始打卡' }}
      </button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      signInTime: null, // 签到时间
      signOutTime: null, // 签退时间
      totalTime: 0, // 本周累计打卡时长（单位：小时）
      isClockingIn: false, // 是否正在打卡
      timerInterval: null, // 用来存储计时器的 ID
      elapsedTime: 0, // 计时的秒数
    };
  },
  computed: {
    // 格式化计时显示（时:分:秒）
    formattedTime() {
      const hours = String(Math.floor(this.elapsedTime / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((this.elapsedTime % 3600) / 60)).padStart(2, '0');
      const seconds = String(this.elapsedTime % 60).padStart(2, '0');
      return `${hours} : ${minutes} : ${seconds}`;
    },
  },
  methods: {
    // 切换打卡状态
    toggleClocking() {
      if (this.isClockingIn) {
        this.endClockingIn(); // 如果正在打卡，结束打卡
      } else {
        this.startClockingIn(); // 如果未打卡，开始打卡
      }
    },

    // 开始打卡
    startClockingIn() {
      this.signInTime = this.getCurrentTime();
      this.isClockingIn = true;
      this.elapsedTime = 0; // 重置计时
      this.timerInterval = setInterval(() => {
        this.elapsedTime++; // 每秒增加1秒
      }, 1000);
    },

    // 结束打卡
    endClockingIn() {
      this.signOutTime = this.getCurrentTime();
      this.isClockingIn = false;
      clearInterval(this.timerInterval); // 停止计时
      this.calculateTotalTime();
      this.elapsedTime = 0; // 重置计时
    },

    // 获取当前时间
    getCurrentTime() {
      return new Date().toLocaleTimeString();
    },

    // 计算本周累计打卡时长（这里的实现是个示例，实际需要存储数据并计算）
    calculateTotalTime() {
      // 假设每次打卡时长为1小时，实际情况可以通过时间差来计算
      this.totalTime += 1; // 每次打卡增加1小时
    },
  },
  beforeDestroy() {
    // 清理计时器，避免内存泄漏
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
};
</script>
<style scoped>
@import url(./checkIn.css);
</style>
