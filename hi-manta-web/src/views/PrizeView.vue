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
          <button class="default-button" @click="showPrizeModal(null, False)">新增</button>
        </div>
      </div>
      <div class="prize-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">敘述</th>
            <th scope="col">備註說明</th>
            <th scope="col">類別</th>
            <th scope="col">所需積分</th>
            <th scope="col">是否開放</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(prize, index) in prizes" :key="index">
            <td> {{ prize.title }}</td>
            <td> {{ prize.description }}</td>
            <td> {{ prize.remark }}</td>
            <td> {{ convertPrizeTypeStr(prize.type) }} </td>
            <td> {{ prize.point }} </td>
            <td>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="prize-switch" :checked="prize.is_enable" aria-checked="true" @change="switchPrizeStatus(prize)">
              </div>
            </td>
            <td>
              <button class="image-button" @click="showPrizeModal(prize, true)">
                <img
                  src="https://i.imgur.com/G1Tz1pA.png" alt="edit"/>
              </button>
            </td>
            <td>
              <button class="image-button" @click="confirmDeletePrize(prize)">
                <img
                  src="https://i.imgur.com/0VX3Q3b.png" alt="delete"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getPrizes" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <PrizeModal ref="prizeModal" :selectedPrize="selectedPrize" :isEdit="isEdit" :config="config"></PrizeModal>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { PrizeType } from '@/assets/constant/constant';
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import PrizeModal from '@/components/PrizeModal.vue';
import PaginateComponent from '@/components/PaginateComponent.vue';
import { formatUrl, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  components: {
    PaginateComponent, PrizeModal,
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
      selectedPrize: null,
      isEdit: false,
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
    convertPrizeTypeStr(type) {
      return PrizeType[type];
    },
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
    deletePrize() {
      const url = `${process.env.VUE_APP_API}/prize/${this.selectedPrize.id}`;
      this.$http.delete(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '刪除獎品成功';
            this.alert.confirmFunction = this.getPrizes;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$refs;
            this.alert.title = null;
            this.alert.message = '刪除獎品失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    switchPrizeStatus(prize) {
      const url = `${process.env.VUE_APP_API}/prize/${prize.id}`;
      console.log(prize.is_enable);
      const payload = {
        is_enable: !prize.is_enable,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.getPrizes();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response);
          }
        });
    },
    confirmDeletePrize(prize) {
      const refs = this.$refs;
      this.selectedPrize = prize;
      this.alert.title = '確認刪除';
      this.alert.message = `確認要刪除 獎品: ${prize.title} 嗎?`;
      this.alert.isCancelShow = true;
      this.alert.confirmFunction = this.deletePrize;
      refs.confirmModal.showModal();
    },
    initData() {
      this.getPrizes();
    },
    showPrizeModal(selectedPrize, isEdit) {
      this.isEdit = isEdit;
      if (isEdit) {
        this.selectedPrize = selectedPrize;
      } else {
        this.selectedPrize = {};
      }
      this.isEdit = isEdit;
      const refs = this.$refs;
      refs.prizeModal.showModal();
    },
  },
  updated() {
    initToolTip();
  },
  mounted() {
  },
};
</script>
