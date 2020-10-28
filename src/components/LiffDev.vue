<template>
  <div>LIFF dev</div>
  <div>{{ lineVersion }}</div>
  <div>{{ isLoggedIn }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";
// import { LiffService } from "../services/LiffService";

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: liff.getLineVersion(),
      isLoggedIn: liff.isLoggedIn()
    };
  },
  // computed: {
  //   lineVersion(): string | null {
  //     return this.liffService.getLineVersion();
  //   },
  //   isLoggedIn(): boolean {
  //     return this.liffService.isLoggeeIn();
  //   }
  // }
});
</script>
