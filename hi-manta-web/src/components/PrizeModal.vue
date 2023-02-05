<template>
  <div class="modal fade" id="prize-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h6>新增獎品</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="prize-form">
            <div class="title column">
              <div class="input">
                <label class="selector-label" for="title">名稱:</label>
                <input type="text" id="title" v-model="prize.title">
              </div>
            </div>
            <div class="description column">
              <div class="input">
                <label class="selector-label" for="description">敘述:</label>
                <input type="text" id="description" v-model="prize.description">
              </div>
            </div>
            <div class="point column">
              <div class="input">
                <label class="selector-label" for="description">所需積分:</label>
                <input type="number" id="description" v-model="prize.point" :readonly="isEdit">
              </div>
            </div>
            <div class="remark column">
              <div class="input">
                <label class="selector-label" for="remark">備註:</label>
                <input type="text" id="remark" v-model="prize.remark">
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
          <button v-if="isValidate && isEdit" class="default-button" @click="updatePrize">送出</button>
          <button v-else-if="isValidate && !isEdit" class="default-button" @click="createPrize">送出</button>
          <button v-else class="default-button" disabled>送出</button>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>

<script>
import { PrizeType } from '@/assets/constant/constant';
import modalMixins from '@/mixins/modalMixins';
import { initToolTip } from '@/utils/tools';

export default {
  mixins: [modalMixins],
  props: ['config', 'selectedPrize', 'isEdit'],
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: true,
        confirmFunction: (() => {}),
      },
      prize: {},
      initPrize: {
        title: null,
        description: null,
        point: '',
        remark: '',
        type: '請選擇',
      },
      types: PrizeType,
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
    selectedPrize: {
      handler() {
        if (this.selectedPrize) {
          this.prize = { ...this.selectedPrize };
          this.typeIndex = this.prize.type;
        }
      },
      deep: true,
    },
    prize: {
      handler() {
        this.validateMap.title = this.prize.title !== null;
        this.validateMap.description = this.prize.description !== null;
      },
      deep: true,
    },
    typeIndex(value) {
      if (value === 0) {
        this.prize.type = null;
      } else {
        this.prize.type = value;
        this.validateMap.type = true;
      }
    },
  },
  methods: {
    resetPrize() {
      this.prize = { ...this.intiPrize };
      this.$parent.getPrizes();
    },
    createPrize() {
      const url = `${process.env.VUE_APP_API}/prize`;
      this.$http.post(url, this.prize, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '儲存獎品成功';
            this.$parent.alert.confirmFunction = this.resetPrize;
            this.hideModal();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '儲存獎品失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    updatePrize() {
      const url = `${process.env.VUE_APP_API}/prize/${this.prize.id}`;
      const payload = {
        title: this.prize.title,
        description: this.prize.description,
        remark: this.prize.remark,
        type: this.prize.type,
      };
      this.$http.put(url, payload, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新獎品成功';
            this.$parent.alert.confirmFunction = this.resetPrize;
            this.hideModal();
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '更新獎品失敗 請重新操作';
            refs.alertModal.showModal();
          }
        });
    },
    confirmCreateTrip() {
      this.hideModal();
      const refs = this.$parent.$refs;
      this.$parent.alert.title = '新增獎品';
      this.$parent.alert.message = '確定要新增獎品嗎';
      this.$parent.alert.confirmFunction = this.createPrize;
      refs.confirmModal.showModal();
    },
  },
  created() {
    this.prize = { ...this.initPrize };
  },
  updated() {
    initToolTip();
  },
};
</script>
