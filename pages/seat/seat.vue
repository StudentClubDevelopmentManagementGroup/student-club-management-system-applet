<template>
  <view id="main-content" style="background-image: url('/static/images/背景.jpg');">
    <!-- 显示当前社团的名称 -->
    <div id="club-selection">
      <p v-if="!currentClub.clubName">你还没有加入社团</p>
      <p v-else>您所在的社团：{{ currentClub.clubName }}</p>
    </div>

    <!-- 座位布局部分 -->
    <div id="seat-container" :style="seatContainerStyle" v-if="currentClub.clubName">
      <div id="seat-layout" :style="seatLayoutStyle">
        <div
          class="seat"
          v-for="seat in seats"
          :key="seat.seat_id"
          :style="getSeatStyle(seat)"
          :title="getSeatDescription(seat)">
          <div v-if="seat.owner" class="seat-owner">{{ seat.owner.name }}</div>
        </div>
      </div>
    </div>
  </view>
</template>


<script>
import http from "@/utils/http.ts";

export default {
  data() {
    return {
      currentClub: {}, // 当前社团信息
      userInfo: {}, // 用户信息
      seats: [], // 座位信息
      containerWidth: 0, // 画布宽度
      containerHeight: 0, // 画布高度
      seatMinX: 0, // 座位表的最小X坐标
      seatMaxX: 0, // 座位表的最大X坐标
      seatMinY: 0, // 座位表的最小Y坐标
      seatMaxY: 0, // 座位表的最大Y坐标
    };
  },
  onLoad() {
    const app = getApp();
    const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
    const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0; // 当前社团索引

    // 设置当前社团
    this.currentClub = clubInfo[currentClubIndex] || {};

    // 获取座位信息
    if (this.currentClub.clubId) {
      this.fetchSeats();
    }
  },
  methods: {
    fetchSeats() {
      http.get('/club/seat/view', { club_id: this.currentClub.clubId })
        .then(res => {
          this.seats = res.data;
          this.calculateSeatBoundaries();
          this.setContainerSize();
        })
        .catch(error => {
          console.error('Error fetching seats:', error);
        });
    },
    calculateSeatBoundaries() {
      this.seatMinX = Math.min(...this.seats.map(seat => seat.x));
      this.seatMaxX = Math.max(...this.seats.map(seat => seat.x));
      this.seatMinY = Math.min(...this.seats.map(seat => seat.y));
      this.seatMaxY = Math.max(...this.seats.map(seat => seat.y));
    },
    setContainerSize() {
      const width = this.seatMaxX - this.seatMinX;
      const height = this.seatMaxY - this.seatMinY;

      this.containerWidth = width;
      this.containerHeight = height + 50;

      this.centerX = (this.seatMaxX + this.seatMinX) / 2;
      this.centerY = (this.seatMaxY + this.seatMinY) / 2;
    },
    getSeatStyle(seat) {
      return {
        position: 'absolute',
        left: `${seat.x - this.centerX + this.containerWidth / 2}px`,
        top: `${seat.y - this.centerY + this.containerHeight / 2}px`,
        width: '75px',
        height: '55px',
        backgroundColor: seat.owner ? 'lightblue' : 'lightgray',
        border: '1px solid #ccc',
        borderRadius: '5px',
      };
    },
    getSeatDescription(seat) {
      return seat.description ? seat.description : '空位';
    }
  },
  computed: {
    seatContainerStyle() {
      return {
        position: 'relative',
        width: `95vw`,
        height: `80%`,
        margin: '0 auto',
      };
    },
    seatLayoutStyle() {
      return {
        position: 'relative',
        width: `${this.containerWidth}px`,
        height: `${this.containerHeight}px`,
      };
    }
  }
};
</script>

<style lang="css" scoped>
  @import url(./seat.css);
</style>
