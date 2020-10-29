<template>
  <div>LIFF dev</div>
  <div>{{ lineVersion }}</div>
  <div>{{ isLoggedIn }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";

const defaultLiffId = "1655108829-e0bBYjYW";

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: '',
      isLoggedIn: false
    };
  },
  async created() {
    console.log('created() in App');
    liff.ready
      .then(this.initialized);
    await liff.init({ liffId: defaultLiffId });
  },
  methods: {
    initialized(): void {
      console.log('initlized()');
      const lineVersion = liff.getLineVersion();
      if (lineVersion) {
        this.lineVersion = lineVersion;
      }
      this.isLoggedIn = liff.isLoggedIn();
    }
  }
});
</script>
