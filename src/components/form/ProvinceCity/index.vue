<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      :props="props"
      clearable
      @change="changeHandle"
    />
  </div>
</template>

<script>
import city from "./level.min.json";
export default {
  name: "ProvinceCity",
  props: {
    provinceRadio: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      value: [],
      options: city,
      //省 n   市 d下的n   d 市以下
      props: {
        label: "n",
        value: "n",
        children: "d",
      },
    };
  },
  watch: {
    provinceRadio: {
      handler(val) {
        console.log(256, val,this.props);
        this.value = []
        if (val == 3) {
          this.props.children = "d.n";
        } else if (val == 4) {
          this.props = {
            label: "n",
            value: "n",
          };
        }
        this.$forceUpdate()
      },
    },
    deep: true,
  },
  mounted() {
    this.$nextTick(
    // this.$set(this.props,'children','d.n')
    this.props = {
        label: "n",
        value: "n",
        children: "d.n",
      },
    )
  },
  methods: {
    changeHandle(val) {
      this.$emit("input", val);
      console.log(111, "city", this.props);
    },
  },
};
</script>

