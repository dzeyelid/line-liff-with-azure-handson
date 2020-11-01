<template>
  <div>
    <h1 class="text-xl font-semibold">What's the previous color?</h1>
    <div class="flex justify-center mt-4">
      <div>
        <button @click="bet('red')" class="w-32 h-32 bg-red-500 rounded m-1" :disabled="!isReady">Red</button>
      </div>
      <div>
        <button @click="bet('green')" class="w-32 h-32 bg-green-500 rounded m-1" :disabled="!isReady">Green</button>
      </div>
    </div>
    <div class="flex justify-center">
      <div>
        <button @click="bet('blue')" class="w-32 h-32 bg-blue-500 rounded m-1" :disabled="!isReady">Blue</button>
      </div>
      <div>
        <button @click="bet('yellow')" class="w-32 h-32 bg-yellow-500 rounded m-1" :disabled="!isReady">Yellow</button>
      </div>
    </div>
    <div class="mt-8 space-y-1">
      <h2 class="text-lg font-medium">Debug</h2>
      <div>Line version: {{ lineVersion }}</div>
      <div>Is Logged in: {{ isLoggedIn }}</div>
      <button @click="getProfile" class="bg-gray-200 px-4 py-2 rounded-md shadow">Get profile</button>
      <pre>{{ response }}</pre>
    </div>
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
