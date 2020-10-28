<template>
  <div>LIFF dev</div>
  <div>{{ lineVersion }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: liff.getLineVersion()
    };
  }
});
</script>
