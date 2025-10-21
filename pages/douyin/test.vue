<template>
  <view class="container">
    <page-header>
      <view class="header-section">
        <view class="title-wrapper">
          <text class="title">评论获客</text>
          <text class="title-en">COMMENT LEADS</text>
          <view class="title-decoration">
            <view class="line"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="form-box">
          <!-- 视频搜索关键词 -->
          <view class="form-item">
            <text class="label">视频搜索关键词</text>
            <view class="input-wrapper">
              <u-icon name="search" size="40rpx" color="#6C7A8F"></u-icon>
              <input
                type="text"
                v-model="formData.keywords"
                placeholder="请输入视频搜索关键词"
                placeholder-class="placeholder"
              />
            </view>
          </view>

          <!-- 评论筛选词 -->
          <view class="form-item">
            <text class="label">评论筛选词</text>
            <view class="input-wrapper" @tap="navigateToFilterWords">
              <u-icon
                name="checkmark-circle"
                size="40rpx"
                color="#6C7A8F"
              ></u-icon>
              <view
                class="selected-words"
                :class="{ placeholder: !formData.filterWords.length }"
              >
                <text v-if="formData.filterWords.length">{{
                  formData.filterWords.join(", ")
                }}</text>
                <text v-else>点击选择筛选词</text>
              </view>
              <u-icon name="arrow-right" size="36rpx" color="#6C7A8F"></u-icon>
            </view>
          </view>

          <!-- 评论屏蔽词 -->
          <view class="form-item">
            <text class="label">评论屏蔽词</text>
            <view class="input-wrapper">
              <u-icon name="close-circle" size="40rpx" color="#6C7A8F"></u-icon>
              <input
                type="text"
                v-model="formData.blockWords"
                placeholder="多个屏蔽词用逗号分隔"
                placeholder-class="placeholder"
              />
            </view>
          </view>

          <!-- 获客数量 -->
          <view class="form-item">
            <text class="label">获客数量</text>
            <view class="input-wrapper">
              <u-icon name="account" size="40rpx" color="#6C7A8F"></u-icon>
              <input
                type="number"
                v-model="formData.targetCount"
                placeholder="请输入目标获客数量"
                placeholder-class="placeholder"
              />
            </view>
          </view>

          <!-- 私信消息 -->
          <view class="form-item message-item">
            <text class="label">私信消息</text>
            <view class="textarea-wrapper">
              <u-icon name="chat" size="40rpx" color="#6C7A8F"></u-icon>
              <textarea
                v-model="formData.message"
                placeholder="请输入要发送的私信内容"
                placeholder-class="placeholder"
                :maxlength="200"
                auto-height
              />
            </view>
          </view>

          <!-- 提交按钮 -->
          <view class="submit-btn" @tap="golink">
            <text>开始获客</text>
          </view>
        </view>
      </view>
    </page-header>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";

// // 无障碍插件
// const LinAccessibility = uni.requireNativePlugin('Lin-Accessibility');
// // 通知监听插件
// const LinNotification = uni.requireNativePlugin('Lin-Accessibility-Notification');
// // 悬浮窗插件
// const LinFloatWeb = uni.requireNativePlugin('Lin-Accessibility-Float');

// const generateUrl = (path = '') => {
// 	return 'file://' + plus.io.convertLocalFileSystemURL('_www' + path);
// }

const golink = () => {
  // 	console.log('golink')
  // 	LinFloatWeb.applyPermission(() => {
  //     LinFloatWeb.create(
  //       {
  //         url: generateUrl('/static/float-window.html'),  // 使用url加载HTML文件
  // 		html: '',
  //         width: 200,
  //         height: 130,
  //       }, msg => {
  //         try {
  //         // 解析外层 JSON
  //         if (msg.data && msg.data.wx) {
  //             // 解析内层 wx 字符串
  //             const wxData = JSON.parse(msg.data.wx);
  //             // 判断类型
  //             if (wxData.type === 'start') {
  //                 handleStart();
  //             } else if (wxData.type === 'pause') {
  //                 handlePause();
  //             } else if (wxData.type === 'close') {
  //                 handleClose();
  //             }
  //         }
  //     } catch (error) {
  //         console.error('解析消息失败:', error);
  //     }
  //       }
  //     );
  //     // 显示悬浮窗
  //     LinFloatWeb.show();
  //   });
};

const handleStart = () => {
  // 	console.log('handleStart')
  // 	LinAccessibility.start(
  //     {
  //         packageNames: ['com.tencent.mm', 'com.example.app2'],
  //         notificationTimeout: 20,
  //         monitorAllEvent: true,
  //     },
  //     response => {
  // 		LinAccessibility.getAllNodes(nodes => {
  //     console.log('All nodes: ', nodes);
  // });
  //         console.log('response',response);
  // 	if(response.event_code ==32) {
  // 		LinAccessibility.clickFirstNodeByText('添加朋友');
  // 	}
  //     }
  // );
};

// console.log('golink')
// console.log(LinAccessibility.getServiceState()); // true 或 false
// LinAccessibility.goAliveSetting(); // 跳转到设置

const formData = ref({
  keywords: "",
  filterWords: [],
  blockWords: "",
  targetCount: "",
  message: "",
});

// 监听筛选词更新事件
onMounted(() => {
  uni.$on("updateFilterWords", (words) => {
    formData.value.filterWords = words;
  });
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  uni.$off("updateFilterWords");
});

const navigateToFilterWords = () => {
  uni.navigateTo({
    url: "/pages/douyin/filter-words",
    events: {
      updateFilterWords: function (words) {
        formData.value.filterWords = words;
      },
    },
    success: function (res) {
      res.eventChannel.emit("acceptSelectedWords", {
        selectedWords: formData.value.filterWords,
      });
    },
  });
};

const handleSubmit = () => {
  // 表单验证
  if (!formData.value.keywords.trim()) {
    uni.showToast({
      title: "请输入搜索关键词",
      icon: "none",
    });
    return;
  }

  if (!formData.value.filterWords.length) {
    uni.showToast({
      title: "请选择筛选词",
      icon: "none",
    });
    return;
  }

  if (!formData.value.targetCount) {
    uni.showToast({
      title: "请输入获客数量",
      icon: "none",
    });
    return;
  }

  if (!formData.value.message.trim()) {
    uni.showToast({
      title: "请输入私信内容",
      icon: "none",
    });
    return;
  }

  // TODO: 处理表单提交
  console.log("提交的数据：", formData.value);
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8faff 0%, #e3f2fd 100%);
}

.header-section {
  padding: 60rpx 40rpx;

  .title-wrapper {
    text-align: center;

    .title {
      font-size: 48rpx;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 8rpx;
      display: block;
    }

    .title-en {
      font-size: 20rpx;
      color: #78909c;
      letter-spacing: 8rpx;
      text-transform: uppercase;
      display: block;
      margin-bottom: 16rpx;
    }

    .title-decoration {
      position: relative;
      height: 2px;
      width: 120rpx;
      margin: 0 auto;

      .line {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          to right,
          transparent,
          #1976d2,
          transparent
        );
      }

      .dot {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 8rpx;
        height: 8rpx;
        background: #1976d2;
        border-radius: 50%;
        box-shadow: 0 0 10rpx rgba(25, 118, 210, 0.3);
      }
    }
  }
}

.form-section {
  padding: 0 40rpx;

  .form-box {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .form-item {
      margin-bottom: 30rpx;

      .label {
        font-size: 28rpx;
        color: #37474f;
        margin-bottom: 16rpx;
        display: block;
        font-weight: 500;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: 20rpx;
        background: #f5f9ff;
        height: 88rpx;
        border-radius: 16rpx;
        padding: 0 30rpx;

        input {
          flex: 1;
          height: 100%;
          font-size: 28rpx;
          color: #37474f;
        }

        .placeholder {
          color: #78909c;
        }
      }
    }

    .submit-btn {
      height: 88rpx;
      background: #1976d2;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40rpx;
      transition: all 0.3s ease;

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

    .message-item {
      .textarea-wrapper {
        display: flex;
        gap: 20rpx;
        background: #f5f9ff;
        min-height: 160rpx;
        border-radius: 16rpx;
        padding: 20rpx 30rpx;
        align-items: flex-start;

        textarea {
          flex: 1;
          font-size: 28rpx;
          color: #37474f;
          padding: 6rpx 0;
          min-height: 120rpx;
          width: 100%;
        }

        .placeholder {
          color: #78909c;
        }
      }
    }
  }
}

.selected-words {
  flex: 1;
  font-size: 28rpx;
  color: #37474f;

  &.placeholder {
    color: #78909c;
  }
}
</style> 