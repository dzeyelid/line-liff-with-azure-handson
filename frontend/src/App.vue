<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <liff-dev />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";
import LiffDev from "./components/LiffDev.vue";

export default defineComponent({
  name: "App",
  components: {
    LiffDev
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
