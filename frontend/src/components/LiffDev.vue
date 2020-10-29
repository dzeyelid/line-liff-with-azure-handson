<template>
  <div>
    <div>LIFF dev</div>
    <div>{{ lineVersion }}</div>
    <div>{{ isLoggedIn }}</div>
    <button @click="getProfile">Get profile</button>
  </div>
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
      isLoggedIn: false,
      idToken: '',
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

      const idToken = liff.getIDToken();
      if (idToken) {
        this.idToken = idToken;
      }
    },
    async getProfile() {
      console.log("getProfile()");
      const result = await fetch('/api/GetProfile', {
          method: "POST"
      });
      console.log(`result: ${JSON.stringify(result)}`);
    }
  }
});
</script>
