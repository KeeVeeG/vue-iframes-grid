<script>

export default{
  name: 'IframesGrid', 
  props:{
    iframes:{
      type: Array,
      required: true,
      validator(val){
        return val.length>0
      }
    },
    ratio:{
      type: String,
      default: "16:9",
      validator(val){
        let arr = val.split(":")
        return arr.length == 2 && arr.every(e=>+e>0)
      }
    }
  },
  data() {
    return {
      iframeheight: 0,
      iframewidth: 0,
      boardpadding: 0,
      wInnerHeight: 0
    };
  },
  methods: {
    Calc(){
      let widthRatio = +this.ratio.split(":")[0]
      let heightRatio = +this.ratio.split(":")[1]
      let count = this.iframes.length
      let height = (this.$refs.iframes_grid.clientHeight - 41);
      this.wInnerHeight = height;
      let width = this.$refs.iframes_grid.clientWidth;
      let best_height = 0;
      let best_width = 0;
      let wrapper_padding = 0;
      for (let per_row = 1; per_row <= count; per_row++) {
        let num_rows = Math.ceil(count / per_row);
        let max_width = ~~(width / per_row) - 11;
        let max_height = ~~(height / num_rows) - 11;
        if (max_width * heightRatio/widthRatio < max_height) {
          max_height = max_width * heightRatio/widthRatio;
        } else {
          max_width = (max_height) * widthRatio/heightRatio;
        }
        if (max_width > best_width) {
          best_width = max_width;
          best_height = max_height;
          wrapper_padding = (height - num_rows * max_height)/2;
        }
      }
      this.iframeheight = ~~(best_height);
      this.iframewidth = ~~(best_width);
      if(this.$refs.iframes_grid.clientWidth > 910 && count > 1)
        this.boardpadding = ~~wrapper_padding;
      else
        this.boardpadding = 0;
    }
  },
  created() {
    window.addEventListener("resize", this.Calc);
  },
  mounted() {
    this.Calc()
  },
  watch: {
    iframes: {
      handler: function () {
        this.Calc()
      },
      deep: true
    }
  },
}
</script>

<template>
  <div ref="iframes_grid" class="iframes_grid" :style="{'padding-top': boardpadding + 'px'}">
    <iframe
      v-for="(stream,index) of iframes"
      :key="index"
      v-bind:stream="stream"
      v-bind:iframeheight="iframeheight"
      v-bind:iframewidth="iframewidth"
      :style="{width: iframewidth + 'px', height: iframeheight + 'px'}" :src="stream" frameborder="0"
    ></iframe>
  </div>
</template>

<style scoped>
.iframes_grid{
  width: 100%;
  height: 100%;
  text-align: center;
  float: left;
  margin: 0;
  padding: 0;
  width: 100%
}
</style>
