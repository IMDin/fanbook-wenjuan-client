<template>
  <div class="leftPart">
    <p v-if="!writeStatus">
      效果预览
    </p>
    <img 
      :src="dialogForm.projectShareImg" 
      class="showTipPhoto" 
    >
    <div class="previewText">
      <p>{{ dialogForm.mainText }}</p>
      <p>{{ dialogForm.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dialogForm", "writeStatus"],
  mounted() {
    console.log(this.writeStatus);
  }
};
</script>

<style lang="scss" scoped>
.showTipPhoto {
  padding: 30px 0 0;
  margin: auto;
}
.leftPart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  .previewText {
    p:nth-child(1) {
      margin-bottom: 10px;
      text-align: center;
      font-size: 24px;
      color: #000;
    }
    p:nth-last-child(1) {
      margin-top: 0;
      text-align: center;
      color: #7b7b7b;
    }
  }
}
</style>