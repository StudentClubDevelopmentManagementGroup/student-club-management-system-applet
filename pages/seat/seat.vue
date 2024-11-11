<template>
  <view id="main-content" style="background-image: url('/static/images/背景.jpg');">
    <!-- 选择社团的部分 -->
        <div id="club-selection">
          <p>选择社团</p>
        </div>
	
	<div id="seat-container" :style="seatContainerStyle">
      <div id="seat-layout">
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
import http from "@/utils/http.ts"
import tools from "@/utils/tools.js"

export default {
  data() {
    return {
      seats: [],
      containerWidth: 0,  // 画布宽度
      containerHeight: 0, // 画布高度
      seatMinX: 0,        // 座位表的最小X坐标
      seatMaxX: 0,        // 座位表的最大X坐标
      seatMinY: 0,        // 座位表的最小Y坐标
      seatMaxY: 0         // 座位表的最大Y坐标
    };
  },
  mounted() {
    this.fetchSeats();
  },
  methods: {
    fetchSeats() {
      http.get('/club/seat/view', {
      	club_id: 36
      })
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
      // 计算座位表的边界：最小和最大坐标
      this.seatMinX = Math.min(...this.seats.map(seat => seat.x));
      this.seatMaxX = Math.max(...this.seats.map(seat => seat.x));
      this.seatMinY = Math.min(...this.seats.map(seat => seat.y));
      this.seatMaxY = Math.max(...this.seats.map(seat => seat.y));
    },
    setContainerSize() {
      // 计算座位表的大小
      const width = this.seatMaxX - this.seatMinX;
      const height = this.seatMaxY - this.seatMinY;

      // 设置容器大小，留有一些边距
      this.containerWidth = width + 50;  // 缩小边距，避免过多的空间
      this.containerHeight = height + 50; // 留出一定的上下边距

      // 更新容器的中心位置
      this.centerX = (this.seatMaxX + this.seatMinX) / 2;
      this.centerY = (this.seatMaxY + this.seatMinY) / 2;
    },
    getSeatStyle(seat) {
      return {
        position: 'absolute',
        // 平移到容器中心
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
        width: `${this.containerWidth}px`,
        height: `${this.containerHeight}px`,
        margin: '0 auto',  // 居中显示
      };
    }
  }
};
</script>

<style lang="css" scoped>
  @import url(./seat.css);
</style>
