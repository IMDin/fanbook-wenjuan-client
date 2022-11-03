<template>
  <div class="ismobile">
    <div class="imgbox">
      <img src="@/assets/images/pc_no.png">
    </div>
    <p>移动端暂不支持问卷管理</p>
    <p>请从PC端访问</p>
  </div>
</template>

<script>
export default {
  name: "IsMobile"
}
</script>

<style lang="scss" scoped>
.ismobile {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 200px ;
  .imgbox {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>