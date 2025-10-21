<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 10 + 'px' }">
      <view class="nav-content">
        <view class="nav-left" @click="onBackClick">
          <u-icon name="arrow-left" size="20" color="#333333"></u-icon>
        </view>
        <view class="nav-title">地区选择</view>
        <view class="nav-right"></view>
      </view>
    </view>

    <view class="regions-container">
      <view class="regions-wrapper">
        <view
          v-for="(region, index) in regions"
          :key="index"
          class="region-tag"
          :class="{ active: selectedRegions.includes(region) }"
          @tap="toggleRegion(region)"
        >
          <text>{{ region }}</text>
        </view>
      </view>

      <!-- 底部确认按钮 -->
      <view class="confirm-btn">
        <view class="btn-inner" @tap="confirmSelection">
          <text>确认选择</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const statusBarHeight = ref(0);
const selectedRegions = ref([]);

// 中国所有省份列表
const regions = [
  "全选",
  "北京",
  "天津",
  "河北",
  "山西",
  "内蒙古",
  "辽宁",
  "吉林",
  "黑龙江",
  "上海",
  "江苏",
  "浙江",
  "安徽",
  "福建",
  "江西",
  "山东",
  "河南",
  "湖北",
  "湖南",
  "广东",
  "广西",
  "海南",
  "重庆",
  "四川",
  "贵州",
  "云南",
  "西藏",
  "陕西",
  "甘肃",
  "青海",
  "宁夏",
  "新疆",
  "香港",
  "澳门",
  "台湾",
];

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight;
    },
  });

  // 修改这里：直接使用 getCurrentPages()
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const eventChannel =
    currentPage.$scope?.getOpenerEventChannel?.() ||
    currentPage.getOpenerEventChannel?.();

  if (eventChannel) {
    eventChannel.on("acceptSelectedRegions", function (data) {
      if (data.selectedRegions) {
        selectedRegions.value = data.selectedRegions
          .split(",")
          .map((item) => item.trim());
      }
    });
  }
});

// 切换地区选择状态
const toggleRegion = (region) => {
  if (region === "全选") {
    // 如果点击的是"全选"
    if (selectedRegions.value.includes("全选")) {
      // 如果已经选中了"全选"，则取消选择
      selectedRegions.value = [];
    } else {
      // 如果没有选中"全选"，则只选择"全选"
      selectedRegions.value = ["全选"];
    }
  } else {
    // 如果点击的是其他地区
    // 首先移除"全选"
    const index = selectedRegions.value.indexOf("全选");
    if (index !== -1) {
      selectedRegions.value.splice(index, 1);
    }

    // 然后切换当前地区的选择状态
    const regionIndex = selectedRegions.value.indexOf(region);
    if (regionIndex === -1) {
      selectedRegions.value.push(region);
    } else {
      selectedRegions.value.splice(regionIndex, 1);
    }

    // 如果没有选择任何地区，则自动选择"全选"
    if (selectedRegions.value.length === 0) {
      selectedRegions.value = ["全选"];
    }
  }
};

// 确认选择时也需要修改
const confirmSelection = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const eventChannel =
    currentPage.$scope?.getOpenerEventChannel?.() ||
    currentPage.getOpenerEventChannel?.();

  if (eventChannel) {
    eventChannel.emit("updateRegions", selectedRegions.value.join(", "));
    uni.navigateBack();
  }
};

// 返回上一页
const onBackClick = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f8faff;
  padding-top: calc(var(--status-bar-height) + 88rpx);
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  .nav-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;

    .nav-left {
      width: 88rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .nav-right {
      width: 88rpx;
    }
  }
}

.regions-container {
  padding: 30rpx;
}

.regions-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 24rpx;
}

.region-tag {
  padding: 16rpx 32rpx;
  background: #f5f9ff;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;

  text {
    font-size: 28rpx;
    color: #37474f;
  }

  &.active {
    background: #e3f2fd;
    border-color: #1976d2;

    text {
      color: #1976d2;
    }
  }
}

.confirm-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 40rpx;
  background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);

  .btn-inner {
    height: 88rpx;
    background: #1976d2;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: 500;
    }

    &:active {
      transform: translateY(2rpx);
      background: #1565c0;
    }
  }
}
</style> 