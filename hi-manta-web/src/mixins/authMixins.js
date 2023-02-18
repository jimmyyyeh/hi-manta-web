import Cookies from 'js-cookie';

export default {
  data() {
    return {
      user: null,
      config: null,
      signInRequiredPage: ['medal', 'prize', 'medal-log'],
    };
  },
  computed: {
    isSignIn() {
      return this.user !== null;
    },
    isSignInRequired() {
      return this.signInRequiredPage.includes(this.$route.name);
    },
  },
  methods: {
    returnAuth() {
      this.$router.push('/auth');
    },
    setCookie() {
      const expireTime = (1 / 24 / 60) * 30;
      Cookies.set('hi-manta-sign-in', JSON.stringify(this.user), { expires: expireTime });
    },
    setConfig() {
      this.config = {
        headers: {
          Authorization: `Bearer ${this.user.access_token}`,
        },
      };
    },
    setAuth() {
      this.setCookie();
      this.setConfig();
    },
    removeCookie() {
      Cookies.remove('hi-manta-sign-in');
      this.$router.push('/');
    },
    async requestSignIn() {
      const url = `${process.env.VUE_APP_API}/user/sign-in`;
      const payload = {
        username: this.user.username,
        password: this.user.password,
        role: this.user.role,
      };
      try {
        const res = await this.$http.post(url, payload);
        return res;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async refresh() {
      const res = await this.requestSignIn();
      if (res && res.status === 200) {
        this.user = res.data.data;
        this.setAuth();
      } else {
        const refs = this.$refs;
        this.alert.title = '授權逾時 請重新登入';
        this.alert.message = '確認';
        this.alert.isCancelShow = false;
        this.alert.confirmFunction = this.removeCookie;
        refs.alertModal.showModal();
      }
    },
    async initAuth() {
      // const signInCookie = Cookies.get('hi-manta-sign-in');
      // TODO 先寫死

      // 切換身份為教練
      const signInCookie = JSON.stringify({
        username: 'himanta',
        password: '1234567890',
        role: 2,
      });

      // // 切換身份為學生
      // const signInCookie = JSON.stringify({
      //   username: 'jimmyyeh',
      //   password: '1234567890',
      //   role: 1,
      // });

      if (signInCookie) {
        this.user = JSON.parse(signInCookie);
        await this.refresh();
      } else {
        if (!this.isSignInRequired) {
          return;
        }
        const refs = this.$refs;
        this.alert.title = '請先登入';
        this.alert.message = '確認';
        this.alert.isCancelShow = false;
        this.alert.confirmFunction = this.returnAuth;
        refs.alertModal.showModal();
      }
    },
  },
  async mounted() {
    await this.initAuth();
    if (!this.isSignIn) {
      return;
    }
    if (this.isSignInRequired) {
      this.initData();
    }
    window.setInterval(async () => {
      await this.refresh();
    }, 60 * 3 * 1000);
  },
};
