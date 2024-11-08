<template>
  <view class="main">

    <view class="header">
      <view class="search-bar">
        <view class="filter-button" @click="showFilterPanel=true">
          <image src="./filter-icon.svg"></image>
        </view>
        <input type="text" placeholder="请输入标题关键字" v-model="searchFilter.titleKeyword"/>
        <view class="search-button" @click="clickSearchBtn()">
          <image src="./search-icon.svg"></image>
        </view>
      </view>
    </view>

    <view class="filter-popup" v-if="showFilterPanel">
      <!-- 2024-11-01 note: v-show 在微信小程序中无效，故这里用 v-if -->
      <view class="filter-mask" @click="showFilterPanel=false"></view>
      <view class="filter-panel">
        <text class="item-name">设置筛选条件</text>

        <view class="filter-panel-item data-range">
          <text class="item-name">日期</text>
          <picker mode="date" :value="searchFilter.dateFrom" @change="changeDateFrom">
            <text>{{ searchFilter.dateFrom || '开始日期' }}</text>
          </picker>
          <text style="margin: 0 0.5em;">至</text>
          <picker mode="date" :value="searchFilter.dateTo" @change="changeDateTo">
            <text>{{ searchFilter.dateTo || '结束日期' }}</text>
          </picker>
        </view>
        
        <!--
        <view class="filter-panel-item">
          <text class="item-name">院系</text>
          TODO
        </view>
        
        <view class="filter-panel-item">
          <text class="item-name">社团</text>
          TODO
        </view>
        -->

        <view class="filter-panel-item buttons" style="
        display: flex; flex-direction: row-reverse; padding-left: 40%; padding-right: 5%;">
          <button style="line-height: 2em; background-color: #efefef" @click="clickResetFilterBtn">重置</button>
          <button style="line-height: 2em; background-color: #2089c2; color: #fff;" @click="clickFinishFilterBtn">完成</button>
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
      <view class="ann-list-load-more" @click="loadNextPageAnn">
        {{ isAllLoaded ? (searchFilter.pageNum == 1 ? "没有相关公告" : "已加载全部") : (isLoading ? "加载中..." : "点击加载更多") }}
      </view>
    </view>

  </view>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import http from '@/utils/http'

  let showFilterPanel = ref(false)

  let searchFilter = ref({
    titleKeyword: "",
    dateFrom: "",
    dateTo: "",
    pageNum: 1,
  })

  function changeDateFrom(e) { searchFilter.value.dateFrom = e.detail.value }
  function changeDateTo(e) { searchFilter.value.dateTo = e.detail.value }

  function clickResetFilterBtn() {
    searchFilter.value.dateFrom = ""
    searchFilter.value.dateTo   = ""
  }

  function clickFinishFilterBtn() {
    showFilterPanel.value = false
    clickSearchBtn()
  }

  function validateDateRange() {

    const dateTo   = searchFilter.value.dateTo
    const dateFrom = searchFilter.value.dateFrom

    if ( ! dateTo && ! dateFrom)
      return true

    const today    = new Date()
    const toDate   = dateTo   ? new Date(dateTo)   : today
    const fromDate = dateFrom ? new Date(dateFrom) : toDate

    if ( ! (fromDate <= toDate && toDate <= today)) {
      uni.showToast({ title: "筛选条件日期不合法", icon: "none" })
      return false
    }

    return true
  }

  let isLoading = ref(false)
  let isAllLoaded = ref(false)

  let annList = ref([])
  const pageSize = 4

  function loadNextPageAnn(clearAll=false) {
    if (isLoading.value || isAllLoaded.value)
      return
    if ( ! validateDateRange())
      return

    isLoading.value = true

    http.get("/club/announcement/search", {
      title_keyword : searchFilter.value.titleKeyword.trim(),
      from_date     : searchFilter.value.dateFrom,
      to_date       : searchFilter.value.dateTo,
      page_num      : searchFilter.value.pageNum,
      page_size     : pageSize
    })
    .then(res => {

      isLoading.value = false

      if (res.status_code !== 200) {
        uni.showToast({ title: "加载失败", icon: "none" })
        return
      }

      if (clearAll)
        annList.value = []

      annList.value.push(...res.data.records)

      if (pageSize == res.data.records.length) {
        searchFilter.value.pageNum += 1
      } else {
        isAllLoaded.value = true
      }
    })
  }

  onLoad(() => { loadNextPageAnn() })

  function clickAnn(ann) {
    uni.navigateTo({ url: `/pages/announcement/AnnDetail?annId=${ann.announcement_id}` })
  }

  function clickSearchBtn() {
    searchFilter.value.pageNum = 1
    isAllLoaded.value = false

    loadNextPageAnn(true)
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

  /* -------- */

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
  
  /* -------- */

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
  
  /* -------- */

  .filter-popup {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }

  .filter-popup .filter-mask {
    height: 500rpx;
    background-color: #000;
    opacity: 0.5;
  }

  .filter-popup .filter-panel {
    flex: 1;
    padding: 0.8em;
    background-color: #fff;
  }

  .filter-popup .filter-panel .filter-panel-item {
    margin: 1.5em 0;
    display: flex;
  }

  /* -------- */

  .filter-panel-item .item-name {
    width: 3em;
    font-weight: bolder;
  }

  .filter-panel-item.data-range {
    line-height: 1.8em;
  }
  .filter-panel-item.data-range picker {
    flex: 1;
    text-align: center;
    border: 1px solid #666;
  }
</style>
