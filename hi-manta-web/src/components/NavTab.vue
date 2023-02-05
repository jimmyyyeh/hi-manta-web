<template>
  <div class="nav-bar">
    <div class="logo">
      <input type="image" class="nav-item" src="https://i.imgur.com/CxcL1Vf.jpge" alt="logo" @click="redirectPage('home')">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabName: this.$route.name.toLowerCase(),
      pathMap: {
        home: '/',
      },
    };
  },
  methods: {
    redirectPage(name) {
      const path = this.pathMap[name];
      this.$router.push(path);
    },
  },
};
</script>
