<template>
  
  <view class="ann-list">
    <view class="ann-list-header">公告信息</view>
    <view class="ann-list-item" v-for="ann in annList" :key="ann.id">
      <view class="date">
        <view class="day">
          {{ sliceAnnPublishDay(ann) }}
        </view>
        <view class="year-month">
          {{ sliceAnnPublishYearAndMonth(ann) }}
        </view>
      </view>
      <view class="title">{{ ann.title }}</view>
    </view>
    <view class="ann-list-footer">到底了，请返回</view>
  </view>
  <button @click="test">测试</button>

</template>

<script setup>
  import { ref, computed } from 'vue';
  import http from '@/utils/http'

  let annList = ref([])

  function test() {
    http.get("/club/announcement/search", {
      page_num: 1,
      page_size: 10
    })
    .then(res => {
      annList.value.push(...res.data.records)
    })
  }

  function sliceAnnPublishDay(ann) {
    return ann.publish_time.slice(8, 10)
  }

  function sliceAnnPublishYearAndMonth(ann) {
    return `${ann.publish_time.slice(0, 4)}.${ann.publish_time.slice(5, 7)}`
  }

</script>

<style scoped>

  .ann-list {
    display: flex;
    flex-direction: column;
    gap: 1.2em;
    padding: 0.5em 0.8em 1em 0.8em;
  }

  .ann-list-header {
    color: #0272af;
    font-weight: bolder;
  }

  .ann-list-item {
    display: flex;
    gap: 1.6em;
  }

  .ann-list-item .date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2em;
    height: 3.8em;
    width: 3.8em;
    color: #004b9b;
    text-align: center;
    background-color: #e1eef7;
  }

  .ann-list-item .day {
    font-weight: bolder;
    font-size: 1.2em;
  }

  .ann-list-item .year-month {
    font-size: 0.85em;
  }

  .ann-list-item .title {
    font-weight: bolder;
  }

  .ann-list-footer {
    display: flex;
    gap: 1.5em;
    padding: 0 0.5em;
    text-align: center;
    color: #999;
  }

  .ann-list-footer::before,
  .ann-list-footer::after {
    position: relative;
    top: -0.5em;
    flex: 1;
    content: "";
    border-bottom: 1px solid #999;
  }



</style>