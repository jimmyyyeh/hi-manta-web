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
          <button class="default-button" @click="showMedalModal(null, false)">新增</button>
        </div>
        <div class="selector-group">
          <div class="type-selector selector">
              <label class="selector-label" for="types">類別</label>
              <select name="types" id="types" v-model="filter.type">
                <option v-for="(type, index) in types" :key="index" :value="index">{{ type }}</option>
              </select>
          </div>
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
            <th scope="col">可得積分</th>
            <th scope="col" v-show="!this.isStudent"></th>
            <th scope="col" v-show="!this.isStudent"></th>
            <th scope="col" v-show="this.isStudent">圖片</th>
            <th scope="col" v-show="this.isStudent">影片</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(medal, index) in medals" :key="index">
            <td> {{ medal.title }}</td>
            <td> {{ medal.description }}</td>
            <td> {{ medal.remark }}</td>
            <td> {{ convertMedalTypeStr(medal.type) }}</td>
            <td> {{ medal.point }} </td>
            <td v-if="!this.isStudent">
              <button class="image-button" @click="showMedalModal(medal, true)">
                <img
                  src="https://i.imgur.com/G1Tz1pA.png" alt="edit"/>
              </button>
            </td>
            <td v-else>
              <div class="upload-image">
                  <input
                    class="upload"
                    id="upload-image-input"
                    name="upload"
                    type="file"
                    accept="image/*"
                    @change="uploadMedia"
                  />
                  <button
                    class="image-button"
                    @click="clickUpload(medal, 'image')"
                  >
                    <img src="https://i.imgur.com/NUuvWyW.png" alt="image" />
                  </button>
                </div>
            </td>
            <td v-if="!this.isStudent">
              <button class="image-button" @click="confirmDeleteMedal(medal)">
                <img
                  src="https://i.imgur.com/0VX3Q3b.png" alt="delete"/>
              </button>
            </td>
            <td v-else>
              <div class="upload-video">
                  <input
                    class="upload"
                    id="upload-video-input"
                    name="upload"
                    type="file"
                    accept="video/*"
                    @change="uploadMedia"
                  />
                  <button
                    class="image-button"
                    @click="clickUpload(medal, 'video')"
                  >
                    <img src="https://i.imgur.com/NUuvWyW.png" alt="video" />
                  </button>
                </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginateComponent :refresh-method="getMedals" :pager="pager"
                         v-show="isSignIn"></PaginateComponent>
    </div>
  </div>
  <MedalModal ref="medalModal" :selectedMedal="selectedMedal" :isEdit="isEdit" :config="config"></MedalModal>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message"
              :isCancelShow="alert.isCancelShow"
              :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { MedalType, MediaMap, MediaType, RoleType } from '@/assets/constant/constant';
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
      isStudent: true,
      pager: {
        page: 1,
        per_page: 10,
        pages: 1,
        total: 1,
      },
      isLoading: false,
      medals: [],
      filter: {
        type: 0,
      },
      selectedMedal: null,
      isEdit: false,
      mediaMedal: {
        id: null,
        file: null,
        type: null,
        typeStr: null,
      },
      types: ['請選擇', '課程等級', 'PB 紀錄', '怪奇系統', '潛點搜集'],
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
    showMedalModal(selectedMedal, isEdit) {
      this.isEdit = isEdit;
      if (isEdit) {
        this.selectedMedal = selectedMedal;
      } else {
        this.selectedMedal = {};
      }

      const refs = this.$refs;
      refs.medalModal.showModal();
    },
    clickUpload(medal, mediaTypeStr) {
      this.mediaMedal.id = medal.id;
      this.mediaMedal.typeStr = mediaTypeStr;
      this.mediaMedal.type = MediaType[mediaTypeStr];
      document.getElementById(`upload-${mediaTypeStr}-input`).click();
    },
    uploadMedia(event) {
      const input = event.target;
      if (input.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.mediaMedal.file = e.target.result; // base64
          const url = `${process.env.VUE_APP_API}/medal/${this.mediaMedal.typeStr}/${this.mediaMedal.id}`;
          const payload = {
            file: this.mediaMedal.file,
          };
          this.$http.post(url, payload, this.config)
            .then((res) => {
              if (res.status === 200) {
                const refs = this.$refs;
                this.alert.title = '上傳成功';
                this.alert.message = `${MediaMap[this.mediaMedal.type]} 上傳成功`;
                this.alert.isCancelShow = false;
                this.mediaMedal = {
                  id: null,
                  file: null,
                  type: null,
                  typeStr: null,
                };
                refs.alertModal.showModal();
              }
            })
            .catch((error) => {
              const response = error.response;
              if (response) {
                const refs = this.$refs;
                this.alert.title = '上傳成功';
                this.alert.message = `${this.mediaMedal.typeStr} 上傳失敗, 請檢查檔案`;
                this.alert.isCancelShow = false;
                refs.alertModal.showModal();
              }
            });
        };
        reader.readAsDataURL(input.files[0]);
      }
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
