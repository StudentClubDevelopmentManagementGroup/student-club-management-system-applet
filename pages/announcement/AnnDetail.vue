<template>
  <view class="main">
    <view class="ann-title">{{ ann.title }}</view>
    <view class="ann-basic-info">
      <view class="display-1-line">时间：{{ ann.publish_time.split(" ")[0] }}</view>
      <view class="display-1-line">学院：{{ ann.department_name }}</view>
      <view class="display-1-line">社团：{{ ann.club_name }}</view>
      <view class="display-1-line">作者：{{ ann.author_name }}</view>
    </view>
    <uParse class="ann-content" :content="ann.content"></uParse>
  </view>
</template>

<script>
/*  2024-10-30
    富文本渲染组件 u-parse 暂不支持 vue3
    本页面使用 vue2 语法
*/
import uParse from '@/components/u-parse/u-parse.vue' 
import http from '@/utils/http'

const annLoadErr = {
  title:           "ERROR",  /* <- 加载失败时使用 */
  publish_time:    "...",
  department_name: "...",
  club_name:       "...",
  author_name:     "...",
  content:         "加载失败..."
}

export default {
  components: { uParse },
  data () {
    return {
      ann: {
        title:           "加载中... ",
        publish_time:    "加载中... ", /* <- 初始值也是很重要的 */
        department_name: "加载中... ",
        club_name:       "加载中... ",
        author_name:     "加载中... ",
        content:         "加载中... "
      }
    }
  },

  onLoad (params) {
    this.loadAnnDetail(params.annId)
  },

  methods: {
    loadAnnDetail(annId) {
    if (annId == "") {
      this.ann.value = annLoadErr
      return
    }

    http.get(`/club/announcement/read?announcementId=${annId}`)
    .then(res => {
      if (res.status_code != 200) {
        this.ann = annLoadErr
        return
      }
      this.ann = res.data
    })
  }
  }
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
  padding: 1em;
}

.ann-title {
  width: 100%;
  padding-bottom: 0.5em;
  margin-bottom: 0.5em;
  font-size: 1.3em;
  font-weight: bolder;
  text-align: center;
  word-break: break-all;
  border-bottom: 2px solid #555;
}

.ann-basic-info {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 0.2em;
  padding-bottom: 1em;
  color: #999;
  font-size: 0.8em;
}

.ann-content .strong {
  font-weight: bolder;
}

</style>
