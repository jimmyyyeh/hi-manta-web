<template>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';

export default {
  mixins: [authMixins, pageMixins],
  data() {
    return {
      token: this.$route.params.token,
    };
  },
  methods: {
    returnHome() {
      this.$router.push('/');
    },
    redeemPrize() {
      const url = `${process.env.VUE_APP_API}/prize/approve/`;
      const payload = {
        token: this.token,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '兌換成功';
            this.alert.isCancelShow = false;
            this.alert.confirmFunction = this.returnHome;
            refs.confirmModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '兌換失敗';
            this.alert.isCancelShow = false;
            this.alert.confirmFunction = this.returnHome;
            refs.confirmModal.showModal();
          }
        });
    },
    initData() {
      this.redeemPrize();
    },
  },
};

</script>
