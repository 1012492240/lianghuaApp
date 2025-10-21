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
        <view class="nav-title"> 抖音回复 </view>
        <!-- 右侧按钮 -->
        <view class="nav-right"></view>
      </view>
    </view>

    <page-header>
      <!-- <view class="header-section">
        <view class="title-wrapper">
          <text class="title">评论获客</text>
          <text class="title-en">COMMENT LEADS</text>
          <view class="title-decoration">
            <view class="line"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view> -->

      <view class="form-section">
        <view class="form-box">
          <!-- 提示词模板 -->
          <view class="form-item">
            <view class="label">
              提示词模板
              <text class="label-tips">(点击选择预设模板)</text>
            </view>
            <view class="template-grid">
              <view
                v-for="(template, index) in promptTemplates"
                :key="index"
                class="template-item"
                :class="{ active: selectedTemplate === index }"
                @tap="selectTemplate(index)"
              >
                <text class="template-title">{{ template.title }}</text>
                <text class="template-desc">{{ template.desc }}</text>
              </view>
            </view>
          </view>

          <!-- 行业输入框，仅在选择自定义回复时显示 -->
          <view class="form-item" v-if="selectedTemplate === 0">
            <view class="label">
              行业信息
              <text class="label-tips">(请输入您的行业)</text>
            </view>
            <view class="input-wrapper">
              <input
                type="text"
                v-model="formData.industry"
                placeholder="请输入行业名称"
                placeholder-class="placeholder"
              />
            </view>
          </view>

          <!-- 大模型提示词 -->
          <view class="form-item">
            <view class="label">
              大模型提示词
              <text class="label-tips">(引导大模型输出特定类型的回复)</text>
            </view>
            <view class="input-wrapper message-content">
              <textarea
                v-model="formData.prompt_keywords"
                placeholder="请输入提示词，告诉AI如何回复评论"
                placeholder-class="placeholder"
                auto-height
			    maxlength="1000"
              />
            </view>
          </view>

          <view class="submit-btn">
            <view class="btn-inner" @tap="handleSubmit">
              <text>开始获客</text>
            </view>
          </view>
        </view>
      </view>
    </page-header>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import { api, responseHandler } from "@/api";

const formData = ref({
  industry: "",
  prompt_keywords: "",
});

// 添加折叠面板的激活值
const activeCollapse = ref(["1"]); // 默认展开

// 获取状态栏高度
const statusBarHeight = ref(0);

// 时间选项

// 显示时间选择器
const showTimePicker = ref(false);

// 提示词模板
const promptTemplates = [
  {
    title: "自定义回复",
    desc: "自定义行业和提示词",
    content: "",
    industry: "",
    isCustom: true,
  },
  {
    title: "电商客服",
    desc: "适用于电商行业",
    content: `你是一个专业的电商客服，需要遵循以下规则回复用户评论：
1. 使用亲切友好的语气，称呼要自然
2. 对用户的问题表示理解和重视
3. 如果评论提到商品，要突出商品核心卖点和优惠信息
4. 如果是差评或投诉，要真诚道歉并给出解决方案
5. 适当使用emoji表情，增加亲和力
6. 在合适时机引导私信咨询
7. 回复要简短自然，限制在50字以内`,
    industry: "电商",
  },
  {
    title: "教育咨询",
    desc: "适用于教育培训",
    content: `你是一个专业的教育顾问，需要遵循以下规则回复用户评论：
1. 用专业且平易近人的语气回答问题
2. 针对不同学习阶段的问题给出合适建议
3. 强调因材施教和个性化学习的重要性
4. 适当分享成功案例，增强用户信心
5. 回答要突出教育理念和科学的学习方法
6. 对家长的担忧表示理解和共情
7. 适当引导线下交流或体验课
8. 回复要简洁专业，限制在50字以内`,
    industry: "教育培训",
  },
  {
    title: "美妆护肤",
    desc: "适用于美妆行业",
    content: `你是一个专业的美妆顾问，需要遵循以下规则回复用户评论：
1. 用温和专业的语气交流护肤知识
2. 根据用户描述的肤质和问题推荐产品
3. 说明产品成分和功效的科学原理
4. 强调因人而异，建议做皮肤测试
5. 分享正确的使用方法和注意事项
6. 适当科普护肤误区和专业知识
7. 对敏感肌等特殊肤质要特别谨慎
8. 回复要专业易懂，限制在50字以内`,
    industry: "美妆",
  },
  {
    title: "健身教练",
    desc: "适用于健身行业",
    content: `你是一个专业的健身教练，需要遵循以下规则回复用户评论：
1. 用积极鼓励的语气回应用户
2. 根据用户目标给出针对性建议
3. 强调科学训练和循序渐进的重要性
4. 适当提醒运动安全和注意事项
5. 分享健康的饮食和生活方式建议
6. 对初学者要特别耐心和细致
7. 突出专业性，但语气要平易近人
8. 适当分享成功案例，传递正能量
9. 回复要简明有力，限制在50字以内`,
    industry: "健身",
  },
  {
    title: "餐饮服务",
    desc: "适用于餐饮行业",
    content: `你是一个热情的餐饮客服，需要遵循以下规则回复用户评论：
1. 用亲切活泼的语气回应用户
2. 对好评要真诚感谢，表达欢迎再次光临
3. 对差评要诚恳道歉，承诺改进
4. 介绍菜品时要突出特色和口感
5. 适当推荐店内招牌菜和新品
6. 说明食材新鲜度和品质保证
7. 分享美食小知识，增加互动趣味
8. 对食品安全相关问题要认真对待
9. 适当提醒优惠活动和会员福利
10. 回复要生动有趣，限制在50字以内`,
    industry: "餐饮",
  },
];

const selectedTemplate = ref(0);

// 添加一个 ref 来保存接口返回的内容
const savedConfig = ref({
  industry: "",
  prompt_keywords: "",
});

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight;
    },
  });

  // 获取已有配置
  getMsgPromptConfig();

  uni.$on("updateFilterWords", (words) => {
    formData.value.prompt_keywords = words;
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
        formData.value.prompt_keywords = words;
      },
    },
    success: function (res) {
      res.eventChannel.emit("acceptSelectedWords", {
        selectedWords: formData.value.prompt_keywords,
      });
    },
  });
};

const handleSubmit = async () => {
  if (!formData.value.industry.trim()) {
    uni.showToast({
      title: "请输入行业",
      icon: "none",
    });
    return;
  }

  if (!formData.value.prompt_keywords.trim()) {
    uni.showToast({
      title: "请输入提示词",
      icon: "none",
    });
    return;
  }

  try {
    const response = await api.saveMsgPrompt(formData.value);
    const data = await responseHandler.success(response);
    uni.showToast({ title: "配置保存成功", icon: "success" });

    // 保存成功后启动应用
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

// 返回上一页
const onBackClick = () => {
  uni.navigateBack();
};

// 时间选择确认
const onTimeConfirm = (e) => {
  formData.value.comment_time_range = e.value[0];
  showTimePicker.value = false;
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

// 获取提示词配置
const getMsgPromptConfig = async () => {
  try {
    const response = await api.getMsgPrompt();
    const data = await responseHandler.success(response);

    if (data && data.length > 0) {
      const config = data[0];

      // 保存接口返回的配置
      savedConfig.value = {
        industry: config.industry || "",
        prompt_keywords: config.prompt_keywords || "",
      };

      // 更新表单数据
      formData.value = {
        industry: savedConfig.value.industry,
        prompt_keywords: savedConfig.value.prompt_keywords,
      };

      // 如果有已保存的配置，查找匹配的模板
      // const templateIndex = promptTemplates.findIndex(
      //   (template) =>
      //     !template.isCustom &&
      //     template.industry === config.industry &&
      //     template.content === config.prompt_keywords
      // );

      // 如果找到匹配的预设模板才切换，否则保持在自定义模板
      // if (templateIndex !== -1) {
      //   selectedTemplate.value = templateIndex;
      // }
      // 如果没找到匹配的模板，保持在自定义模板（index = 0）
    }
  } catch (error) {
    responseHandler.error(error);
  }
};

// 选择模板
const selectTemplate = (index) => {
  selectedTemplate.value = index;
  const template = promptTemplates[index];

  if (template.isCustom) {
    // 如果是自定义模板，使用保存的配置
    formData.value.prompt_keywords = savedConfig.value.prompt_keywords;
    formData.value.industry = savedConfig.value.industry;
  } else {
    // 如果是预设模板，使用模板内容
    formData.value.prompt_keywords = template.content;
    formData.value.industry = template.industry;
  }
};
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

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;

  .template-item {
    background: #f5f9ff;
    border-radius: 16rpx;
    padding: 24rpx;
    transition: all 0.3s ease;
    border: 2rpx solid transparent;
    cursor: pointer;

    &.active {
      background: #e3f2fd;
      border-color: #1976d2;

      .template-title {
        color: #1976d2;
      }
    }

    .template-title {
      font-size: 28rpx;
      color: #37474f;
      font-weight: 500;
      margin-bottom: 8rpx;
      display: block;
    }

    .template-desc {
      font-size: 24rpx;
      color: #78909c;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style> 