<template>
  <div>
    <div>LIFF dev</div>
    <div>{{ lineVersion }}</div>
    <div>{{ isLoggedIn }}</div>
    <button @click="getProfile">Get profile</button>
    <div>{{ response }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";
import isInClient from "@line/liff/dist/lib/common/isInClient";

const defaultLiffId = process.env.VUE_APP_LIFF_ID || '';

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: '',
      isLoggedIn: false,
      response: ''
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
      console.log(`isInClient: ${liff.isInClient()}`);
      if (!liff.isInClient() && !liff.isLoggedIn()) {
        liff.login();
      }

      const lineVersion = liff.getLineVersion();
      if (lineVersion) {
        this.lineVersion = lineVersion;
      }

      this.isLoggedIn = liff.isLoggedIn();
      console.log(`loggedIn: ${liff.isLoggedIn()}`);
    },
    async getProfile() {
      console.log("getProfile()");
      const accessToken = liff.getAccessToken();
      console.log(`accessToken: ${accessToken}`);
      const url = "/api/GetProfile";
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            token: accessToken
          })
      });
      this.response = await response.json();
    }
  }
});
</script>
