<template>
  <view class="index" :style="{ overflow: 'hidden', height: pageHeight }">
    <!-- 搜索 -->
    <search @search="disScroll" />
    <!-- 轮播图 -->
    <view class="slider">
      <swiper
        autoplay
        interval="2000"
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,1)"
        indicator-active-color="rgba(255,255,255,.6)"
      >
        <swiper-item v-for="item in swiper" :key="item.goods_id">
          <navigator
            :open-type="item.open_type"
            :url="'/packone/goods/index?id=' + item.goods_id"
          >
            <image :src="item.image_src" />
          </navigator>
        </swiper-item>
      </swiper>
    </view>
    <!-- 功能导航 -->
    <view class="navs">
      <navigator
        :open-type="item.open_type || 'navigate'"
        url="/pages/category/index"
        v-for="item in navs"
        :key="item.name"
      >
        <image :src="item.image_src" />
      </navigator>
    </view>
    <!-- 栏目楼层 -->
    <view class="floors">
      <!-- 1 -->
      <view class="floor" v-for="item in floors" :key="item.floor_title.name">
        <!-- title -->
        <view class="ftitle">
          <image :src="item.floor_title.image_src" />
        </view>
        <!-- pics -->
        <view class="fitem">
          <navigator
            :open-type="item.open_type"
            v-for="item in item.product_list"
            :key="item.name"
            :url="'/packone/list/index?query=' + prd.name"
          >
            <image :src="item.image_src" />
          </navigator>
        </view>
      </view>
    </view>
    <!-- 底部提示 -->
    <view class="end">
      <text>我是有底线的！</text>
    </view>
    <!-- 回到顶部 -->
    <view v-if="isScroll" @click="scrollTop" class="goTop icon-top"></view>
  </view>
</template>

<script>
// 导入组件
import search from "@/components/search";
import request from "@/utils/request";
export default {
  data() {
    return {
      pageHeight: "auto",
      swiper: [],
      navs: [],
      floors: [],
      scrollTops: "",
    };
  },
  // 注册组件
  components: {
    search,
  },
  computed: {
    isScroll() {
      this.wh2 = uni.getSystemInfoSync().windowHeight / 2;
      return this.scrollTops > this.wh2;
    },
  },
  onLoad() {
    uni.startPullDownRefresh();
    this.getSwiper();
    this.getNavs();
    this.getFloors();
  },
  // onReady() {
  //   uni.stopPullDownRefresh();
  // },
  onPullDownRefresh() {
    Promise.all([this.getSwiper(), this.getNavs(), this.getFloors()]).then(
      (res) => {
        uni.stopPullDownRefresh();
      }
    );
  },
  onReady() {
    uni.stopPullDownRefresh();
  },
  onPageScroll(e) {
    this.scrollTops = e.scrollTop;
  },
  methods: {
    // 搜索时禁止页面滚动
    disScroll(e) {
      this.pageHeight = e;
    },
    async getSwiper() {
      const { mes, data } = await this.request({
        url: "/home/swiperdata",
      });
      if (mes.status === 200) {
        this.swiper = data;
      }
    },
    async getNavs() {
      const { mes, data } = await this.request({
        url: "/home/catitems",
      });
      if (mes.status === 200) {
        this.navs = data;
      }
    },
    async getFloors() {
      const { mes, data } = await this.request({
        url: "/home/floordata",
      });
      if (mes.status === 200) {
        this.floors = data;
      }
    },
    scrollTop() {
      uni.pageScrollTo({
        scrollTop: 0,
      });
    },
  },
};
</script>

<style lang="scss">
.index {
  // 轮播
  .slider {
    swiper,
    image {
      width: 750rpx;
      height: 340rpx;
    }
  }
  // 功能导航
  .navs {
    display: flex;
    padding: 30rpx;
    background: #fff;
    justify-content: space-between;
    navigator {
      width: 128rpx;
      height: 140rpx;
    }
  }

  // 栏目楼层
  .floor {
    .ftitle {
      padding-top: 30rpx;
      background: #f4f4f4;
      image {
        width: 750rpx;
        height: 60rpx;
      }
    }
    // pics
    .fitem {
      padding: 20rpx 16rpx 10rpx;
      overflow: hidden;
      navigator {
        float: left;
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
      }
      navigator:nth-child(1) {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0;
      }
      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
        height: 188rpx;
      }
    }
    &:first-child {
      .fitem {
        navigator {
          width: 233rpx;
        }
      }
    }
  }
  .end {
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
