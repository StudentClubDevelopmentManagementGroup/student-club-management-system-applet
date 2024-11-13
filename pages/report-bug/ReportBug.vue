<template>
  <view class="container">
    <view>
      <text class="label">标题</text>
      <input class="input" type="text" v-model="title" placeholder="请简述 Bug"/>
    </view>
    
    <view>
      <text class="label">描述</text>
      <textarea class="textarea" v-model="description" maxlength="2000" placeholder="请详细描述 Bug"></textarea>
    </view>
    
    <view>
      <text class="label">截图（选填）</text>
      <view class="upload-box" @tap="chooseImage">
        <view>点击上传截图</view>
      </view>
    </view>
    
    <view>
      <text class="label">联系方式（选填）</text>
      <input class="input" type="text" v-model="contact" placeholder="请输入联系方式"/>
    </view>
    
    <button class="submit-button" @click="submitBug">提交</button>
  </view>
</template>

<script setup>
  import { ref } from 'vue'

  const title = ref('')
  const description = ref('')
  const contact = ref('')
  const image = ref(null)

  async function chooseImage() {
    try {
      const result = await uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      });
      if (result.tempFilePaths.length > 0) {
        image.value = result.tempFilePaths[0]
      }
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  };

  function submitBug() {
    if ( ! title.value) {
      uni.showToast({ title: '请填写标题', icon: 'none' })
      return
    }
    else if ( ! description.value) {
      uni.showToast({ title: '请填写描述', icon: 'none' })
      return
    }

  };
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
