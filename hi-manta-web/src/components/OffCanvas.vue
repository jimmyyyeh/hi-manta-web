<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <input class="offcanvas-button" type="image" src="https://i.imgur.com/CxcL1Vf.jpge" data-bs-dismiss="offcanvas" alt="offcanvas">
    </div>
    <div class="offcanvas-body">
      <ul>
        <li @click="redirectPage('home')" data-bs-dismiss="offcanvas">首頁</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
