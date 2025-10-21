<template>
  <view class="container">
    <u-navbar
      title="更多设置"
      :autoBack="true"
      fixed
      placeholder
      bgColor="#ffffff"
      titleStyle="color: #333333; font-size: 16px; "
    ></u-navbar>

    <view class="settings-section">
      <view class="settings-group">
        <view
          class="settings-item"
          @tap="navigateTo('/pages/settings/agreement')"
        >
          <view class="item-left">
            <u-icon name="file-text" size="40rpx" color="#007AFF"></u-icon>
            <text>用户协议</text>
          </view>
          <u-icon name="arrow-right" size="32rpx" color="#C8C9CC"></u-icon>
        </view>

        <view
          class="settings-item"
          @tap="navigateTo('/pages/settings/privacy')"
        >
          <view class="item-left">
            <u-icon name="lock" size="40rpx" color="#007AFF"></u-icon>
            <text>隐私政策</text>
          </view>
          <u-icon name="arrow-right" size="32rpx" color="#C8C9CC"></u-icon>
        </view>

        <view
          class="settings-item"
          @tap="navigateTo('/pages/settings/permissions')"
        >
          <view class="item-left">
            <u-icon name="setting" size="40rpx" color="#007AFF"></u-icon>
            <text>权限管理</text>
          </view>
          <u-icon name="arrow-right" size="32rpx" color="#C8C9CC"></u-icon>
        </view>

        <view class="settings-item" @tap="checkUpdate">
          <view class="item-left">
            <u-icon name="reload" size="40rpx" color="#007AFF"></u-icon>
            <text>检查更新</text>
          </view>
          <!-- <view class="version-wrapper">
            <text class="version">v{{ currentVersion }}</text>
            <u-icon name="arrow-right" size="32rpx" color="#C8C9CC"></u-icon>
          </view> -->
        </view>
      </view>

      <view class="logout-wrapper">
        <view class="logout-btn" @tap="logout" hover-class="logout-btn-hover">
          <text>退出登录</text>
        </view>
      </view>
    </view>

    <up-modal
      :show="showLogoutModal"
      title="提示"
      content="确定要退出登录吗？"
      showCancelButton
      @confirm="handleLogoutConfirm"
      @cancel="handleLogoutCancel"
      confirmText="退出"
      cancelText="取消"
      confirmColor="#FF3B30"
      cancelColor="#999999"
      zoom="false"
    ></up-modal>
  </view>
</template>

<script setup>
import PageHeader from "@/components/page-header/page-header.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";

const settings = ref({
  notification: true,
  darkMode: false,
});

const toggleNotification = () => {
  settings.value.notification = !settings.value.notification;
};

const navigateTo = (url) => {
  uni.navigateTo({ url });
};

const currentVersion = ref("1.0.0");

onMounted(() => {
  // #ifdef APP-PLUS
  currentVersion.value = plus.runtime.version;
  // #endif
});

const checkUpdate = async () => {
  uni.showToast({
    title: "已是最新版本",
    icon: "none",
  });
  return;
  try {
    uni.showLoading({ title: "检查更新中..." });

    // 获取当前应用版本号
    // #ifdef APP-PLUS
    const currentVersion = plus.runtime.version;
    // #endif
    // #ifdef H5 || MP-WEIXIN
    const currentVersion = "1.0.0"; // H5和小程序环境使用固定版本号
    // #endif

    // TODO: 这里应该替换为实际的API调用
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          latestVersion: currentVersion, // 修改为与当前版本相同，表示已是最新版
          forceUpdate: false,
          downloadUrl: "https://example.com/app/latest",
        });
      }, 1000);
    });

    uni.hideLoading();

    // 版本号对比
    const isNewer = (v1, v2) => {
      const v1Parts = v1.split(".").map(Number);
      const v2Parts = v2.split(".").map(Number);

      for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part > v2Part) return true;
        if (v1Part < v2Part) return false;
      }
      return false;
    };

    if (isNewer(response.latestVersion, currentVersion)) {
      uni.showModal({
        title: "发现新版本",
        content: `发现新版本 ${response.latestVersion}，是否立即更新？`,
        confirmText: "立即更新",

        success: (res) => {
          if (res.confirm) {
            // 处理更新逻辑
            if (response.downloadUrl) {
              // #ifdef APP-PLUS
              plus.runtime.openURL(response.downloadUrl);
              // #endif
              // #ifdef H5 || MP-WEIXIN
              uni.showToast({
                title: "请前往应用商店更新",
                icon: "none",
              });
              // #endif
            }
          }
        },
      });
    } else {
      uni.showToast({
        title: "已是最新版本",
        icon: "none",
      });
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: "检查更新失败",
      icon: "none",
    });
  }
};

const showLogoutModal = ref(false);

const logout = () => {
  showLogoutModal.value = true;
};

const userStore = useUserStore();

const handleLogoutConfirm = () => {
  userStore.logout();
  uni.showToast({
    title: "已退出登录",
    icon: "success",
    duration: 2000,
  });
  setTimeout(() => {
    uni.reLaunch({
      url: "/pages/login/index",
    });
  }, 2000);
};

const handleLogoutCancel = () => {
  showLogoutModal.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f6f7f9;
}

.settings-section {
  padding: 24rpx;

  .settings-group {
    background: #ffffff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

    .settings-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      border-bottom: 1px solid #f5f6f7;
      transition: all 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f9fafb;
      }

      .item-left {
        display: flex;
        align-items: center;
        // gap: 16rpx;

        text {
          margin-left: 16rpx;
          font-size: 28rpx;
          color: #333333;
          font-weight: 400;
        }
      }

      .version-wrapper {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .version {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }

  .logout-wrapper {
    padding: 24rpx 0;

    .logout-btn {
      width: 100%;
      height: 88rpx;
      background: #ffffff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
      transition: all 0.2s;

      text {
        font-size: 28rpx;
        color: #ff3b30;
        font-weight: 500;
      }
    }

    .logout-btn-hover {
      background-color: #f9fafb;
      transform: scale(0.99);
    }
  }
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .container {
    background-color: #1c1c1e;
  }

  .settings-group {
    background: #2c2c2e !important;
    box-shadow: none !important;

    .settings-item {
      border-bottom-color: #3a3a3c !important;

      &:active {
        background-color: #3a3a3c !important;
      }

      .item-left text {
        color: #ffffff !important;
      }
    }
  }

  .logout-btn {
    background: #2c2c2e !important;
    box-shadow: none !important;

    &:active {
      background-color: #3a3a3c !important;
    }
  }
}
</style> 