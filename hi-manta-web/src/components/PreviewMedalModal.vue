<template>
  <div class="modal fade" id="preview-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="title">
          <h6>{{ title }}</h6>
        </div>
        <div class="preview-image">
          <img src="https://image.agentm.tw/images/artist/d5f397d5-444f-4e9d-93e3-ead59f25f964.jpg" alt="preview" v-if="this.media_type === 1"/>
          <video controls src="https://brush-go.tesla-trip.cc/video/1_1.mp4" v-else>
            <track default kind="captions" srclang="en">
          </video>
        </div>
        <div class="modal-footer">
          <div class="button-group">
            <button class="default-button" @click="confirm" v-show="!$parent.isStudent"> {{ confirmText }} </button>
            <button class="default-button" @click="cancel"> {{ cancelText }} </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from '@/mixins/modalMixins';

export default {
  mixins: [modalMixins],
  props: {
    config: {
      type: Object,
      default: null,
    },
    medal_log_id: {
      type: Number,
      default: null,
    },
    issuer_id: {
      type: Number,
      default: null,
    },
    media_type: {
      type: Number,
      default: 1,
    },
    title: String,
    message: String,
    confirmFunction: {
      type: Function,
      default: (() => {}),
    },
    cancelFunction: {
      type: Function,
      default: (() => {}),
    },
    confirmText: {
      type: String,
      default: '審核',
    },
    cancelText: {
      type: String,
      default: '關閉',
    },
  },
  methods: {
    issueMedal() {
      const url = `${process.env.VUE_APP_API}/medal/log/${this.medal_log_id}`;
      this.$http.put(url, null, this.config)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$parent.$refs;
            this.$parent.alert.title = null;
            this.$parent.alert.message = '審核成功';
            refs.alertModal.showModal();
            this.$parent.getMedalLogs();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
          }
        });
    },
    confirm() {
      this.issueMedal();
      this.hideModal();
    },
    cancel() {
      this.cancelFunction();
      this.hideModal();
    },
  },
};
</script>
