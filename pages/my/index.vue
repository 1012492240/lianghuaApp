<template>
  <view class="container">
    <page-header>
      <!-- 用户信息区域 -->
      <view class="user-section">
        <view class="user-card">
          <view class="user-info">
            <view class="avatar-box">
              <!-- <image
                class="avatar"
                :src="userInfo.avatar"
                mode="aspectFill"
              ></image> -->
              <u-icon
                name="account-fill"
                class="avatar-box"
                size="120rpx"
                :color="['#1976d2', '#2196f3']"
              ></u-icon>
            </view>
            <view class="info-content">
              <view class="phone-box">
                <text class="phone">{{ userInfo.phone }}</text>
                <view class="vip-tag">
                  <u-icon name="account" size="24rpx" color="#FFD700"></u-icon>
                  <text>高级会员</text>
                </view>
              </view>
              <text class="user-id">用户名: {{ userInfo.nickname }}</text>
              <text class="expire-time"
                >会员有效期至：{{ userInfo.expireTime }}</text
              >
            </view>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-list">
          <view
            class="menu-item"
            v-for="(item, index) in menuItems"
            :key="index"
            @tap="navigateTo(item.path)"
          >
            <view class="item-left">
              <view class="icon-wrapper" :style="{ background: item.bgColor }">
                <u-icon :name="item.icon" size="40rpx" color="#fff"></u-icon>
              </view>
              <text class="item-name">{{ item.name }}</text>
            </view>
            <u-icon name="arrow-right" size="32rpx" color="#C0CFE3"></u-icon>
          </view>
        </view>
      </view>
    </page-header>
  </view>
</template>

<script setup>
import PageHeader from "@/components/page-header/page-header.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";

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

// 菜单项
const menuItems = [
  {
    name: "问题反馈",
    icon: "chat",
    path: "/pages/settings/feedback",
    bgColor: "linear-gradient(135deg, #1976d2, #2196f3)",
  },
  {
    name: "微信绑定",
    icon: "weixin-circle-fill",
    path: "/pages/wechat/bind",
    bgColor: "linear-gradient(135deg, #2196f3, #42a5f5)",
  },
  {
    name: "抖音任务",
    icon: "list-dot",
    path: "/pages/douyin/all-setting",
    bgColor: "linear-gradient(135deg, #2196f3, #42a5f5)",
  },
  {
    name: "更多设置",
    icon: "setting",
    path: "/pages/settings/more",
    bgColor: "linear-gradient(135deg, #2196f3, #42a5f5)",
  },
];

const navigateTo = (path) => {
  uni.navigateTo({ url: path });
};
</script>

<style lang="scss" scoped>
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
</style>