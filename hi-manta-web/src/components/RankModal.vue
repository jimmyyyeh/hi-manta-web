<template>
  <div class="modal fade" id="rank-modal" ref="modal" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h6>小海綿勳章英雄榜</h6>
        </div>
        <div class="modal-body">
          <div class="rank-list">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">名字</th>
                  <th scope="col">積分</th>
                  <th scope="col">總勳章數</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rank, index) in rankList" :key="index">
                  <td> {{ rank.username }}</td>
                  <td> {{ rank.point }}</td>
                  <td> {{ rank.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <div class="button-group">
            <button class="default-button" @click="cancel">努力潛水去</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixins from '@/mixins/modalMixins';
import authMixins from '@/mixins/authMixins';

export default {
  mixins: [authMixins, modalMixins],
  props: {
    cancelFunction: {
      type: Function,
      default: (() => {}),
    },
  },
  data() {
    return {
      rankList: [
      ],
    };
  },
  methods: {
    cancel() {
      this.cancelFunction();
      this.hideModal();
    },
    getRankList() {
      const url = `${process.env.VUE_APP_API}/medal/log/rank/`;
      this.$http.get(url, this.config)
        .then((res) => {
          if (res.status === 200) {
            this.rankList = res.data.data;
          }
        })
        .catch((error) => {
          const response = error.response;
          console.log(response.data);
        });
    },
  },
  mounted() {
    this.getRankList();
  },
};
</script>
