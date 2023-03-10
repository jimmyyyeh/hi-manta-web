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
        <div class="selector-group">
          <div class="is-medal-verified-selector selector">
            <label class="selector-label">已認證:</label>
            <div class="radio-group">
              <input type="radio" name="is-medal-verified" value="1" v-model="filter.is_issued"/>
              <label class="radio-label">是</label>
              <input type="radio" name="is-medal-verified" value="0" v-model="filter.is_issued"/>
              <label class="radio-label">否</label>
            </div>
          </div>
          <div class="student-selector" v-show="!isStudent">
            <div class="input">
              <label class="selector-label" for="title">學員:</label>
              <input type="text" id="title" v-model="filter.student">
            </div>
          </div>
          </div>
      </div>
      <div class="medal-log-list">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">學員名稱</th>
            <th scope="col">勳章</th>
            <th scope="col">已認證</th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(medalLog, index) in medalLogs" :key="index">
            <td> {{ medalLog.username }}</td>
            <td> {{ medalLog.medal_title }} </td>
            <td> {{ medalLog.is_issued ? '是' : '否' }} </td>
            <td>
              <button class="image-button" @click="previewMedia(medalLog)">
                <img
                  src="https://i.imgur.com/xA3iuKb.png" alt="preview"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getMedalLogs" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <PreviewMedalModal ref="previewMedalModal" :issuer_id="previewMedalLog.issuer_id"
              :medal_log_id="previewMedalLog.medal_log_id" :media_type="previewMedalLog.media_type" :config="config"></PreviewMedalModal>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { RoleType } from '@/assets/constant/constant';
import authMixins from '@/mixins/authMixins';
import pageMixins from '@/mixins/pageMixins';
import PaginateComponent from '@/components/PaginateComponent.vue';
import PreviewMedalModal from '@/components/PreviewMedalModal.vue';
import { formatUrl, initToolTip } from '@/utils/tools';

export default {
  mixins: [authMixins, pageMixins],
  components: {
    PaginateComponent, PreviewMedalModal,
  },
  data() {
    return {
      isStudent: true,
      pager: {
        page: 1,
        per_page: 10,
        pages: 1,
        total: 1,
      },
      isLoading: false,
      filter: {},
      medalLogs: [],
      previewMedalLog: {
        medal_log_id: null,
        issuer_id: null,
        media_type: null,
      },
    };
  },
  watch: {
    filter: {
      handler() {
        this.getMedalLogs();
      },
      deep: true,
    },
  },
  methods: {
    returnHome() {
      this.$router.push('/');
    },
    initData() {
      this.getMedalLogs();
    },
    getMedalLogs(page, isAppend) {
      let url = `${process.env.VUE_APP_API}/medal/log/`;
      const queryFilter = { ...this.filter };
      queryFilter.page = page;
      url = formatUrl(url, queryFilter);
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            if (isAppend) {
              this.medalLogs = this.medals.concat(res.data.data);
            } else {
              this.medalLogs = res.data.data;
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
    previewMedia(medalLog) {
      const refs = this.$refs;
      this.previewMedalLog.medal_log_id = medalLog.id;
      this.previewMedalLog.media_type = medalLog.media_type;
      this.previewMedalLog.issuer_id = this.user.id;
      refs.previewMedalModal.showModal();
    },
  },
  updated() {
    initToolTip();
  },
  mounted() {
    this.isStudent = this.user.role === RoleType.student;
  },
};
</script>
