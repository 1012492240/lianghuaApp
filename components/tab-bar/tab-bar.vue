<template>
  <view class="tab-bar">
    <view class="tab-bar-bg">
      <view class="blur-bg"></view>
      <view class="glow-line"></view>
    </view>
    <view class="tab-bar-content">
      <view
        class="tab-item"
        v-for="(item, index) in tabs"
        :key="index"
        @tap="switchTab(item.pagePath)"
        :class="{ active: currentPath === item.pagePath }"
      >
        <view class="icon-box">
          <u-icon
            :name="
              currentPath === item.pagePath ? item.selectedIcon : item.icon
            "
            size="44rpx"
            :color="
              currentPath === item.pagePath
                ? '#a98cff'
                : 'rgba(255,255,255,0.6)'
            "
          ></u-icon>
          <view
            class="active-circle"
            v-if="currentPath === item.pagePath"
          ></view>
        </view>
        <text class="tab-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentPath = ref("/pages/index/index");

const tabs = [
  {
    pagePath: "/pages/index/index",
    text: "首页",
    icon: "home",
    selectedIcon: "home-fill",
  },
  {
    pagePath: "/pages/my/index",
    text: "我的",
    icon: "account",
    selectedIcon: "account-fill",
  },
];

const switchTab = (path) => {
  if (currentPath.value === path) return;
  uni.switchTab({ url: path });
  currentPath.value = path;
};

onMounted(() => {
  const pages = getCurrentPages();
  if (pages.length) {
    currentPath.value = "/" + pages[pages.length - 1].route;
  }
});
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  z-index: 999;

  .tab-bar-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .blur-bg {
      position: absolute;
      top: -20rpx;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 15, 29, 0.8);
      backdrop-filter: blur(20px);
    }

    .glow-line {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(122, 136, 255, 0.2),
        rgba(122, 136, 255, 0.8),
        rgba(122, 136, 255, 0.2),
        transparent
      );
    }
  }

  .tab-bar-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom);

    .tab-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10rpx 0;
      position: relative;

      .icon-box {
        position: relative;
        width: 88rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .active-circle {
          position: absolute;
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(122, 136, 255, 0.2) 0%,
            rgba(122, 136, 255, 0.1) 50%,
            transparent 70%
          );
          animation: pulseGlow 2s ease-in-out infinite;
        }
      }

      .tab-text {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 4rpx;
        transition: all 0.3s ease;
      }

      &.active {
        .tab-text {
          color: #a98cff;
          text-shadow: 0 0 10rpx rgba(169, 140, 255, 0.3);
        }
      }
    }
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}
</style> 