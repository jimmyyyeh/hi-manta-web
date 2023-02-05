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
      <div class="filter-bar">
        <div class="button-group">
          <button class="default-button" @click="showMedalModal">新增</button>
        </div>
      </div>
      <div class="medal-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">敘述</th>
            <th scope="col">備註說明</th>
            <th scope="col">類別</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(medal, index) in medals" :key="index">
            <td> {{ medal.title }}</td>
            <td> {{ medal.description }}</td>
            <td> {{ medal.remark }}</td>
            <td> {{ convertMedalTypeStr(medal.type) }}</td>
            <td>
              <button class="image-button" @click="confirmDeleteMedal(medal)">
                <img
                  src="https://i.imgur.com/0VX3Q3b.png" alt="delete"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getMedals" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <MedalModal ref="medalModal" :config="config"></MedalModal>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { MedalType } from '@/assets/constant/constant';
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import MedalModal from '@/components/MedalModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';
import { formatUrl, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  components: {
    PaginateComponent, MedalModal,
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
      medals: [],
      filter: {},
      selectedModel: null,
    };
  },
  watch: {
    filter: {
      handler() {
        this.getMedals();
      },
      deep: true,
    },
  },
  methods: {
    convertMedalTypeStr(type) {
      return MedalType[type];
    },
    returnHome() {
      this.$router.push('/');
    },
    getMedals(page, isAppend) {
      let url = `${process.env.VUE_APP_API}/medal`;
      const queryFilter = { ...this.filter };
      queryFilter.page = page;
      url = formatUrl(url, queryFilter);
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            if (isAppend) {
              this.medals = this.medals.concat(res.data.data);
            } else {
              this.medals = res.data.data;
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
    deleteMedal() {
      const url = `${process.env.VUE_APP_API}/medal/${this.selectedMedal.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '刪除勳章成功';
            this.alert.confirmFunction = this.getMedals;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '刪除勳章失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    confirmDeleteMedal(medal) {
      const refs = this.$refs;
      this.selectedMedal = medal;
      this.alert.title = '確認刪除';
      this.alert.message = `確認要刪除 勳章: ${medal.title} 嗎?`;
      this.alert.isCancelShow = true;
      this.alert.confirmFunction = this.deleteMedal;
      refs.confirmModal.showModal();
    },
    initData() {
      this.getMedals();
    },
    showMedalModal() {
      const refs = this.$refs;
      refs.medalModal.showModal();
    },
  },
  updated() {
    initToolTip();
  },
  mounted() {
  },
};
</script>
