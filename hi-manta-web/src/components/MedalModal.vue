<template>
  <div class="modal fade" id="medal-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h6>新增獎品</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="medal-form">
            <div class="title column">
              <div class="input">
                <label class="selector-label" for="title">名稱:</label>
                <input type="text" id="title" v-model="medal.title">
              </div>
            </div>
            <div class="description column">
              <div class="input">
                <label class="selector-label" for="description">敘述:</label>
                <input type="text" id="description" v-model="medal.description">
              </div>
            </div>
            <div class="point column">
              <div class="input">
                <label class="selector-label" for="description">可得積分:</label>
                <input type="number" id="description" v-model="medal.point" :readonly="isEdit">
              </div>
            </div>
            <div class="remark column">
              <div class="input">
                <label class="selector-label" for="remark">備註:</label>
                <input type="text" id="remark" v-model="medal.remark">
              </div>
            </div>
            <div class="type-selector selector column">
              <div class="input">
                <label class="selector-label" for="types">分類:</label>
                <select name="types" id="types" v-model="typeIndex">
                  <option v-for="(key, value) in types" :key="key" :value="value">
                    {{ key }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="isValidate && isEdit" class="default-button" @click="updateMedal">送出</button>
          <button v-else-if="isValidate && !isEdit" class="default-button" @click="createMedal">送出</button>
          <button v-else class="default-button" disabled>送出</button>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { MedalType } from '@/assets/constant/constant';
import modalMixins from '@/mixins/modalMixins';
import { initToolTip } from '@/utils/tools';

export default {
  mixins: [modalMixins],
  props: ['config', 'selectedMedal', 'isEdit'],
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: true,
        confirmFunction: (() => {}),
      },
      medal: {},
      initMedal: {
        title: null,
        description: null,
        point: 1,
        remark: '',
        type: '請選擇',
      },
      types: MedalType,
      typeIndex: 0,
      validateMap: {
        title: false,
        description: false,
        type: false,
      },
    };
  },
  computed: {
    isValidate() {
      return !Object.values(this.validateMap).includes(false);
    },
  },
  watch: {
    selectedMedal: {
      handler() {
        if (this.selectedMedal) {
          this.medal = { ...this.selectedMedal };
          this.typeIndex = this.medal.type;
        }
      },
      deep: true,
    },
    medal: {
      handler() {
        this.validateMap.title = this.medal.title !== null;
        this.validateMap.description = this.medal.description !== null;
      },
      deep: true,
    },
    typeIndex(value) {
      if (value === 0) {
        this.medal.type = null;
      } else {
        this.medal.type = value;
        this.validateMap.type = true;
      }
    },
  },
  methods: {
    resetMedal() {
      this.medal = { ...this.initMedal };
      this.$parent.getMedals();
    },
    createMedal() {
      const url = `${process.env.VUE_APP_API}/medal`;
      this.$http.post(url, this.medal, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '新增勳章成功';
            this.$parent.alert.confirmFunction = this.resetMedal;
            this.hideModal();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '新增勳章失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    updateMedal() {
      const url = `${process.env.VUE_APP_API}/medal/${this.medal.id}`;
      const payload = {
        title: this.medal.title,
        description: this.medal.description,
        remark: this.medal.remark,
        type: this.medal.type,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新勳章成功';
            this.$parent.alert.confirmFunction = this.resetMedal;
            this.hideModal();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新勳章失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    confirmCreateTrip() {
      this.hideModal();
      const refs = this.$parent.$refs;
      this.$parent.alert.title = '新增勳章';
      this.$parent.alert.message = '確定要新增勳章嗎';
      this.$parent.alert.confirmFunction = this.createMedal;
      refs.confirmModal.showModal();
    },
  },
  created() {
    this.medal = { ...this.initMedal };
  },
  updated() {
    initToolTip();
  },
};
</script>
