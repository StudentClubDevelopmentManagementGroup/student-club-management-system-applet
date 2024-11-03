<template>

  <view class="main">

    <view class="header">
      <view class="search-bar">
        <input type="text" placeholder="请输入搜索内容" />
        <view class="search-button">
          <image src="./search-icon.svg"></image>
        </view>
      </view>
    </view>

    <view class="ann-list">
      <view class="ann-list-item" v-for="ann in annList" :key="ann.id">
        <view class="ann-title display-1-line">{{ ann.title }}</view>
        <view class="ann-basic-info">
          <view class="display-1-line">时间：{{ ann.publish_time.split(" ")[0] }}</view>
          <view class="display-1-line">学院：{{ ann.department_name }}</view>
          <view class="display-1-line">社团：{{ ann.club_name }}</view>
          <view class="display-1-line">作者：{{ ann.author_name }}</view>
        </view>
        <view class="display-3-line">{{ ann.summary }}</view>
      </view>
      <view class="ann-list-footer" @click="test">点击加载更多</view>
    </view>

  </view>

</template>

<script setup>
  import { ref } from 'vue';
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

</script>

<style scoped>
  .display-1-line {
    display: -webkit-inline-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .display-3-line {
    display: -webkit-inline-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .main {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .header .search-bar {
    display: flex;
    gap: 0.8em;
    background-color: #ececec;
    padding: 0.8em 1.2em;
  }

  .header .search-bar input {
    flex: 1;
    padding: 0.4em 0.8em;
    background-color: #fff;
  }

  .header .search-bar .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.8em;
    color: #fff;
    background-color: #0272af;
    border-radius: 4px;
  }

  .header .search-bar .search-button:active {
    background-color: #2089c2;
  }

  .header .search-bar .search-button image {
    padding: 4px 0 0 2px;
    width: 1.4em;
    height: 1.4em;
  }

  .header::after {
    content: "公告信息";
    display: block;
    padding: 0.4em 0.8em;
    font-size: 1.1em;
    font-weight: bolder;
    color: #0272af;
    background-color: #f9f9f9;
  }

  .ann-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding-top: 1em;
    overflow: scroll;
  }

  .ann-list-item {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 0 1em;
  }

  .ann-list-item .ann-title {
    font-size: 1.1em;
    font-weight: bolder;
  }

  .ann-list-item .ann-basic-info {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 0.2em;
    color: #999;
    font-size: 0.8em;
  }

  .ann-list-item::after {
    content: "";
    margin: 1em 1em 0.5em 1em;
    border-bottom: 1px solid #ddd;
  }

  .ann-list .ann-list-footer {
    position: relative;
    top: -1em;
    padding: 1em;
    margin: auto;
    width: fit-content;
    text-align: center;
    color: #999;
  }
</style>
