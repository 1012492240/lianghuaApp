<template>
	<view class="container">
		<up-picker :show="show" ref="uPickerRef" :columns="columns" @confirm="confirm"
			@change="changeHandler"></up-picker>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const show = ref(true);
const loading = ref(false);

// 用来存储选择的数据
const selectedRegion = reactive({
  province: null,
  city: null,
  district: null,
  provinceIndex: null,
  cityIndex: null,
  districtIndex: null
});

// 省市区数据
const regionData = [
  {
    "code": "11",
    "name": "北京市",
    "children": [
      {
        "code": "1101",
        "name": "市辖区",
        "children": [
          { "code": "110101", "name": "东城区" },
          { "code": "110102", "name": "西城区" }
        ]
      }
    ]
  },
  {
    "code": "12",
    "name": "天津市",
    "children": [
      {
        "code": "1201",
        "name": "市辖区",
        "children": [
          { "code": "120101", "name": "和平区" },
          { "code": "120102", "name": "河东区" }
        ]
      }
    ]
  },
  {
    "code": "13",
    "name": "河北省",
    "children": [
      {
        "code": "1301",
        "name": "石家庄市",
        "children": [
          { "code": "130101", "name": "长安区" },
          { "code": "130102", "name": "桥东区" }
        ]
      },
      {
        "code": "1302",
        "name": "唐山市",
        "children": [
          { "code": "130201", "name": "路北区" },
          { "code": "130202", "name": "路南区" }
        ]
      }
    ]
  }
];

// 初始化 columns
const columns = reactive([[], [], []]);

// 填充省级数据
const fillProvinceData = () => {
  columns[0] = regionData.map(item => item.name);
};

// 填充市级数据
const fillCityData = (provinceIndex) => {
  const province = regionData[provinceIndex];
  columns[1] = province.children.map(item => item.name);
};

// 填充区级数据
const fillDistrictData = (provinceIndex, cityIndex) => {
  const city = regionData[provinceIndex].children[cityIndex];
  columns[2] = city.children.map(item => item.name);
};

// 更新 selectedRegion 的值
const updateSelectedRegion = (provinceIndex, cityIndex, districtIndex) => {
  const province = regionData[provinceIndex];
  const city = province.children[cityIndex];
  const district = city.children[districtIndex];

  selectedRegion.province = province.name;
  selectedRegion.city = city.name;
  selectedRegion.district = district ? district.name : null;
  selectedRegion.provinceIndex = provinceIndex;
  selectedRegion.cityIndex = cityIndex;
  selectedRegion.districtIndex = districtIndex;
};

// 初始化时填充省级数据并选择默认项
const initializePicker = () => {
  fillProvinceData();
  
  // 默认选择第一个省
  const defaultProvinceIndex = 0;
  const defaultCityIndex = 0;
  const defaultDistrictIndex = 0;

  // 填充市级数据
  fillCityData(defaultProvinceIndex);
  
  // 填充区级数据
  fillDistrictData(defaultProvinceIndex, defaultCityIndex);

  // 更新 selectedRegion
  updateSelectedRegion(defaultProvinceIndex, defaultCityIndex, defaultDistrictIndex);
};

// 监听省市区选择的变化
const changeHandler = (e) => {
  const { columnIndex, index } = e;

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
    updateSelectedRegion(selectedRegion.provinceIndex, selectedRegion.cityIndex, index);
  }
};

// 处理确认选择的逻辑
const confirm = (e) => {
  console.log('Selected Region:', selectedRegion);
  // 在这里可以添加其他逻辑，比如关闭选择器、发送选择结果到服务器等
};

// 初始化选择器
initializePicker();
</script>