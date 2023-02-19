<template>
  <div class="modal fade" id="qrcode-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="qrcode">
          <img :src="'data:image/jpeg;base64,'+ image" alt="qrcode">
        </div>
        </div>
        <div class="modal-footer">
          <div class="button-group">
            <button class="default-button" @click="cancel">關閉</button>
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
    image: String,
    cancelFunction: {
      type: Function,
      default: (() => {}),
    },
  },
  methods: {
    cancel() {
      this.cancelFunction();
      this.hideModal();
    },
  },
};
</script>
