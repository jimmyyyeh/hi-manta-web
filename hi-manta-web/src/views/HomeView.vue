<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/CxcL1Vf.jpge"
           data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container home-container">
      <div class="content">
        <div class="display">
          <img src="https://i.imgur.com/yD3R2j3.jpg" alt="background">
          <div class="description">
            <h1>“Freediving is not only sport, it's a way to understand who we are.”</h1>
            <br>
            <h2>Natalia Molchanova</h2>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="icons">
          <button class="image-button" @click="openSocialMedia('facebook')">
            <img src="https://i.imgur.com/pgpjriB.png" alt="facebook">
          </button>
          <button class="image-button" @click="openSocialMedia('instagram')">
            <img src="https://i.imgur.com/HhJMv80.png" alt="instagram">
          </button>
          <!-- <button class="image-button" @click="sendEmail">
            <img src="https://i.imgur.com/lfvN3N6.png" alt="email">
          </button> -->
        </div>
        <div class="copyright">
          <label>Copyright © 2023 Jimmyyyeh. All rights reserved.</label>
        </div>
      </div>
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

export default {
  mixins: [authMixins, pageMixins],
  methods: {
    openSocialMedia(platform) {
      const socialMedia = {
        facebook: 'https://www.facebook.com/hi.mantafreediving',
        instagram: 'https://www.instagram.com/hi.manta',
      };
      window.open(socialMedia[platform]);
    },
    sendEmail() {
      window.location.href = 'mailto:chienfeng0719@hotmail.com';
    },
  },
};
</script>
