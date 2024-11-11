<template>
  <view class="container">
    <view>
      <text class="label">标题</text>
      <input class="input" type="text" placeholder="请简述 Bug"/>
    </view>
    
    <view>
      <text class="label">描述</text>
      <textarea class="textarea" maxlength="2000" placeholder="请详细描述问题"></textarea>
    </view>
    
    <view>
      <text class="label">截图</text>
      <view class="upload-box" @tap="chooseImage">
        <view>点击上传截图</view>
      </view>
    </view>
    
    <view>
      <text class="label">联系方式</text>
      <input class="input" type="text" placeholder="请输入联系方式"/>
    </view>
    
    <button class=".submit-button">提交</button>
  </view>
</template>

<script>

</script>

<style>
.container {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.label {
  font-size: 1em;
  line-height: 2em;
  display: block;
}

.input, .textarea {
  width: inherit;
  padding: 0.2em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.textarea {
  height: 15em;
}

.upload-box {
  width: inherit;
  height: 6em;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button {
  width: 100%;
  margin-top: 1em;
  background-color: #2089c2;
  color: #fff;
  text-align: center;
}
</style>
