<template>
  <view class="container">
    <page-header>
      <view class="notice-section">
        <view class="notice-list">
          <view
            class="notice-item"
            v-for="(item, index) in noticeList"
            :key="index"
            @tap="viewNotice(item)"
          >
            <view
              class="notice-icon"
              :style="{ background: getIconBgColor(index) }"
            >
              <u-icon name="bell" size="40rpx" color="#fff"></u-icon>
              <view class="dot" v-if="!item.read"></view>
            </view>
            <view class="notice-content">
              <view class="notice-header">
                <text class="title">{{ item.title }}</text>
                <text class="time">{{ formatDisplayTime(item.time) }}</text>
              </view>
              <text class="desc">{{ item.content }}</text>
            </view>
          </view>

          <view v-if="noticeList.length === 0" class="empty-notice">
            <text>暂无通知消息</text>
          </view>
        </view>
      </view>
    </page-header>

    <!-- 详情弹框 -->
    <up-popup :show="showDetail" @close="close" @open="open">
      <view class="detail-popup">
        <view class="detail-header">
          <text class="detail-title">{{ currentNotice?.title }}</text>
          <text class="detail-time">{{ formatDate(currentNotice?.time) }}</text>
        </view>
        <!-- <view class="detail-content">
					<view class="detail-text">{{  currentNotice?.content }}</view>
					<view class="detail-text">{{ currentNotice?.detail  }}</view>
				</view> -->
        <scroll-view scroll-y enable-flex class="detail-content">
          <view class="detail-text">{{ currentNotice?.content }}</view>
          <view class="detail-text">{{ currentNotice?.detail }}</view>
        </scroll-view>
        <!-- <view class="detail-close" @tap="showDetail = false">
					<u-icon name="close" size="40rpx" color="#999"></u-icon>
				</view> -->
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formatTime } from "@/utils/date.js";
import { onLoad, onShow, onHide, onUnload } from "@dcloudio/uni-app";
// import eventBus from "@/utils/eventBus";
import { formatDate } from "@/utils/date.js";

const noticeList = ref([
  {
    title: "开启您的获客之旅，欢迎使用来客宝！",
    content:
      "亲爱的用户，欢迎加入来客宝！我们将为您提供强大的营销工具，帮助您提升客户体验，增加业务增长。",
    detail:
      "如果您在使用过程中遇到任何问题，随时可以联系我们的客服团队，我们提供全天候的支持，确保您的使用体验顺畅。现在就开始使用来客宝，快速提升您的业务成效，开启全新的获客之旅吧！",
    time: "2025-01-06T05:44:54.272Z",
    read: false,
  },
]);
const showDetail = ref(false);
const currentNotice = ref(null);

// 获取图标背景色
const getIconBgColor = (index) => {
  const colors = ["#1976d2", "#2196f3", "#42a5f5"];
  return colors[index % colors.length];
};

function open() {
  // 打开逻辑，比如设置 show 为 true
  showDetail.value = true;
  // console.log('open');
}

function close() {
  // 关闭逻辑，设置 show 为 false
  showDetail.value = false;
  // console.log('close');
}

// 处理推送消息

// 查看通知
const viewNotice = (notice) => {
  notice.read = true;
  currentNotice.value = notice;
  showDetail.value = true;
};

// onShow(() => {
// 	const savedList = uni.getStorageSync('noticeList')

// 		if (savedList) {
// 			noticeList.value = JSON.parse(savedList)
// 		}
// })

// 格式化显示时间
const formatDisplayTime = (timeStr) => {
  const now = new Date();
  const time = new Date(timeStr);
  const diff = now - time;

  // 如果在1分钟内
  if (diff < 60 * 1000) {
    return "刚刚";
  }

  return formatTime(time);
};

const handlePushMessage = (message) => {
  console.log("页面收到推送eventBus:", message);
  // 	const message={
  //     "type": "receive",
  //     "data": {
  //         "__UUID__": "androidPushMsg220983592",
  //         "title": "开启您的获客之旅，欢迎使用来客宝！",
  //         "appid": "__UNI__F87D543",
  //         "content": "亲爱的用户，欢迎加入来客宝！我们将为您提供强大的营销工具，帮助您提升客户体验，增加业务增长。",
  //         "payload": {
  //             "title": "欢迎使用来客宝营销软件！",
  //             "content": "亲爱的用户，欢迎加入来客宝！我们将为您提供强大的营销工具，帮助您提升客户体验，增加业务增长。",
  //             "detail": "我们为您提供了一整套智能营销工具，助力您创建个性化的营销活动，精准触达目标客户。如果您在使用过程中遇到任何问题，随时可以联系我们的客服团队，我们提供全天候的支持，确保您的使用体验顺畅。现在就开始使用迎客包，快速提升您的业务成效，开启全新的获客之旅吧！"
  //         }
  //     }
  // }
  try {
    const newNotice = {
      title: message?.data?.payload?.title,
      content: message?.data?.payload?.content,
      detail: message?.data?.payload?.detail,
      time: new Date().toISOString(), // 存储ISO格式时间字符串
      read: false,
    };
    noticeList.value.unshift(newNotice);
    console.log(newNotice, "newNotice");
    console.log(noticeList.value, "noticeList.value");
  } catch (e) {
    console.log("错误", e);
  }
};

// onLoad(() => {
//   eventBus.on("pushMessage", handlePushMessage); // 监听事件
//   // handlePushMessage()
// });
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8faff 0%, #e3f2fd 100%);
}

.notice-section {
  padding: 40rpx;

  .notice-list {
    .notice-item {
      display: flex;
      // gap: 24rpx;
      padding: 30rpx;
      background: #ffffff;
      border-radius: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:active {
        transform: translateY(2rpx);
        background: #f8faff;
      }

      .notice-icon {
        position: relative;
        width: 80rpx;
        height: 80rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .dot {
          position: absolute;
          top: -6rpx;
          right: -6rpx;
          width: 16rpx;
          height: 16rpx;
          background: #f44336;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
        }
      }

      .notice-content {
        margin-left: 24rpx;
        flex: 1;
        overflow: hidden;

        .notice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8rpx;

          .title {
            font-size: 28rpx;
            color: #37474f;
            font-weight: 600;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 70%;
          }

          .time {
            font-size: 24rpx;
            color: #78909c;
            flex-shrink: 0;
          }
        }

        .desc {
          font-size: 26rpx;
          color: #546e7a;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .empty-notice {
      text-align: center;
      padding: 40rpx;
      color: #78909c;
      font-size: 28rpx;
    }
  }
}

// 添加详情弹框样式
.detail-popup {
  // width: 600rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  // position: relative;

  .detail-header {
    margin-bottom: 30rpx;

    .detail-title {
      font-size: 32rpx;
      color: #37474f;
      font-weight: 600;
      display: block;
      margin-bottom: 10rpx;
    }

    .detail-time {
      font-size: 24rpx;
      color: #78909c;
    }
  }

  .detail-content {
    max-height: 40vh;
    overflow-y: auto;
    display: block;

    .detail-text {
      font-size: 28rpx;
      color: #546e7a;
      line-height: 1.6;
    }
  }
}
</style> 