<template>
  <view class="container">
    <!-- 固定的自定义导航栏 -->
    <view
      class="nav-bar fixed"
      :style="{ paddingTop: statusBarHeight + 25 + 'px' }"
    >
      <view class="nav-content">
        <!-- 左侧返回按钮 -->
        <view class="nav-left" @click="onBackClick">
          <u-icon name="arrow-left" size="20" color="#333333"></u-icon>
        </view>
        <!-- 居中标题 -->
        <text class="nav-title">详细列表</text>
        <!-- 右侧占位，保持标题居中 -->
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 主内容区域，增加顶部间距 -->
    <view
      class="main-content"
      :style="{ paddingTop: statusBarHeight + 54 + 'px' }"
    >
      <view class="stats-card">
        <view class="stats-header">
          <text class="stats-title">数据采集结果</text>
          <text class="stats-count">共{{ collectedItems.length }}条</text>
        </view>
        <view class="stats-content">
          <view class="stats-row">
            <text class="stats-label">关键词：</text>
            <text class="stats-value">{{ keyword||industryName }}</text>
          </view>
          <view class="stats-row" v-if="industryName">
            <text class="stats-label">行业信息：</text>
            <text class="stats-value">{{ industryName }}</text>
          </view>
          <view class="stats-row">
            <text class="stats-label">采集地址：</text>
            <text class="stats-value">{{ collectInfo }}</text>
          </view>
          <view class="stats-row">
            <text class="stats-label">采集时间：</text>
            <text class="stats-value">{{ collectTime }}</text>
          </view>
          <!-- <view class="stats-row" v-if="currentWechatAccount">
            <text class="stats-label">账号类型：</text>
            <text class="stats-value">{{ currentWechatAccount.accountType === 'new' ? '新号' : '老号' }}</text>
          </view> -->
        </view>
      </view>

      <!-- 数据列表 -->
      <view class="list-container">
        <view
          class="list-item"
          v-for="(item, index) in currentPageData"
          :key="item.id"
          :class="{ 'selection-mode': isSelectionMode }"
          @tap="handleItemClick(item)"
        >
        
          <!-- 选择框 -->
          <view v-if="isSelectionMode && isValidPhone(item.tel)" class="checkbox-wrapper">
            <view class="checkbox" :class="{ 'checked': isItemSelected(item) }">
              <u-icon v-if="isItemSelected(item)" name="checkmark" color="#FFFFFF" size="12"></u-icon>
            </view>
          </view>
          <!-- 第一行：头像、电话和操作按钮 -->
          <view class="item-header">
            <view class="header-left">
              <view class="item-avatar" @tap="previewImage(item.photos)">
                <image :src="item.photos" mode="aspectFill"></image>
              </view>

              <text class="item-tel">{{ formatPhoneNumber(item.tel) }}</text>
            </view>
            <view class="header-actions">
              <view class="action-btn" @tap="openLocation(item)">
                <up-icon name="map" size="22" color="#1989FA"></up-icon>
              </view>
              <view class="action-btn" @tap="copyWechat(item)" :style="{ pointerEvents: isValidPhone(item.tel) ? 'auto' : 'none' }">
                <up-icon name="weixin-fill" size="22" :color="isValidPhone(item.tel) ? '#1989FA' : '#CCCCCC'"></up-icon>
              </view>
              <view class="action-btn" @tap="makePhoneCall(item)">
                <up-icon name="phone" size="22" :color="item.tel.length !== 0? '#1989FA' : '#CCCCCC'"></up-icon>
              </view>
            </view>
          </view>

          <!-- 第二行：名称和类型 -->
          <view class="item-name-row">
            <view class="item-name">{{ item.name }}</view>
            <view class="item-type">{{ item.type }}</view>
          </view>

          <!-- 第三行：地址 -->
          <text class="item-address">{{ item.address }}</text>
        </view>
      </view>

      <!-- 分页控制组件 -->
      <view class="pagination">
        <view class="pagination-btn" :class="{ disabled: currentPage === 1 }" @tap="prevPage">
          <text class="btn-text">上一页</text>
        </view>
        <view class="pagination-info">
          <text class="page-text">{{ currentPage }}/{{ totalPages }}</text>
        </view>
        <view class="pagination-btn" :class="{ disabled: currentPage === totalPages }" @tap="nextPage">
          <text class="btn-text">下一页</text>
        </view>
      </view>

      <!-- 底部固定按钮区域 -->
      <view class="bottom-buttons">
       
        <view v-if="isSelectionMode" class="bottom-btn cancel-btn" @tap="cancelSelection">
          <text class="btn-text">取消</text>
        </view>
        <view v-if="isSelectionMode" class="bottom-btn select-all-btn" @tap="toggleSelectAll">
          <text class="btn-text">{{ isAllSelected ? '取消全选' : '全选当前页' }}</text>
        </view>
      
        <view class="bottom-btn add-btn" @tap="batchAddWechat">
          <u-icon name="weixin-fill" size="20" color="#FFFFFF"></u-icon>
          <text class="btn-text">{{ isSelectionMode ? `添加${selectedItems.length}条` : '设置添加账号' }}</text>
        </view>
        <view v-if="!isSelectionMode" class="bottom-btn message-btn" @tap="showMessageSettings">
          <u-icon name="chat" size="20" color="#FFFFFF"></u-icon>
          <text class="btn-text">开始添加</text>
        </view>
      </view>

      <!-- 在底部buttons后面添加弹框组件 -->
      <u-modal
          :show="showSecurityModal"
          title="安全提示"
          :content="'为了确保微信账号安全，请确保当前微信登录账号为：' + currentWechatAccount"
          @confirm="gotoWX()"
          @cancel="showSecurityModal = false"
          show-cancel-button
   
        ></u-modal>
      <up-popup
        :show="showPopup"
        @close="showPopup = false"
        mode="center"
        :round="10"
      >
        <view class="message-popup">
          <view class="popup-header">
            <text class="popup-title">设置私信内容</text>
          </view>
          <view class="popup-content">
            <up-textarea
              v-model="messageText"
              placeholder="请输入私信内容"
              :maxlength="50"
              :height="100"
              :border="true"
              count
            ></up-textarea>
          </view>
          <view class="popup-footer">
            <view class="popup-btn cancel" @tap="showPopup = false">取消</view>
            <view class="popup-btn confirm" @tap="confirmMessage">确定</view>
          </view>
        </view>
      </up-popup>

      <!-- 在底部添加 up-modal 组件 -->
      <u-modal
        :show="showDownloadModal"
        title="温馨提示"
        :content="'未找到加客宝APP，是否跳转到下载页面？'"
        @confirm="handleDownloadConfirm"
        @close="showDownloadModal = false"
        @cancel="showDownloadModal = false"
        show-cancel-button
        cancel-text="取消"
        confirm-text="确定"
        title-style="font-size: 18px;font-weight: 500;color: #333;"
        content-style="font-size: 15px;color: #666;padding: 20px 0;"
        :mask-close-able="true"
        width="80%"
      ></u-modal>
      
      <!-- 添加绑定微信账号提示弹框 -->
      <u-modal
        :show="showBindWechatModal"
        title="提示"
        content="请先绑定微信账号"
        @confirm="handleBindWechatConfirm"
        @close="showBindWechatModal = false"
        @cancel="showBindWechatModal = false"
        show-cancel-button
        cancel-text="取消"
        confirm-text="确定"
        title-style="font-size: 18px;font-weight: 500;color: #333;"
        content-style="font-size: 15px;color: #666;padding: 20px 0;"
        :mask-close-able="true"
        width="80%"
      ></u-modal>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch ,} from "vue";
import { api, responseHandler } from "@/api";
import { formatDate } from '@/utils/date'
import { onShow } from '@dcloudio/uni-app'

// 获取状态栏高度
const statusBarHeight = ref(20);
const showSecurityModal = ref(false)

// 返回按钮点击处理
const onBackClick = () => {
  uni.navigateBack({
    delta: 1,
  });
};

// 响应式数据
const collectInfo = ref("");
const collectedItems = ref([]); // 确保初始化为空数组
const keyword = ref("");
const industryName = ref("");
const collectTime = ref("");
const currentWechatAccount = ref(null);
const maxSelectCount = ref(0); // 初始值设为0，通过接口获取实际值

// 获取用户配置
const getUserConfig = async () => {
  try {
    const res = await api.getUserConfig();
    if (res.data && res.data.data && res.data.data.config_content) {
      const config = res.data.data.config_content;
      if (config.current_wechatId && config.wechatId_list) {
        const currentAccount = config.current_wechatId
        if (currentAccount) {
          currentWechatAccount.value = currentAccount;
          // maxSelectCount.value = currentAccount.accountType === 'new' ? 5 : 20;
          // console.log(currentAccount.accountType === 'new' ? 5 : 20,'123132')
        }
      }
    }
  } catch (error) {
    console.log(error);
    uni.showToast({
      title: '获取配置失败',
      icon: 'none'
    });
  }
};

// const gotoWX = () => {
//   console.log("执行");
//   plus.runtime.launchApplication(
//     {
//       pname: "com.ingru.comboost.ai_marketing",
//     },
//     function (e) {
//       console.log("Open system default browser failed: " + e.message);
//     }
//   );
// };

const gotoWX = () => {
  console.log("执行");
  // #ifdef APP-PLUS
  plus.runtime.launchApplication(
    {
      pname: "com.ingru.comboost.ai_marketing",
    },
    function (e) {
      console.log("Open application failed: " + e.message);
      // 显示确认框
      showDownloadModal.value = true;
    }
  );
  // #endif

  // #ifdef H5
  window.location.href = "https://comboost.26sl.com/comboost_download.html";
  // #endif
};

// 优化拨打电话方法
const makePhoneCall = (item) => {
  if (!item.tel || item.tel === "暂无电话") {
    uni.showToast({
      title: "暂无电话号码",
      icon: "none",
    });
    return;
  }

  // 处理电话号码，移除可能的空格和特殊字符
 

  const phoneNumber =  formatPhoneNumber(item.tel)

  if (!phoneNumber) {
    uni.showToast({
      title: "暂无手机号码",
      icon: "none",
    });
    return;
  }

  // #ifdef APP-PLUS
  // App环境下使用原生方式
  plus.runtime.openURL(`tel:${phoneNumber}`, (err) => {
    uni.showToast({
      title: "拨打电话失败",
      icon: "none",
    });
  });
  // #endif

  // #ifdef H5
  // H5环境下使用uni.makePhoneCall
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
    fail: () => {
      uni.showToast({
        title: "拨打电话失败",
        icon: "none",
      });
    },
  });
  // #endif
};

// 打开位置
const openLocation = (item) => {
  const [longitude, latitude] = item.location.split(",");
  uni.openLocation({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    name: item.name,
    address: item.address,
  });
};

// 修改打开微信添加好友方法
const copyWechat = (item) => {
  const phoneNumber = item.tel ? item.tel.replace(/[^0-9]/g, "") : "";

  if (!phoneNumber) {
    uni.showToast({
      title: "暂无手机号码",
      icon: "none",
    });
    return;
  }

  // #ifdef APP-PLUS
  // 先复制手机号
  uni.setClipboardData({
    data: phoneNumber,
    success: () => {
      // 然后打开微信
      plus.runtime.openURL("weixin://", (err) => {
        if (err) {
          uni.showToast({
            title: "打开微信失败，请确认是否安装微信",
            icon: "none",
          });
        } else {
          uni.showToast({
            title: "手机号已复制，请在微信中搜索",
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
  });
  // #endif

  // #ifdef H5
  uni.showToast({
    title: "请在App中使用此功能",
    icon: "none",
  });
  // #endif
};

const collect_batch_id = ref("");
const msg_content = ref("");
// 页面加载时获取数据
onShow(()=>{
  console.log('213')
  getUserConfig(); 
})
onMounted(() => {
  // getUserConfig(); // 在页面加载时获取用户配置
  
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;

  // 如果有关键词参数，先保存到 urlKeyword
  if (options?.collect_batch_id) {
    collect_batch_id.value = options.collect_batch_id;
    console.log(options.collect_batch_id, "collect_batch_id");
  }
  if (options?.msg_content && options.msg_content != "null") {
    // msg_content.value = options.msg_content
    console.log(options.msg_content, "msg_content");
    messageText.value = options.msg_content;
  }

  // 从本地存储获取数据
  const items = uni.getStorageSync("collectedItems");
  const info = uni.getStorageSync("collectInfo");
  const kw = uni.getStorageSync("searchKeyword");

  const time = uni.getStorageSync("collect_time");

  keyword.value = kw;
  industryName.value = uni.getStorageSync("industry_name");
  if (items) {
    collectedItems.value = items;
  }

  if (info) {
    collectInfo.value = info;
  }

  // 如果有行业信息，同时显示行业和关键词

  // 使用本地存储的采集时间
  if (time) {
    collectTime.value = time.substring(0, 16); // 只显示到分钟
  }
});

// 添加新的响应式变量
const showPopup = ref(false);
const messageText = ref("你好");
const showDownloadModal = ref(false);

// 多选相关的状态
const isSelectionMode = ref(false);
const selectedItems = ref([]);


// 修改showMessageSettings方法


// 修改confirmMessage方法
const confirmMessage = async () => {
  if (!messageText.value.trim()) {
    uni.showToast({
      title: "请输入私信内容",
      icon: "none",
    });
    return;
  }

  try {
    console.log("collect_batch_id, messageText",collect_batch_id.value, messageText.value, );
    await api.updateWechatMessage(collect_batch_id.value, messageText.value);
    let addData = {
  "collect_batch_id":collect_batch_id.value ,
  "wx_id": currentWechatAccount.value,
  "add_cnt": selectedItems.value.length 
}
    // await api.getWxAddFriendLimit(addData);
    
     uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
    // 重置选择状态
    isSelectionMode.value = false;
    selectedItems.value = [];
    showPopup.value = false;
    // gotoWX()
  } catch (error) {
    responseHandler.error(error);
  }
};

// 处理列表项点击
const handleItemClick = (item) => {
  if (!isSelectionMode.value) return;
  
  // 检查是否有有效的手机号
  if (!isValidPhone(item.tel)) {
    return;
  }
  
  const index = selectedItems.value.findIndex(selected => selected.id === item.id);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    // 检查是否达到选择上限
    if (selectedItems.value.length >= maxSelectCount.value) {
      uni.showToast({
        title: `超出限额，当前最多可添加${maxSelectCount.value}个`,
        icon: 'none'
      });
      return;
    }
    console.log(maxSelectCount,'最大')
    selectedItems.value.push(item);
  }
};

// 检查项目是否被选中
const isItemSelected = (item) => {
  return selectedItems.value.some(selected => selected.id === item.id);
};

const batchAddWechat = async () => {
  if (!isSelectionMode.value) {
    // 检查是否已绑定微信账号
    const res = await api.getUserConfig();
    if (!res.data?.data?.config_content?.current_wechatId) {
      uni.showToast({
        title: '请先绑定微信账号',
        icon: 'none'
      });
      uni.navigateTo({
        url: '/pages/wechat/bind'
      });
    return
    }
    console.log('eeee',currentWechatAccount.value)
    
    // 显示账号类型和上限提示
    try {
   
      const res = await api.getWxAddFriendLimit({ "wx_id": currentWechatAccount.value});
      console.log('rrrr',res)
      if (res.data?.code == 200) {
        maxSelectCount.value = parseInt(res.data.data.available_num);
        console.log(maxSelectCount.value, 'maxSelectCount.value');
        uni.showToast({
          title: `当前账号剩余可添加${maxSelectCount.value}个好友`,
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('获取添加限额失败:', error);
      uni.showToast({
        title: '获取添加限额失败',
        icon: 'none'
      });
      return;
    }
    isSelectionMode.value = true;
    selectedItems.value = [];
    return;
  }

  if (selectedItems.value.length === 0) {
    uni.showToast({
      title: "暂无可添加的联系人",
      icon: "none",
    });
    return;
  }

  // 组装请求数据

  // 行业获客
  // collect_type: "0",
  //   key_words:realIndustry.industrySecond,
  //   collect_address:`${realRegion.province}-${realRegion.city}-${realRegion.district}`,
	// 	collect_time: formatDate(new Date()),
	// 	industry_type:realIndustry.industrySecondCode,
  //   industry_name:`${realIndustry.industry}-${realIndustry.industrySecond}`,
	// 	collection_result: collectedItems.value,
	// 	collect_location: `${mapState.latitude},${mapState.longitude}`,
	// 	time: formatDate(new Date())
let data = []
  if(keyword.value){
    data = {
      collect_type: '1',
      key_words:keyword.value,
      collect_address:collectInfo.value,
      collect_time: formatDate(new Date()),
      collection_result: selectedItems.value,
      collect_location: ""
    }
  }else{
      data = {
        collect_type: '0',
        key_words:industryName.value,
        collect_address:collectInfo.value,
        collect_time: formatDate(new Date()),
        industry_type:'',
        industry_name:industryName.value,
        collection_result: selectedItems.value,
        collect_location: "",
        time: formatDate(new Date()),
      }
    }
 
  // 调用接口保存数据
  uni.request({
    url: 'http://chat.ihealer.cn:9999/comboost/api/wechat/add_wx_records',
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'token': uni.getStorageSync('token')
    },
    data: data
  }).then(res => {
    if (res.data.code == '401') {
      uni.showToast({
        title: '请求失效',
        duration: 2000,
        icon: 'none',
      });
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        });
      }, 2000);
      return;
    }
    collect_batch_id.value = res.data.data.collect_batch_id;
    showPopup.value = true;
    // console.log(res.data,'res.data.res.data.')
   
  }).catch(err => {
    console.error('请求失败:', err);
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    });
  });

  // #ifdef APP-PLUS
  // 获取所有有效的手机号
  // const phoneNumbers = collectedItems.value
  //   .map((item) => (item.tel ? item.tel.replace(/[^0-9]/g, "") : ""))
  //   .filter((tel) => tel !== "");

  // if (phoneNumbers.length === 0) {
  //   uni.showToast({
  //     title: "没有可用的手机号码",
  //     icon: "none",
  //   });
  //   return;
  // }

  // // 复制所有手机号到剪贴板
  // uni.setClipboardData({
  //   data: phoneNumbers.join("\n"),
  //   success: () => {
  //     plus.runtime.openURL("weixin://", (err) => {
  //       if (err) {
  //         uni.showToast({
  //           title: "打开微信失败，请确认是否安装微信",
  //           icon: "none",
  //         });
  //       } else {
  //         uni.showToast({
  //           title: "手机号已复制，请在微信中搜索",
  //           icon: "none",
  //           duration: 2000,
  //         });
  //       }
  //     });
  //   },
  // });
  // #endif

  // #ifdef H5
  // uni.showToast({
  //   title: "请在App中使用此功能",
  //   icon: "none",
  // });
  // #endif
};

const previewImage = (url) => {
  if (!url) {
    uni.showToast({
      title: "暂无图片",
      icon: "none",
    });
    return;
  }

  uni.previewImage({
    urls: [url],
    current: url,
  });
};

// 在响应式数据部分添加
const showBindWechatModal = ref(false);

// 在batchAddWechat方法中替换原有的showModal


// 添加确认处理方法
const handleBindWechatConfirm = () => {
  showBindWechatModal.value = false;
  uni.navigateTo({
    url: '/pages/wechat/bind'
  });
};

const handleDownloadConfirm = () => {
  // #ifdef APP-PLUS
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
  // #endif
  showDownloadModal.value = false;
};

// 替换任务列表接口
const loadTasks = async () => {
  try {
    const res = await api.getTaskList(currentStatus.value);
    taskList.value = responseHandler.success(res);
  } catch (error) {
    responseHandler.error(error);
  }
};

const startNewTask = async () => {
  try {
    await api.startTask("comment", { target: target.value });
    // ...后续处理
  } catch (error) {
    responseHandler.error(error);
  }
};
// 在script setup中添加手机号验证函数
const isValidPhone = (tel) => {
  if (!tel || tel === '[]' || tel.length === 0) return false;
  const phoneNumber = typeof tel === 'string' ? tel.match(/^([^;]+)/)[0] : tel;
  return /^1[3-9]\d{9}$/.test(phoneNumber.replace(/[^0-9]/g, ''));
};

// 格式化电话号码
const formatPhoneNumber = (tel) => {
  if (!tel || tel === '[]' || tel.length === 0) return '暂无电话';
  
  // 如果是字符串类型，提取第一个电话号码
  const phoneNumber = typeof tel === 'string' ? tel.match(/^([^;]+)/)[0] : tel;
  
  // 移除非数字字符
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  
  // 如果不是11位手机号，直接返回原始号码
  if (cleanNumber.length !== 11) return phoneNumber;
  
  // 格式化为 xxx-xxxx-xxxx
  return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 7)}-${cleanNumber.slice(7)}`;
};

// 分页相关的响应式数据
const currentPage = ref(1);
const pageSize = ref(30);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(collectedItems.value.length / pageSize.value);
});

// 计算当前页的数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return collectedItems.value.slice(start, end);
});

// 分页控制方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const cancelSelection = () => {
  isSelectionMode.value = false;
  selectedItems.value = [];
};
// 添加全选相关的变量和方法
const isAllSelected = ref(false);

// 全选/取消全选方法
const toggleSelectAll = () => {
  const currentPageItems = currentPageData.value;
  if (isAllSelected.value) {
    // 取消当前页的选择
    selectedItems.value = selectedItems.value.filter(item => !currentPageItems.some(currentItem => currentItem.id === item.id));
    isAllSelected.value = false;
  } else {
    // 获取当前页面有效的联系人（有手机号的）
    const validCurrentPageItems = currentPageItems.filter(item => isValidPhone(item.tel));
    
    // 计算还可以选择的数量
    const remainingSlots = maxSelectCount.value - selectedItems.value.length;
    
    // 如果剩余可选数量大于0，添加当前页面的有效联系人
    if (remainingSlots > 0) {
      // 只添加不超过剩余数量的联系人
      const itemsToAdd = validCurrentPageItems.slice(0, remainingSlots);
      selectedItems.value = [...selectedItems.value, ...itemsToAdd];
      
      
      // 如果无法全选当前页，显示提示
      if (validCurrentPageItems.length > remainingSlots) {
        uni.showToast({
          title: `已达到${maxSelectCount.value}个上限`,
          icon: 'none'
        });
      }
      isAllSelected.value = itemsToAdd.length === validCurrentPageItems.length;
    } else {
      uni.showToast({
        title: `最多只能选择${maxSelectCount.value}个联系人`,
        icon: 'none'
      });
      isAllSelected.value = false;
    }
    
    // 根据账号类型限制选择数量
    const selectLimit = maxSelectCount.value;
    const contactsToSelect = validContacts.slice(0, selectLimit);
    
    // 将选中的联系人添加到已选列表中
    selectedItems.value = [...contactsToSelect];
  }
  
  // 更新全选状态
  isAllSelected.value = !isAllSelected.value;
};

// 监听selectedItems变化，更新isAllSelected状态
watch([selectedItems, currentPage], () => {
  // 检查当前页中所有有效手机号的数据是否都被选中
  const validItems = currentPageData.value.filter(item => isValidPhone(item.tel));
  isAllSelected.value = validItems.length > 0 && 
    validItems.every(item => selectedItems.value.includes(item));
});

const showMessageSettings = () => {
  showSecurityModal.value=true 
  // showPopup.value = true;

};
const closeSafeTip= () => {
  showSecurityModal.value=false
  // showPopup.value = true;

};
</script>

<style>
/* 容器样式调整 */
.container {
  flex: 1;
  background-color: #f6f7f9;
}

/* 多选模式样式 */
.selection-mode {
  position: relative;
  padding-left: 40px;
}

.checkbox-wrapper {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);

  background-color: #1989fa;
  border-color: #1989fa;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #ebeef5;
}

/* 固定导航栏样式 */
.nav-bar.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  background-color: #ffffff;
}

.nav-content {
  height: 35px;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.nav-left {
  position: absolute;
  left: 15px;
  height: 100%;
  justify-content: center;
  z-index: 1;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #303133;
  position: absolute;
  left: 0;
  right: 0;
}

.nav-right {
  position: absolute;
  right: 15px;
  width: 44px;
  height: 100%;
  justify-content: center;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 20px 15px;
  margin-top: 15px;
  padding-bottom: 74px; /* 底部按钮的高度 + 内边距 */
}

/* 统计卡片样式 */
.stats-card {
  margin-top: 8px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 8px;
}

.stats-title {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
}

.stats-count {
  font-size: 14px;
  color: #1989fa;
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stats-label {
  font-size: 12px;
  color: #999999;
  width: 70px;
}

.stats-value {
  font-size: 12px;
  color: #666666;
  flex: 1;
  white-space: pre-line; /* 允许换行符 \n 生效 */
}

/* 列表样式 */
.list-container {
  flex: 1;
}

.list-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.selection-mode {
  padding-left: 48px;
}

.checkbox-wrapper {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.checkbox.checked {
  background-color: #1989fa;
  border-color: #1989fa;
}

.checkbox.disabled {
  background-color: #F5F7FA;
  border-color: #E4E7ED;
  cursor: not-allowed;
}

/* 第一行样式 */
.item-header {
  /* flex-direction: row; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header-left {
  /* flex-direction: row; */
  display: flex;
  align-items: center;
}

.item-avatar {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(25, 137, 250, 0.1);
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  overflow: hidden; /* 添加overflow确保图片不会超出圆形边界 */
}

.item-avatar image {
  width: 100%;
  height: 100%;
}

.item-tel {
  font-size: 14px;
  color: #666666;
}

.header-actions {
  display: flex;
}

.action-btn {
  margin-left: 20px;
}

.action-btn:first-child {
  margin-left: 0;
}

/* 第二行样式 */
.item-name-row {
  /* flex-direction: row; */
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  margin-right: 8px;
}

.item-type {
  margin-top: 7px;
  font-size: 12px;
  color: #1989fa;
  background-color: rgba(25, 137, 250, 0.1);
  padding: 2px 2px;
  border-radius: 4px;
}

/* 第三行样式 */
.item-address {
  font-size: 14px;
  color: #666666;
  lines: 1;
  text-overflow: ellipsis;
}

/* 激活状态 */
.action-btn:active {
  opacity: 0.7;
}

/* 底部固定按钮区域 */
.bottom-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.03);
  gap: 24rpx;
}

.select-all-btn {
  background-color: #409eff;
  margin-right: 10px;
}

.bottom-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
}

.cancel-btn .btn-text {
  color: #333333;
}

.message-btn {
  background-color: #1989fa;
}

.add-btn {
  background-color: #07c160;
}

.btn-text {
  color: #ffffff;
  font-size: 14px;
  margin-left: 4px;
}

/* 修改弹框相关样式 */
.message-popup {
  width: 320px;
  background-color: #ffffff;
  border-radius: 12px;
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
}

.popup-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.popup-content {
  padding: 20px 16px;
}

/* 添加文本框样式 */
:deep(.up-textarea) {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
}

:deep(.up-textarea__count) {
  margin-top: 8px;
  color: #909399;
}

.popup-footer {
  display: flex;
  border-top: 1px solid #ebeef5;
}

.popup-btn {
  flex: 1;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.popup-btn.cancel {
  color: #909399;
  border-right: 1px solid #ebeef5;
}

.popup-btn.confirm {
  color: #1989fa;
}

.popup-btn:active {
  opacity: 0.7;
  background-color: #f5f7fa;
}
/* 分页控制样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 15px;
}

.pagination-btn {
  background-color: #1989fa;
  padding: 10px 20px;
  border-radius: 8px;
  margin: 0 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(25, 137, 250, 0.1);
}

.pagination-btn:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(25, 137, 250, 0.1);
}

.pagination-btn.disabled {
  background-color: #e8e8e8;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination-info {
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}

.btn-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.page-text {
  margin: 0 12px;
}
</style>






