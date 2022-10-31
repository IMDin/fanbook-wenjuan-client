<template>
  <div>
    <el-cascader
      :key="cascaderKey"
      v-model="value"
      :props="props"
      clearable
      @change="changeHandle"
    />
    <div>
      <el-input
        v-if="provinceRadio == 1"
        type="textarea"
        style="margin-top: 15px; width: 300px"
        v-model="address"
        @change="changeHandle"
      />
    </div>
  </div>
</template>

<script>
import city from './level.min.json'
export default {
  name: 'ProvinceCity',
  props: {
    provinceRadio: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      cascaderKey: 1,
      value: [],
      props: {
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      address: '',
    }
  },
  watch: {
    provinceRadio: {
      handler() {
        this.cascaderKey++
      },
    },
    deep: true,
  },
  mounted() {},
  methods: {
    changeHandle() {
      this.$emit('input', { address: this.address, value: this.value })
    },
    lazyLoad(node, resolve) {
      let result = []
      if (node.level === 0) {
        result = city.map(c => ({ label: c.n, value: c.c, d: c.d, leaf: this.provinceRadio === 4 }))
      } else if (node.level === 1) {
        const children = node.data.d
        const leaf = !children[0].d || this.provinceRadio === 3
        result = children.map(c => ({ label: c.n, value: c.c, d: c.d, leaf }))
      } else if (node.level === 2) {
        result = node.data.d.map(c => ({ label: c.n, value: c.c, d: c.d, leaf: true }))
      }
      resolve(result)
    },
  },
}
</script>
