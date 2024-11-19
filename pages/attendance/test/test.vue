<template>
  <view class="container">
    <view class="time-display">选择的时间：{{ selectedDateTime || "尚未选择" }}</view>

    <!-- 按钮，点击后弹出选择日期和时间的弹窗 -->
    <button type="default" @click="showPicker">选择日期和时间</button>

    <!-- 弹出选择日期和时间的区域 -->
    <view v-if="showPickerDialog" class="picker-dialog">
      <view class="picker-container">
        <!-- 日期选择器 -->
        <picker mode="date" @change="onDateChange">
          <button type="default">选择日期</button>
        </picker>

        <!-- 时间选择器 -->
        <picker mode="time" @change="onTimeChange">
          <button type="default">选择时间</button>
        </picker>

        <!-- 关闭弹窗按钮 -->
        <button type="default" @click="closePickerDialog">关闭</button>
      </view>
    </view>
	
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: "", // 选择的日期
      selectedTime: "", // 选择的时间（时分秒）
      selectedDateTime: "", // 完整的日期时间
      showPickerDialog: false, // 控制弹窗显示
    };
  },
  methods: {
    // 显示选择日期和时间的弹窗
    showPicker() {
      this.showPickerDialog = true;
    },

    // 关闭选择日期和时间的弹窗
    closePickerDialog() {
      this.showPickerDialog = false;
    },

    // 日期改变事件
    onDateChange(e) {
      this.selectedDate = e.detail.value; // 获取用户选择的日期
      this.updateSelectedDateTime();
    },

    // 时间改变事件
    onTimeChange(e) {
      const time = e.detail.value; // 获取用户选择的时间（如 12:30）
      this.selectedTime = `${time}:00`; // 自动补全秒位
      this.updateSelectedDateTime();
    },

    // 更新完整的日期时间显示
    updateSelectedDateTime() {
      if (this.selectedDate && this.selectedTime) {
        this.selectedDateTime = `${this.selectedDate} ${this.selectedTime}`;
      } else {
        this.selectedDateTime = ""; // 如果未选择完整时间则清空
      }
    },
	
	
  },
};
</script>



<style scoped>
.container {
  padding: 20px;
  text-align: center;
}
.time-display {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}
button {
  margin: 10px 0;
  width: 200px;
}
.picker-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.picker-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}
</style>
