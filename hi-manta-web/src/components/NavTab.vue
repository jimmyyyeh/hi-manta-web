<template>
  <div class="nav-bar">
    <div class="logo">
      <input type="image" class="nav-item" src="https://i.imgur.com/CxcL1Vf.jpge" alt="logo" @click="redirectPage('home')">
    </div>
    <ul class="nav">
        <li class="nav-item" :class="tabName === 'medal-log' ? 'active' : ''" @click="redirectPage('medalLog')">上傳紀錄</li>
        <li class="nav-item" :class="tabName === 'medal' ? 'active' : ''" @click="redirectPage('medal')">勳章列表</li>
        <li class="nav-item" :class="tabName === 'prize' ? 'active' : ''" @click="redirectPage('prize')">獎勵列表</li>
        <li class="nav-item" :class="tabName === 'auth' ? 'active' : ''" @click="redirectPage('auth')">{{ $parent.isSignIn ? '登出': '登入' }}</li>
      </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabName: this.$route.name.toLowerCase(),
      pathMap: {
        home: '/',
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
