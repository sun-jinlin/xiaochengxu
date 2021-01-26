<template>
  <view>
    <map
      class="map"
      :scale="scale"
      :longitude="longitude"
      :latitude="latitude"
      :markers="markers"
    ></map>
    <button @click="openMap" type="primary">打开位置</button>
    <button @click="chooseMap" type="primary">选择位置</button>
    <web-view src="https://itcast.cn" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: "",
      longitude: "",
      scale: 14,
      markers: [],
    };
  },
  onLoad() {
    this.getMap();
  },
  methods: {
    async getMap() {
      uni.getLocation({
        success: (res) => {
          console.log(res);
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.markers.push({
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
          });
        },
      });
    },
    openMap() {
      uni.openLocation({
        latitude: 39.918034,
        longitude: 116.403694,
      });
    },
    chooseMap() {
      uni.chooseLocation({
        success: (data) => {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
          this.markers = [
            {
              id: 0,
              latitude: data.latitude,
              longitude: data.longitude,
            },
          ];
        },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.map {
  width: 750rpx;
  height: 600rpx;
}
</style>
