<template>
  <div>
    <div>LIFF dev</div>
    <div>{{ lineVersion }}</div>
    <div>{{ isLoggedIn }}</div>
    <div>{{ idToken }}</div>
    <button @click="getProfile">Get profile</button>
    <div>{{ response }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import liff from "@line/liff";
import isInClient from "@line/liff/dist/lib/common/isInClient";

const defaultLiffId = "1655108829-e0bBYjYW";

export default defineComponent({
  name: "LiffDev",
  data() {
    return {
      lineVersion: '',
      isLoggedIn: false,
      idToken: '',
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

      const idToken = liff.getIDToken();
      if (idToken) {
        this.idToken = idToken;
      }
    },
    async getProfile() {
      console.log("getProfile()");
      const response = await fetch('/api/GetProfile', {
          method: "POST",
          body: JSON.stringify({
            token: this.idToken
          })
      });
      this.response = await response.json();
    }
  }
});
</script>
