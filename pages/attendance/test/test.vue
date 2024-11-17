<template>
    <view class="container">
        <!-- 第一部分：时间计时 -->
        <view class="section timer-section">
            <p>{{ formattedTime }}</p>
            <!-- 显示当前选中的社团名称 -->
            <p v-if="currentClub.clubName">{{ currentClub.clubName }}</p>
        </view>

        <!-- 第三部分：单一按钮 -->
        <view class="button-section">
            <button @click="toggleClocking" class="clocking-button">
                {{ isClockingIn ? '结束打卡' : '开始打卡' }}
            </button>
        </view>
    </view>
</template>

<script>
    import http from "@/utils/http.ts"; // 导入封装好的 http 请求工具

    export default {
        data() {
            return {
                currentClub: {}, // 存储当前社团信息
                userInfo: {}, // 存储用户信息
                attendanceData: {}, // 用对象来存储单个用户的数据
                isClockingIn: false, // 是否正在打卡
                timerInterval: null, // 用来存储计时器的 ID
                elapsedTime: 0, // 计时的秒数

            };
        },

        onLoad() {
            // 获取全局数据
            const app = getApp();
            const clubInfo = app.globalData.userData?.clubInfo || []; // 获取社团信息
            const userInfo = app.globalData.userData?.userInfo || {};
            this.userInfo = userInfo; // 将用户信息存储到 data 中

            // 获取当前选中的社团索引
            const currentClubIndex = app.globalData.appData?.currentClubIndex ?? 0;
            const selectedClub = clubInfo[currentClubIndex] || {};
            this.currentClub = selectedClub;

            // 恢复打卡状态
            const savedClockingStatus = wx.getStorageSync('isClockingIn');
            if (savedClockingStatus === 'true') {
                this.isClockingIn = true;
                const clockStartTime = wx.getStorageSync('clockStartTime');
                if (clockStartTime) {
                    this.elapsedTime = Math.floor((Date.now() - clockStartTime) / 1000); // 恢复计时
                    this.timerInterval = setInterval(() => {
                        this.elapsedTime = Math.floor((Date.now() - clockStartTime) / 1000); // 继续计时
                    }, 1000);
                }
            } else {
                this.isClockingIn = false;
            }
        },

        computed: {
            formattedTime() {
                const hours = String(Math.floor(this.elapsedTime / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((this.elapsedTime % 3600) / 60)).padStart(2, '0');
                const seconds = String(this.elapsedTime % 60).padStart(2, '0');
                return `${hours} : ${minutes} : ${seconds}`;
            },
        },

        methods: {
            // 切换打卡状态
            toggleClocking() {
                if (this.isClockingIn) {
                    this.endClockingIn();
                    wx.setStorageSync('isClockingIn', 'false');
                } else {
                    this.startClockingIn();
                    wx.setStorageSync('isClockingIn', 'true');
                }
            },

            // 开始打卡
            startClockingIn() {
                this.isClockingIn = true;
                const startTime = Date.now(); // 获取当前时间戳
                wx.setStorageSync('clockStartTime', startTime); // 将时间戳保存到本地

                this.timerInterval = setInterval(() => {
                    this.elapsedTime = Math.floor((Date.now() - startTime) / 1000); // 计算经过的秒数
                }, 1000);
            },

            // 结束打卡
            endClockingIn() {
                this.isClockingIn = false;
                clearInterval(this.timerInterval); // 停止计时
                this.elapsedTime = 0; // 重置计时
                wx.removeStorageSync('clockStartTime'); // 清除本地保存的时间戳
            },
        },

        beforeDestroy() {
            // 清理计时器，避免内存泄漏
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
        },
    };
</script>

<style scoped>
    /* 样式可以根据需求进行调整 */
</style>
