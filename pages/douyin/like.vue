<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 10 + 'px' }">
      <view class="nav-content">
        <!-- 左侧返回按钮 -->
        <view class="nav-left" @click="onBackClick">
          <u-icon name="arrow-left" size="20" color="#333333"></u-icon>
        </view>
        <!-- 居中标题 -->
        <view class="nav-title"> 点赞获客 </view>
        <!-- 右侧按钮 -->
        <view class="nav-right"></view>
      </view>
    </view>

    <page-header>
      <view class="form-section">
        <view class="form-box">
          <!-- 视频搜索关键词 -->
          <view class="form-item">
            <text class="label">您的获客行业</text>
            <view class="input-wrapper">
              <input
                type="text"
                v-model="formData.industry"
                placeholder="请输入您的获客行业"
                placeholder-class="placeholder"
            @blur="handleIndustryBlur"
              />
            </view>
          </view>

          <!-- 评论筛选词 -->
          <view class="form-item">
            <view class="label">评论筛选词</view>
            <view class="input-wrapper">
              <textarea
                @blur="handleKeywordsBlur"
                maxlength="-1"
                v-model="formData.comment_keywords"
                placeholder="请输入评论筛选词，多个词用逗号分隔"
                placeholder-class="placeholder"
                auto-height
                :disabled="formData.settings.like_all_comments"
                :style="{
                  opacity: formData.settings.like_all_comments ? 0.5 : 1,
                }"
              />
            </view>
          </view>

          <!-- 评论屏蔽词 -->
          <view class="form-item">
            <view class="label">评论屏蔽词</view>
            <view class="input-wrapper">
              <textarea
                @blur="handleFilterwordsBlur"
                maxlength="-1"
                v-model="formData.exclude_words"
                placeholder="请输入评论屏蔽词，多个词用逗号分隔"
                placeholder-class="placeholder"
                auto-height
                :disabled="formData.settings.like_all_comments"
                :style="{
                  opacity: formData.settings.like_all_comments ? 0.5 : 1,
                }"
              />
            </view>
          </view>

          <!-- 修改点赞数量输入框 -->
          <view class="form-item">
            <view class="label">请输入点赞数量</view>
            <view class="input-wrapper">
              <textarea
                maxlength="-1"
                v-model="formData.like_count"
                placeholder="请输入点赞数量"
                placeholder-class="placeholder"
                auto-height
                :disabled="formData.settings.no_limit"
                :style="{ opacity: formData.settings.no_limit ? 0.5 : 1 }"
              />
            </view>
          </view>

          <!-- 个性化设置 移到这里 -->
          <view class="form-item">
            <up-collapse>
              <up-collapse-item title="个性化设置" name="1">
                <view class="settings-content">
                  <!-- <view class="setting-item">
                    <view class="setting-label">
                      <text>点赞所有评论</text>
                      <text class="setting-desc"
                        >开启此按钮，给所有评论点赞</text
                      >
                    </view>
                    <u-switch
                      v-model="formData.settings.like_all_comments"
                      size="20"
                      activeColor="#1976d2"
                    ></u-switch>
                  </view> -->

                  <view class="setting-item">
                    <view class="setting-label">
                      <text>无数量上限</text>
                      <text class="setting-desc"
                        >开启此按钮后，软件将会一直运行</text
                      >
                    </view>
                    <u-switch
                      v-model="formData.settings.no_limit"
                      size="20"
                      activeColor="#1976d2"
                    ></u-switch>
                  </view>

                  <view class="setting-item">
                    <view class="setting-label">
                      <text>点赞时间间隔</text>
                      <text class="setting-desc">在该时间内随机执行</text>
                    </view>

                    <view
                      style="
                        display: flex;
                        align-items: center;
                        gap: 10rpx;
                        width: 250rpx;
                        justify-content: space-between;
                      "
                    >
                      <up-input
                        type="number"
                        placeholder=""
                        border="surround"
                        v-model="formData.like_intervalFirst"
                        customStyle="width: 10rpx;"
                        @change="change"
                      ></up-input>
                      ~
                      <up-input
                        type="number"
                        placeholder=""
                        border="surround"
                        v-model="formData.like_intervalLast"
                        customStyle="width: 10rpx;"
                        @change="change"
                      ></up-input>
                      秒
                    </view>
                  </view>

                  <!-- 修改评论时间选择的布局 -->
                  <view class="setting-item time-setting">
                    <view class="setting-label">
                      <text>发布评论时间</text>
                      <text class="setting-desc"
                        >用户在抖音视频发送评论的时间</text
                      >
                    </view>
                    <view class="time-radio-group">
                      <view
                        class="time-radio"
                        v-for="(item, index) in timeOptions"
                        :key="index"
                        :class="{
                          active:
                            formData.settings.comment_time_range === item.value,
                        }"
                        @click="
                          formData.settings.comment_time_range = item.value
                        "
                      >
                        <text>{{ item.label }}</text>
                      </view>
                    </view>
                  </view>

                  <!-- 地区筛选 -->
                  <view class="setting-item time-setting">
                    <view class="setting-label">
                      <text>地区筛选</text>
                      <text class="setting-desc"
                        >选择需要筛选的省份地区（未选择则默认全选）</text
                      >
                    </view>

                    <view class="region-select">
                      <view
                        class="region-display"
                        :class="{ 'has-regions': formData.regions }"
                        @tap="navigateToRegions"
                      >
                        <text>{{ formData.regions || "请选择地区" }}</text>
                        <u-icon
                          name="arrow-right"
                          size="32rpx"
                          color="#6C7A8F"
                        ></u-icon>
                      </view>
                    </view>
                  </view>
                </view>
              </up-collapse-item>
            </up-collapse>
          </view>

          <!-- 提交按钮 -->
          <view class="submit-btn">
            <view class="btn-inner" @click="handleSubmit">
              <text>开始获客</text>
            </view>
          </view>
        </view>
      </view>
    </page-header>
  </view>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import { api, responseHandler } from "@/api";

const formData = ref({
  keywords: "",
  industry: "",
  comment_keywords: "",
  exclude_words: "",
  like_count: "",
  regions: "",
  settings: {
    like_all_comments: false,
    no_limit: false,
    only_visit_no_like: "0",
    like_interval: "1,3",
    comment_time_range: "0",
  },
  like_interval: "1,3",
  like_intervalFirst: 1,
  like_intervalLast: 3,
});

// 添加折叠面板的激活值
const activeCollapse = ref(["1"]); // 默认展开

// 获取状态栏高度
const statusBarHeight = ref(0);

// 时间选项
const timeOptions = [
  { label: "不限时间", value: "0" },
  { label: "一天内", value: "1" },
  { label: "三天内", value: "3" },
  { label: "一周内", value: "7" },
  { label: "半个月内", value: "15" },
  { label: "一个月内", value: "30" },
  { label: "三个月内", value: "90" },
  { label: "半年内", value: "180" },
  { label: "一年内", value: "360" },
];

// 显示时间选择器
const showTimePicker = ref(false);

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight;
    },
  });

  // 获取已有配置
  getLikeConfig();

  uni.$on("updateFilterWords", (words) => {
    formData.value.comment_keywords = words;
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
        formData.value.comment_keywords = words;
      },
    },
    success: function (res) {
      res.eventChannel.emit("acceptSelectedWords", {
        selectedWords: formData.value.comment_keywords,
      });
    },
  });
};

// 跳转到地区选择页面
const navigateToRegions = () => {
  uni.navigateTo({
    url: "/pages/douyin/regions",
    events: {
      // 接收选中的地区数据
      updateRegions: function (regions) {
        formData.value.regions = regions;
      },
    },
    success: function (res) {
      // 传递已选中的地区到地区选择页面
      res.eventChannel.emit("acceptSelectedRegions", {
        selectedRegions: formData.value.regions,
      });
    },
  });
};

function normalizeKeywords(input) {
  if (!input) return "";

  let text = input;

  // 去除所有空格（包括全角、半角空格）
  text = text.replace(/\s+/g, "");

  // 替换中文逗号为英文逗号
  text = text.replace(/，/g, ",");

  // 将除英文逗号外的所有非中英文字符都替换为英文逗号
  text = text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5,]/g, ",");

  // 合并连续多个逗号为一个
  text = text.replace(/,+/g, ",");

  // 去除首尾逗号
  text = text.replace(/^,|,$/g, "");

  return text;
}
function handleKeywordsBlur() {
  let text = normalizeKeywords(formData.value.comment_keywords);
  formData.value.comment_keywords = text;
}

function handleIndustryBlur() {
  let text = normalizeKeywords(formData.value.industry);
  formData.value.industry = text;
}

function handleFilterwordsBlur() {
  let text = normalizeKeywords(formData.value.exclude_words);
  formData.value.exclude_words = text;
}

const handleSubmit = async () => {
  // 表单验证
  if (!formData.value.industry.trim()) {
    uni.showToast({
      title: "请输入获客行业",
      icon: "none",
    });
    return;
  }

  if (
    !formData.value.comment_keywords.trim() &&
    !formData.value.settings.like_all_comments
  ) {
    uni.showToast({
      title: "请输入评论筛选词",
      icon: "none",
    });
    return;
  }

  if (!formData.value.like_count && !formData.value.settings.no_limit) {
    uni.showToast({
      title: "请输入点赞数量",
      icon: "none",
    });
    return;
  }

  // 构建提交数据
  const submitData = {
    industry: formData.value.industry,
    comment_keywords: formData.value.comment_keywords,
    exclude_words: formData.value.exclude_words,
    like_count: formData.value.settings.no_limit
      ? 0
      : Number(formData.value.like_count),
    regions: formData.value.regions || "全选",
    like_all_comments: formData.value.settings.like_all_comments ? 1 : 0,
    no_limit: formData.value.settings.no_limit ? 1 : 0,
    comment_time_range: formData.value.settings.comment_time_range,
    like_interval:
      formData.value.like_intervalFirst +
      "," +
      formData.value.like_intervalLast,
  };

  try {
    const response = await api.saveLikeConfig(submitData);
    const data = await responseHandler.success(response);

    uni.showToast({ title: "配置保存成功", icon: "success" });
    plus.runtime.launchApplication(
      {
        pname: "com.ingru.comboost.ai_marketing",
      },
      function (e) {
        plus.runtime.openURL(
          "https://comboost.26sl.com/comboost_download.html",
          (err) => {
            if (err) {
              uni.showToast({
                title: "打开下载页面失败",
                icon: "none",
              });
            }
          }
        );
      }
    );
  } catch (error) {
    responseHandler.error(error);
  }
};

// 如果需要获取配置
const getLikeConfig = async () => {
  try {
    const response = await api.getLikeConfig();
    const data = await responseHandler.success(response);

    if (data && data.length > 0) {
      const config = data[0];

      // 更新表单数据
      formData.value = {
        ...formData.value,
        industry: config.industry || "",
        comment_keywords: config.comment_keywords || "",
        exclude_words: config.exclude_words || "",
        like_count: config.like_count || "",
        regions: config.regions || "",
        settings: {
          like_all_comments: config.like_all_comments === "1",
          no_limit: config.no_limit === "1",
          only_visit_no_like: config.only_visit_no_like || "0",
          comment_time_range: config.comment_time_range || "0",
        },
        like_intervalFirst: Number(config.like_interval?.split(",")[0] || 1),
        like_intervalLast: Number(config.like_interval?.split(",")[1] || 3),
      };
    }
  } catch (error) {
    responseHandler.error(error);
  }
};

// 返回上一页
const onBackClick = () => {
  uni.navigateBack();
};

// 时间选择确认
const onTimeConfirm = (e) => {
  formData.value.settings.comment_time_range = timeOptions[e.value[0]].value;
  showTimePicker.value = false;
};

// 监听无数量上限开关变化
watch(
  () => formData.value.settings.no_limit,
  (newVal) => {
    if (newVal) {
      formData.value.like_count = ""; // 当开启无数量上限时，清空点赞数量
    }
  }
);

// 监听点赞所有评论开关变化
watch(
  () => formData.value.settings.like_all_comments,
  (newVal) => {
    if (newVal) {
      formData.value.comment_keywords = ""; // 清空评论筛选词
      formData.value.exclude_words = ""; // 清空评论屏蔽词
    }
  }
);
</script>
  
<style lang="scss" scoped>
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

.container {
  width: 100%;
  min-height: calc(100vh - (var(--status-bar-height) + 88rpx));
  background: linear-gradient(180deg, #f8faff 0%, #e3f2fd 100%);
  padding-top: calc(var(--status-bar-height) + 88rpx); // 为导航栏预留空间
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
  padding-bottom: 140rpx;
  position: relative;
  z-index: 1;

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
        display: flex;
        align-items: center;
        font-weight: 500;

        .label-tips {
          font-size: 24rpx;
          color: #78909c;
          font-weight: normal;
          margin-left: 12rpx;
        }
      }

      .input-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 20rpx;
        background: #f5f9ff;
        min-height: 88rpx;
        border-radius: 16rpx;
        padding: 0 30rpx;

        input,
        textarea {
          flex: 1;
          padding: 24rpx 0;
          font-size: 28rpx;
          color: #37474f;
        }

        textarea {
          min-height: 40rpx;
          width: 100%;
          height: auto;
        }

        .u-icon {
          margin-top: 24rpx;
        }

        .placeholder {
          color: #78909c;
        }

        // 为私信内容文本框添加特殊样式
        &.message-content {
          min-height: 200rpx;
          align-items: stretch;
          padding: 20rpx 30rpx;

          textarea {
            min-height: 160rpx;
            padding: 0;
            line-height: 1.6;
          }
        }

        &:disabled {
          cursor: not-allowed;
          background-color: #f5f5f5;
        }
      }
    }

    .submit-btn {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 998;
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

.settings-content {
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding: 16rpx 0;
    min-height: 108rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .setting-label {
      flex: 1;
      padding-right: 20rpx;

      text {
        display: block;

        &:first-child {
          font-size: 28rpx;
          color: #37474f;
          margin-bottom: 12rpx;
          font-weight: 500;
        }
      }

      .setting-desc {
        font-size: 24rpx;
        color: #78909c;
        line-height: 1.4;
      }
    }

    .time-select {
      width: 100%;

      .selected-time {
        // display: flex;
        // align-items: center;
        // justify-content: space-between;
        width: 100%;
        // padding: 50rpx;
        background: #f5f9ff;
        border-radius: 16rpx;

        text {
          font-size: 28rpx;
          color: #37474f;
        }

        .u-icon {
          margin-left: 28rpx;
        }
      }
    }

    // 添加时间选择特殊样式
    &.time-setting {
      flex-direction: column;
      align-items: flex-start;

      .setting-label {
        margin-bottom: 16rpx;
        padding-right: 0;
      }

      .time-radio-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        padding: 4rpx;

        .time-radio {
          width: calc((100% - 28rpx) / 3);
          height: 64rpx;
          background: #f5f9ff;
          border-radius: 6rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1rpx solid transparent;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;

          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            opacity: 0;
            transition: opacity 0.3s;
          }

          text {
            font-size: 25rpx;
            color: #37474f;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
            white-space: nowrap;
          }

          &.active {
            background: #e3f2fd;
            border-color: #1976d2;

            text {
              color: #1976d2;
              font-weight: 500;
            }
          }

          &:active {
            transform: scale(0.96);

            &::after {
              opacity: 0.05;
            }
          }
        }
      }
    }
  }
}

// 修改折叠面板样式
:deep(.up-collapse-item) {
  .up-collapse-item__title {
    padding: 28rpx 0;
    font-size: 28rpx;
    font-weight: 500;
    color: #37474f;
  }

  .up-collapse-item__content {
    background-color: #fff;
  }

  .up-collapse-item__wrapper {
    padding: 20rpx 0 0;
  }
}

.region-select {
  width: 100%;
  margin-top: 12rpx;

  .region-display {
    height: 64rpx;
    background: #f5f9ff;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    border: 1rpx solid transparent;
    transition: all 0.3s ease;

    text {
      font-size: 25rpx;
      color: #78909c; // 未选择时的颜色
      white-space: nowrap; /* 防止换行 */
      overflow: hidden; /* 隐藏溢出的文本 */
      text-overflow: ellipsis;
    }

    &.has-regions {
      background: #e3f2fd;
      border-color: #1976d2;

      text {
        color: #1976d2;
        font-weight: 500;
      }
    }

    &:active {
      transform: scale(0.96);

      &::after {
        opacity: 0.05;
      }
    }
  }
}
</style> 