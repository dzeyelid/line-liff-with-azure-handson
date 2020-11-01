<template>
  <div>
    <div>LIFF dev</div>
    <div>{{ lineVersion }}</div>
    <div>{{ isLoggedIn }}</div>
    <button @click="getProfile">Get profile</button>
    <br />
    <button @click="bet('red')" :disabled="!isReady">Red</button>
    <button @click="bet('green')" :disabled="!isReady">Green</button>
    <button @click="bet('blue')" :disabled="!isReady">Blue</button>
    <button @click="bet('yellow')" :disabled="!isReady">Yellow</button>
    <pre>{{ response }}</pre>
    <div class="bg-blue-500">button</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";

const defaultLiffId = process.env.VUE_APP_LIFF_ID || "";
type Color = "red" | "green" | "blue" | "yellow";

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: "",
      isLoggedIn: false,
      response: "",
      isReady: false
    };
  },
  async created() {
    console.log("created() in App");
    liff.ready.then(this.initialized);
    await liff.init({ liffId: defaultLiffId });
  },
  methods: {
    initialized(): void {
      console.log("initlized()");
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
      this.isReady = true;
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
    },
    async bet(color: Color) {
      const accessToken = liff.getAccessToken();
      console.log(`accessToken: ${accessToken}`);
      const url = "/api/Bet/default";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          token: accessToken,
          selectedColor: color
        })
      });
      this.response = await response.json();
    }
  }
});
</script>

