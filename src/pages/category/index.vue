<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text
            @click="switchSub(i)"
            :class="i === active ? 'active' : ''"
            :key="i"
            v-for="(item, i) in cates"
            >{{ item.cat_name }}</text
          >
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image
            src="http://static.botue.com/ugo/uploads/category.png"
            class="thumb"
          />
          <view v-for="(item, i) in sub" :key="i" class="children">
            <view class="title">{{ item.cat_name }}</view>
            <!-- 品牌 -->
            <view class="brands">
              <navigator
                v-for="(items, i) in item.children"
                :key="i"
                :url="'/packone/list/index?query=' + items.cat_name"
              >
                <image :src="items.cat_icon" />
                <text>{{ items.cat_name }}</text>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import search from "@/components/search";

export default {
  components: {
    search,
  },
  data() {
    return {
      cates: [],
      active: 0,
    };
  },
  computed: {
    sub() {
      return this.cates.length && this.cates[this.active].children;
    },
  },
  onLoad() {
    this.getSup();
  },
  methods: {
    async getSup() {
      const { mes, data } = await this.request({
        url: "/categories",
      });
      if (mes.status === 200) {
        this.cates = data;
      }
    },
    switchSub(i) {
      this.active = i;
    },
  },
};
</script>

<style scoped lang="scss">
scroll-view {
  height: 100%;
}

.category {
  display: flex;
  width: 100%;
  position: absolute;
  top: 100rpx;
  bottom: 0;

  .sup {
    width: 196rpx;
    background-color: #f4f4f4;

    text {
      display: block;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      font-size: 27rpx;
      color: #333;
      border-bottom: 1rpx solid #eee;

      &:last-child {
        border-bottom: none;
      }

      &.active {
        background-color: #fff;
        color: #ea4451;
        position: relative;

        &::before {
          content: "";
          display: block;
          width: 8rpx;
          height: 60rpx;
          transform: translateY(-50%);
          background-color: #ea4451;

          position: absolute;
          left: 0;
          top: 50%;
        }
      }
    }
  }

  .sub {
    flex: 1;
    padding: 20rpx 18rpx;

    .thumb {
      width: 100%;
      height: 180rpx;
    }

    .children {
      text-align: center;
      color: #333;

      .title {
        display: inline-block;
        margin: 40rpx 0 20rpx;
        font-size: 30rpx;

        &::before {
          content: "/";
          margin-right: 20rpx;
          color: #666;
        }

        &::after {
          content: "/";
          margin-left: 20rpx;
          color: #666;
        }
      }
    }

    .brands {
      display: flex;
      flex-wrap: wrap;

      navigator {
        width: 33%;
        margin-bottom: 20rpx;
      }

      image {
        width: 120rpx;
        height: 120rpx;
      }

      text {
        display: block;
        font-size: 24rpx;
      }
    }
  }
}
</style>
