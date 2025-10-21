<template>
  <view class="dashboard-container" :class="{ 'fullscreen-mode': isFullscreen }">
    <scroll-view 
      scroll-y 
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      class="scroll-container"
    >
      <view class="dashboard-header" v-show="!isFullscreen">
        <text class="dashboard-title">数据看板</text>
      </view>
      <view class="chart-section">
        <view class="chart-card">
          <qiun-data-charts type="line" :opts=" opts" :chartData="chartData" :ontouch="true" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import PageHeader from "@/components/page-header/page-header.vue";
import { ref, onMounted,onUnmounted } from "vue";
import { useUserStore } from "@/store/user";
import { api,responseHandler  } from '@/api/index.js';
import { onShow } from '@dcloudio/uni-app'

const chartData = ref()

const isRefreshing = ref(false)

// 获取图表数据
const fetchChartData = async () => {
  try {
    const res = await api.getUserAgentStats()
	 // const data = await responseHandler.success(res);
    // 转换数据格式
    const formattedData = {
      categories: [],
      series: [
        {
          name: "触达数量（次）",
          data: []
        }
      ]
    }
    
    // 判断是否有数据，注意正确的数据层级
    if (res.data && res.data.data && res.data.data.list && res.data.data.list.length > 0) {
      // 反转数组以便按时间正序显示
      const sortedList = [...res.data.data.list].reverse()
      // 格式化日期，只显示月-日
      formattedData.categories = sortedList.map(item => {
        const date = item.stat_date.split('-')
        return `${date[1]}-${date[2]}`  // 只返回月-日格式
      })
      formattedData.series[0].data = sortedList.map(item => parseInt(item.reach_count))
    }
    
    chartData.value = formattedData
  } catch (error) {
 responseHandler.error(error);
  }
}

// 下拉刷新处理函数
const onRefresh = async () => {
  isRefreshing.value = true
  await fetchChartData()
  isRefreshing.value = false
}

// 将原来在 onMounted 中的请求移到 onShow 中
onShow(() => {
  fetchChartData()
})
    
const opts = {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,10,0,15],
        enableScroll: true, // 启用滚动功能
        legend: {},
        xAxis: {
          disableGrid: true,
          // scrollShow: true, // 显示滚动条
          itemCount: 5,  // 一次显示5个数据点
          scrollAlign: 'right' // 滚动条位置
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "hollow"
          }
        }
}


// 用户信息
const userInfo = ref({
  phone: "",
  userId: "",
  avatar: "/static/avatar.png",
  expireTime: "",
});

// 获取本地存储的用户信息
const getUserInfo = () => {
  const storageUserInfo = uni.getStorageSync("userInfo");
  console.log("storageUserInfo", storageUserInfo);
  if (storageUserInfo) {
    userInfo.value = {
      ...userInfo.value,
      ...storageUserInfo,
    };
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  getUserInfo();
});



const navigateTo = (path) => {
  uni.navigateTo({ url: path });
};

const fullscreenPopup = ref(null)

// 全屏图表的配置
const fullscreenOpts = {
  ...opts,
  padding: [50, 30, 30, 40], // 调整全屏时的内边距，确保图表完全显示
  enableScroll: true, // 允许图表滚动
  extra: {
    ...opts.extra,
    line: {
      ...opts.extra.line,
      width: 3
    }
  }
}

const isFullscreen = ref(false)

// 打开全屏
const handleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value
  
  if (isFullscreen.value) {
    // 强制横屏
    plus.screen.lockOrientation('landscape')
    // 隐藏底部导航栏
    uni.hideTabBar()
  } else {
    // 恢复自动旋转
    plus.screen.lockOrientation('portrait-primary')
    // 显示底部导航栏
    uni.showTabBar()
  }
}

// 关闭全屏
const closeFullScreen = () => {
  // 恢复自动旋转
  plus.screen.lockOrientation('portrait-primary')
  // 显示底部导航栏
  uni.showTabBar()
  fullscreenPopup.value.close()
}

// 监听弹窗状态变化
const handlePopupChange = (e) => {
  if (!e.show) {
    closeFullScreen()
  }
}

// 监听页面卸载
onUnmounted(() => {
  // 恢复自动旋转和显示底部导航栏
  plus.screen.lockOrientation('portrait-primary')
  uni.showTabBar()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scroll-container {

  
  width: 100%;
  height: 100vh;
}

.dashboard-header {
  padding: 80rpx 20rpx 40rpx;
  width: 100%;
  text-align: center;
  
  .dashboard-title {
    font-size: 36rpx;
    color: #1976d2;
    font-weight: 600;
  }
}

.chart-section {


  width: 100%;
  display: flex;
  justify-content: center;

  // background:red;
  
  .chart-card {
    width: 96%;
    background: #ffffff;
    border-radius: 24rpx;
    // padding: 20rpx 0rpx;
    box-shadow: 0 4rpx 20rpx rgba(25, 118, 210, 0.08);
    height: 400rpx;
  }
}
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8faff 0%, #e3f2fd 100%);
}

.user-section {
  padding: 40rpx;
  // padding-top: 120rpx;

  .user-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .user-info {
      display: flex;
      // gap: 30rpx;

      .avatar-box {
        width: 120rpx;
        height: 120rpx;
        border-radius: 24rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

        .avatar {
          width: 100%;
          height: 100%;
        }
      }

      .info-content {
        margin-left: 30rpx;
        flex: 1;

        .phone-box {
          display: flex;
          align-items: center;
          gap: 16rpx;
          margin-bottom: 12rpx;

          .phone {
            font-size: 36rpx;
            color: #37474f;
            font-weight: 600;
          }

          .vip-tag {
            display: flex;
            align-items: center;
            gap: 8rpx;
            background: #fff8e1;
            padding: 4rpx 12rpx;
            border-radius: 8rpx;

            text {
              font-size: 24rpx;
              color: #ffa000;
            }
          }
        }

        .user-id {
          font-size: 26rpx;
          color: #78909c;
          margin-bottom: 8rpx;
          display: block;
        }

        .expire-time {
          font-size: 26rpx;
          color: #1976d2;
          display: block;
        }
      }
    }
  }
}

.menu-section {
  padding: 0 40rpx;
  // margin-top: 30rpx;

  .menu-list {
    background: #ffffff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1px solid #f5f9ff;

      &:last-child {
        border-bottom: none;
      }

      .item-left {
        display: flex;
        align-items: center;

        .icon-wrapper {
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-name {
          margin-left: 24rpx;
          font-size: 28rpx;
          color: #37474f;
          font-weight: 500;
        }
      }

      &:active {
        background: #f8faff;
      }
    }
  }
}

.chart-card {
  position: relative;
  
  .chart-header {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    z-index: 1;
    
    .fullscreen-icon {
      padding: 10rpx;
    }
  }
}

.fullscreen-chart {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  position: relative;
  padding-top: var(--status-bar-height);
  display: flex;
  flex-direction: column;
  
  .popup-header {
    position: fixed; // 改为fixed定位
    top: calc(var(--status-bar-height) + 20rpx);
    right: 20rpx;
    z-index: 10;
    
    .close-btn {
      width: 60rpx;
      height: 60rpx;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .close-icon {
        color: #ffffff;
        font-size: 40rpx;
        line-height: 1;
      }
    }
  }

  .chart-container {
    flex: 1;
    width: 100%;
    height: calc(100vh - var(--status-bar-height));
    padding: 20rpx;
    box-sizing: border-box;
  }
}

// 横屏样式调整
@media screen and (orientation: landscape) {
  .fullscreen-chart {
    .chart-container {
      padding: 40rpx;
    }
  }
}
</style>