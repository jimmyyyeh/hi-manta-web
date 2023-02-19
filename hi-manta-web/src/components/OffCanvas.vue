<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
    <div class="offcanvas-header">
      <input class="offcanvas-button" type="image" src="https://i.imgur.com/CxcL1Vf.jpge" data-bs-dismiss="offcanvas" alt="offcanvas">
    </div>
    <div class="offcanvas-body">
      <ul>
        <li @click="redirectPage('home')" data-bs-dismiss="offcanvas">首頁</li>
        <li @click="redirectPage('medalLog')" data-bs-dismiss="offcanvas">勳章紀錄</li>
        <li @click="redirectPage('medal')" data-bs-dismiss="offcanvas">勳章列表</li>
        <li @click="redirectPage('prize')" data-bs-dismiss="offcanvas">獎勵列表</li>
        <li @click="redirectPage('auth')" data-bs-dismiss="offcanvas">{{ $parent.isSignIn ? '登出': '登入' }}</li>
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
        auth: '/auth',
        medal: '/medal',
        prize: '/prize',
        medalLog: '/medal-log',
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
