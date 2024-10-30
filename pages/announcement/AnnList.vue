<template>
  <view class="main">

    <view class="header">
      <view class="search-bar">
        <view class="filter-button">
          <image src="./filter-icon.svg"></image>
        </view>
        <input type="text" placeholder="请输入搜索内容" />
        <view class="search-button">
          <image src="./search-icon.svg"></image>
        </view>
      </view>
    </view>
    
    <view class="ann-list-header">
      <view>公告信息</view>
    </view>
    <view class="ann-list">
      <view class="ann-list-item" @click="clickAnn(ann)" v-for="ann in annList" :key="ann.announcement_id">
        <view class="ann-title display-1-line">{{ ann.title }}</view>
        <view class="ann-basic-info">
          <view class="display-1-line">时间：{{ ann.publish_time.split(" ")[0] }}</view>
          <view class="display-1-line">学院：{{ ann.department_name }}</view>
          <view class="display-1-line">社团：{{ ann.club_name }}</view>
          <view class="display-1-line">作者：{{ ann.author_name }}</view>
        </view>
        <view class="display-3-line">{{ ann.summary }}</view>
      </view>
      <view class="ann-list-load-more" @click="loadMoreAnn">
        {{ isAllLoaded ? "已加载全部" : isLoading ? "加载中..." : "点击加载更多" }}
      </view>
    </view>

  </view>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import http from '@/utils/http'

  let isLoading = ref(false)
  let isAllLoaded = ref(false)

  let annList = ref([])
  let pageNum = 1
  const pageSize = 4

  function loadMoreAnn() {
    if (isLoading.value || isAllLoaded.value)
      return

    isLoading.value = true

    http.get("/club/announcement/search", {
      page_num: pageNum,
      page_size: pageSize
    })
    .then(res => {

      isLoading.value = false

      if (res.status_code !== 200) {
        uni.showToast({ title: "加载失败", icon: "none" })
        return
      }

      annList.value.push(...res.data.records)

      if (pageSize == res.data.records.length) {
        pageNum += 1
      } else {
        isAllLoaded.value = true
      }
    })
  }

  onMounted(() => { loadMoreAnn() })

  function clickAnn(ann) {
    console.log(ann);
    uni.navigateTo({
      url: "/pages/announcement/AnnDetail"
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

  .search-bar {
    display: flex;
    justify-content: center;
    gap: 0.6em;
    background-color: #ececec;
    padding: 0.8em 1.2em;
  }

  .search-bar .filter-button image {
    margin-left: -2px;
    padding-top: 2px;
    width: 1.4em;
    height: 100%;
  }
  
  .search-bar input {
    flex: 1;
    padding: 0.4em 0.8em;
    background-color: #fff;
  }

  .search-bar .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.8em;
    color: #fff;
    background-color: #0272af;
    border-radius: 4px;
  }

  .search-bar .search-button:active {
    background-color: #2089c2;
  }

  .search-bar .search-button image {
    padding: 4px 0 0 2px;
    width: 1.4em;
    height: 1.4em;
  }

  .ann-list-header {
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

  .ann-list .ann-list-load-more {
    position: relative;
    top: -1em;
    padding: 1em;
    margin: auto;
    width: fit-content;
    text-align: center;
    color: #999;
  }
</style>
