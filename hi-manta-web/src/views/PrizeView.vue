<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/CxcL1Vf.jpge"
           data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap" v-show="isSignIn">
    <div class="overlay" v-show="isLoading">
      <div class="spinner-grow"></div>
    </div>
    <div class="container" v-show="!isLoading">
      <div class="prize-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">敘述</th>
            <th scope="col">備註說明</th>
            <th scope="col">類別</th>
            <th scope="col">是否開放</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(prize, index) in prizes" :key="index">
            <td> {{ prize.title }}</td>
            <td> {{ prize.description }}</td>
            <td> {{ prize.remark }}</td>
            <td> {{ prize.type }}</td>
            <td> {{ prize.is_enable ? '是': '否' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getPrizes" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import PaginateComponent from '@/components/PaginateComponent.vue';
import { formatUrl, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  components: {
    PaginateComponent,
  },
  data() {
    return {
      pager: {
        page: 1,
        per_page: 10,
        pages: 1,
        total: 1,
      },
      isLoading: false,
      prizes: [],
      filter: {},
    };
  },
  watch: {
    filter: {
      handler() {
        this.getPrizes();
      },
      deep: true,
    },
  },
  methods: {
    returnHome() {
      this.$router.push('/');
    },
    getPrizes(page, isAppend) {
      let url = `${process.env.VUE_APP_API}/prize`;
      const queryFilter = { ...this.filter };
      queryFilter.page = page;
      url = formatUrl(url, queryFilter);
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            if (isAppend) {
              this.prizes = this.prizes.concat(res.data.data);
            } else {
              this.prizes = res.data.data;
            }
            this.pager = res.data.pager;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    initData() {
      this.getPrizes();
    },
  },
  updated() {
    initToolTip();
  },
  mounted() {
  },
};
</script>
