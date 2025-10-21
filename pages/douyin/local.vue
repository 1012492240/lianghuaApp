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
        <view class="nav-title"> 同城获客 </view>
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
      <view class="picker-container" v-if="show">
        <up-picker
          :show="show"
          :defaultIndex="defaultCityArray"
          ref="uPickerRef"
          :columns="columns"
          @cancel="cancel"
          @confirm="confirm"
          @change="changeHandler"
        ></up-picker>
      </view>

      <view class="form-section">
        <view class="form-box">
          <!-- 视频搜索关键词 -->

          <view class="form-item">
            <text class="label">同城地区筛选</text>
            <view class="input-wrapper">
              <view class="search-item" @click="showPicker">
                <view class="input-box">
                  <text class="input-box-text" v-if="realRegion.province">
                    {{ realRegion.province }}-{{ realRegion.city }}-{{
                      realRegion.district
                    }}
                  </text>
                  <text class="input-box-text" style="color: #999" v-else>
                    请选择省市区
                  </text>
                </view>
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="label">获客行业</text>
            <view class="input-wrapper">
              <input
                type="text"
                v-model="formData.industry"
                placeholder="请输入获客行业"
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
                v-model="formData.comment_keywords"
                placeholder="请输入评论筛选词，多个词用逗号分隔"
                placeholder-class="placeholder"
                auto-height
                maxlength="-1"
                @blur="handleKeywordsBlur"
              />
            </view>
          </view>

          <!-- 评论屏蔽词 -->
          <view class="form-item">
            <view class="label">评论屏蔽词</view>
            <view class="input-wrapper">
              <textarea
                v-model="formData.exclude_words"
                placeholder="请输入评论屏蔽词，多个词用逗号分隔"
                placeholder-class="placeholder"
                auto-height
                maxlength="-1"
                @blur="handleFilterwordsBlur"
              />
            </view>
          </view>

          <!-- 获取用户数量 -->
          <view class="form-item">
            <view class="label">获取用户数量</view>
            <view class="input-wrapper">
              <input
                type="number"
                v-model="formData.user_count"
                placeholder="请输入需要获取的用户数量"
                placeholder-class="placeholder"
              />
            </view>
          </view>

          <!-- 私信内容 -->
          <view class="form-item">
            <view class="label">
              私信内容
              <text class="label-tips">(若未填写内容则用AI生成私聊信息)</text>
            </view>
            <view class="input-wrapper message-content">
              <textarea
                v-model="formData.private_message"
                placeholder="请输入私信内容"
                placeholder-class="placeholder"
                auto-height
                maxlength="-1"
              />
            </view>
          </view>

          <!-- 个性化设置 移到这里 -->
          <view class="form-item">
            <up-collapse>
              <up-collapse-item title="个性化设置" name="1">
                <view class="settings-content">
                  <view class="setting-item">
                    <view class="setting-label">
                      <text>只私信不关注</text>
                      <text class="setting-desc"
                        >开启后将只发送私信不关注用户</text
                      >
                    </view>
                    <u-switch
                      v-model="formData.private_message_only"
                      size="20"
                      activeColor="#1976d2"
                    ></u-switch>
                  </view>

                  <!-- <view class="setting-item">
                    <view class="setting-label">
                      <text>精准搜索</text>
                      <text class="setting-desc"
                        >开启此按钮后，将跳过视频说明中无行业词的视频</text
                      >
                    </view>
                    <u-switch
                      v-model="formData.precise_search"
                      size="20"
                      activeColor="#1976d2"
                    ></u-switch>
                  </view> -->
                  <view class="setting-item">
                    <view class="setting-label">
                      <text>发送私信时间间隔</text>
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
                        v-model="formData.private_message_intervalFirst"
                        customStyle="width: 10rpx;"
                        @change="change"
                      ></up-input>
                      ~
                      <up-input
                        type="number"
                        placeholder=""
                        border="surround"
                        v-model="formData.private_message_intervalLast"
                        customStyle="width: 10rpx;"
                        @change="change"
                      ></up-input>
                      秒
                    </view>
                  </view>

                  <!-- 修改评论时间选择的布局 -->
                  <view class="setting-item time-setting">
                    <view class="setting-label">
                      <text>获取评论时间</text>
                      <text class="setting-desc"
                        >选择需要获取的评论时间范围</text
                      >
                    </view>
                    <view class="time-radio-group">
                      <view
                        class="time-radio"
                        v-for="(item, index) in timeOptions"
                        :key="index"
                        :class="{
                          active: formData.comment_time_range === item.value,
                        }"
                        @click="formData.comment_time_range = item.value"
                      >
                        <text>{{ item.label }}</text>
                      </view>
                    </view>
                  </view>

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
import { ref, onMounted, onUnmounted, reactive } from "vue";
import PageHeader from "@/components/page-header/page-header.vue";
import { api, responseHandler } from "@/api";
import { addressList } from "../task/cityData.js";

const regionData = addressList;
const formData = ref({
  industry: "",
  comment_keywords: "",
  private_message: "",
  regions: "全选",
  disable_industry_option: 0,
  skip_video_author: 0,
  user_count: "",
  private_message_only: 0,
  exclude_words: "",
  comment_time_range: "0",
  precise_search: 0,
  private_message_interval: "1,3",
  private_message_intervalFirst: 1,
  private_message_intervalLast: 3,
});

const show = ref(false);

const showPicker = () => {
  show.value = true;
};

// 添加折叠面板的激活值
const activeCollapse = ref(["1"]); // 默认展开

// 获取状态栏高度
const statusBarHeight = ref(0);
// 添加根据地址获取经纬度的函数
const getLocationByAddress = (address) => {
  uni.showLoading({
    title: "定位中...",
  });

  uni.request({
    url: "https://restapi.amap.com/v3/geocode/geo",
    method: "GET",
    data: {
      key: "7d6f9f3723fc6572aaf13328ba8a504e",
      address: address,
      city: realRegion.city,
    },
    success: (res) => {
      uni.hideLoading();
      if (
        res.data.status === "1" &&
        res.data.geocodes &&
        res.data.geocodes[0]
      ) {
        const location = res.data.geocodes[0].location.split(",");
        const latitude = parseFloat(location[1]);
        const longitude = parseFloat(location[0]);

        // 更新地图状态
        mapState.latitude = latitude;
        mapState.longitude = longitude;
        mapState.scale = adjustMapScale(Number(selectedDistance.value));

        // 更新圆形范围
        mapState.circles = [
          {
            latitude: latitude,
            longitude: longitude,
            color: "#1989fa66",
            fillColor: "#1989fa22",
            radius: selectedDistance.value * 1000,
            strokeWidth: 2,
          },
        ];

        // 更新标记点
        mapState.markers = [
          {
            id: 0,
            latitude: latitude,
            longitude: longitude,
            iconPath: "/static/local.png",
            // #ifdef APP-PLUS
            anchor: {
              x: 0.5,
              y: 0.5,
            },
            width: "20px",
            height: "20px",
            // #endif
            // #ifdef H5
            width: 20,
            height: 20,
            // #endif
            callout: {
              content: address,
              color: "#000000",
              fontSize: 14,
              borderRadius: 4,
              padding: 8,
              display: "ALWAYS",
            },
          },
        ];

        // 更新当前地址
        currentAddress.value = address;
      } else {
        uni.showToast({
          title: "获取位置失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      uni.hideLoading();
      console.error("获取位置失败:", err);
      uni.showToast({
        title: "获取位置失败",
        icon: "none",
      });
    },
  });
};

// 用来存储选择的数据
const selectedRegion = reactive({
  province: null,
  city: null,
  cityCode: null,
  district: null,
  districtCode: null,
  provinceIndex: null,
  provinceCode: null,
  cityIndex: null,
  districtIndex: null,
});

const realRegion = reactive({
  province: null,
  city: null,
  cityCode: null,
  district: null,
  districtCode: null,
  provinceIndex: null,
  provinceCode: null,
  cityIndex: null,
  districtIndex: null,
});

// 处理确认选择的逻辑
const confirm = (e) => {
  defaultCityArray.value = [
    selectedRegion.provinceIndex,
    selectedRegion.cityIndex,
    selectedRegion.districtIndex,
  ];

  realRegion.province = selectedRegion.province;
  realRegion.city = selectedRegion.city;
  realRegion.district = selectedRegion.district;
  realRegion.provinceCode = selectedRegion.provinceCode;
  realRegion.cityCode = selectedRegion.cityCode;
  realRegion.districtCode = selectedRegion.districtCode;
  realRegion.provinceIndex = selectedRegion.provinceIndex;
  realRegion.cityIndex = selectedRegion.cityIndex;
  realRegion.districtIndex = selectedRegion.districtIndex;

  // 获取选中地区的经纬度
  const address = `${realRegion.province}${realRegion.city}${realRegion.district}`;
  getLocationByAddress(address);

  show.value = false;
};

// 填充省级数据
const fillProvinceData = () => {
  columns[0] = regionData.map((item) => item.name);
};

// 填充市级数据
const fillCityData = (provinceIndex) => {
  const province = regionData[provinceIndex];
  columns[1] = province.children.map((item) => item.name);
  console.log(columns[1], "province");
};

// 填充区级数据
const fillDistrictData = (provinceIndex, cityIndex) => {
  const city = regionData[provinceIndex].children[cityIndex];
  columns[2] = city.children.map((item) => item.name);
};
// 更新 selectedRegion 的值
const updateSelectedRegion = (provinceIndex, cityIndex, districtIndex) => {
  const province = regionData[provinceIndex];
  const city = province.children[cityIndex];
  const district = city.children[districtIndex];
  selectedRegion.province = province.name;
  selectedRegion.provinceCode = province.code;
  selectedRegion.city = city.name;
  selectedRegion.cityCode = city.code;
  selectedRegion.district = district ? district.name : null;
  selectedRegion.districtCode = district ? district.code : null;
  selectedRegion.provinceIndex = provinceIndex;
  selectedRegion.cityIndex = cityIndex;
  selectedRegion.districtIndex = districtIndex;
};
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
const defaultCityArray = ref([]);
const columns = reactive([[], [], []]);

// 初始化时填充省级数据并选择默认项
const initializePicker = () => {
  fillProvinceData();
  // 默认选择第一个省
  const defaultProvinceIndex = 0;
  const defaultCityIndex = 0;
  const defaultDistrictIndex = 0;

  const defaultIndustryIndex = 0;

  // 填充市级数据
  fillCityData(defaultProvinceIndex);

  // 填充区级数据
  fillDistrictData(defaultProvinceIndex, defaultCityIndex);

  // 更新 selectedRegion
  updateSelectedRegion(
    defaultProvinceIndex,
    defaultCityIndex,
    defaultDistrictIndex
  );

  defaultCityArray.value = [0, 0, 0];
};

// 监听省市区选择的变化
const changeHandler = (e) => {
  const { columnIndex, index } = e;

  console.log(columnIndex, index, "111");
  if (columnIndex === 0) {
    // 更新市和区
    fillCityData(index);
    fillDistrictData(index, 0); // 默认选择市的第一个区
    updateSelectedRegion(index, 0, 0);
  } else if (columnIndex === 1) {
    // 更新区
    fillDistrictData(selectedRegion.provinceIndex, index);
    updateSelectedRegion(selectedRegion.provinceIndex, index, 0);
  } else if (columnIndex === 2) {
    // 更新区选择
    updateSelectedRegion(
      selectedRegion.provinceIndex,
      selectedRegion.cityIndex,
      index
    );
  }
};

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight;
    },
  });

  // 获取已有配置
  getSameCityConfig();

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
  if (!realRegion.province) {
    uni.showToast({
      title: "请选择同城地区",
      icon: "none",
    });
    return;
  }
  // 表单验证
  if (!formData.value.industry.trim()) {
    uni.showToast({
      title: "请输入获客行业",
      icon: "none",
    });
    return;
  }

  if (!formData.value.comment_keywords.trim()) {
    uni.showToast({
      title: "请输入评论筛选词",
      icon: "none",
    });
    return;
  }

  if (!formData.value.user_count) {
    uni.showToast({
      title: "请输入获取用户数量",
      icon: "none",
    });
    return;
  }

  console.log(
    formData.value.private_message_only,
    "formData.value.private_message_only"
  );

  // 构建提交数据
  const submitData = {
    same_city_area: `${realRegion.province}-${realRegion.city}-${realRegion.district}`,
    industry: formData.value.industry,
    comment_keywords: formData.value.comment_keywords,
    private_message: formData.value.private_message,
    private_message_interval: formData.value.private_message_interval,
    regions: formData.value.regions || "全选",
    disable_industry_option: formData.value.disable_industry_option,
    skip_video_author: formData.value.skip_video_author,
    user_count: Number(formData.value.user_count),
    private_message_only: formData.value.private_message_only ? 1 : 0,
    exclude_words: formData.value.exclude_words,
    comment_time_range: formData.value.comment_time_range,
    precise_search: formData.value.precise_search ? 0 : 1,
    private_message_interval:
      formData.value.private_message_intervalFirst +
      "," +
      formData.value.private_message_intervalLast,
  };

  try {
    const response = await api.saveSameCityConfig(submitData);
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

// 获取评论配置
const getSameCityConfig = async () => {
  try {
    const response = await api.getSameCityConfig();
    const data = await responseHandler.success(response);

    if (data && data.length > 0) {
      const config = data[0];

      console.log(config.private_message_only, "config.private_message_only");

      realRegion.province = config.same_city_area.split("-")[0];
      realRegion.city = config.same_city_area.split("-")[1];
      realRegion.district = config.same_city_area.split("-")[2];
      // 更新表单数据
      formData.value = {
        ...formData.value,
        industry: config.industry || "",
        comment_keywords: config.comment_keywords || "",
        private_message: config.private_message || "",
        regions: config.regions || "",
        exclude_words: config.exclude_words || "",
        user_count: config.user_count || "",
        private_message_only: config.private_message_only === "1",
        precise_search: config.precise_search === "1",
        comment_time_range: config.comment_time_range || "0",
        private_message_intervalFirst: Number(
          config.private_message_interval?.split(",")[0] || 1
        ),
        private_message_intervalLast: Number(
          config.private_message_interval?.split(",")[1] || 3
        ),
      };
    }
  } catch (error) {
    responseHandler.error(error);
  }
};

const cancel = () => {
  show.value = false;
};
// 初始化选择器
initializePicker();
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

.search-item {
  //   background: red;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #333333;
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
</style> 