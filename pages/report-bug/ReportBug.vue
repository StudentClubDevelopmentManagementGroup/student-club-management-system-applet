<template>
  <view class="container">
    <view class="form-group">
      <text class="label">标题</text>
      <input
        class="input"
        type="text"
        placeholder="请简述 Bug"
      />
    </view>
    
    <view class="form-group">
      <text class="label">描述</text>
      <textarea
        class="textarea"
        placeholder="请详细描述问题"
      ></textarea>
      <text class="error" v-if="errors.description">{{ errors.description }}</text>
    </view>
    
    <view class="form-group">
      <text class="label">截图</text>
      <view class="upload-box" @tap="chooseImage">
        <view>点击上传截图</view>
      </view>
    </view>
    
    <view class="form-group">
      <text class="label">联系方式</text>
      <input
        class="input"
        type="text"
        placeholder="请输入联系方式"
        v-model="feedback.contact"
      />
    </view>
    
    <button>提交</button>
  </view>
</template>

<script>

</script>

<style>
.container {
  padding: 20rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}
.form-group {
  margin-bottom: 20rpx;
}
.label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  display: block;
}
.input, .textarea {
  width: 100%;
  padding: 10rpx;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  font-size: 28rpx;
}
.textarea {
  height: 150rpx;
  resize: none;
}
.error {
  color: red;
  font-size: 24rpx;
  margin-top: 5rpx;
}
.upload-box {
  width: 100%;
  height: 200rpx;
  border: 1px dashed #ccc;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
}
.placeholder {
  color: #aaa;
}
.screenshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.submit-button {
  width: 100%;
  background-color: #007aff;
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  padding: 15rpx;
  border-radius: 8rpx;
}
</style>
