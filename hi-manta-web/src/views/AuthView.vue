<template>
  <div class="offcanvas-bar">
    <input class="offcanvas-button" type="image" src="https://i.imgur.com/um46tbY.png" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" alt="offcanvas">
  </div>
  <OffCanvas></OffCanvas>
  <NavTab></NavTab>
  <div class="wrap">
    <div class="container" v-show="!isSignIn">
      <div v-if="isRegistered" class="sign-in-form">
        <div class="field">
          <div class="username column">
            <div class="input">
              <label class="input-label" for="sign-in-username">使用者名稱:</label>
              <input type="text" id="sign-in-username" v-model="signInUser.username">
            </div>
            <div class="validate-label"
                 :style="{visibility: signInValidateMap.username ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signInValidateMsg.username"
            >
              &#9432;
            </div>
          </div>
          <div class="password column">
            <div class="input">
              <label class="input-label" for="sign-in-password">密碼:</label>
              <input type="password" id="sign-in-password" autocomplete="true"
                     v-model="signInUser.password">
            </div>
            <div class="validate-label"
                 :style="{visibility: signInValidateMap.password ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signInValidateMsg.password"
            >
              &#9432;
            </div>
          </div>
          <div class="role column">
            <div class="input">
              <label class="input-label" for="types">我是:</label>
              <select name="roles" id="roles"  v-model="signInUser.role">
                <option v-for="(role, index) in roles" :key="index" :value="index">{{ role }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="button-group">
          <button v-if="isSignInFormValidated" class="default-button" @click="signIn">登入</button>
          <button v-else class="default-button" disabled>登入</button>
          <button class="default-button" @click="isRegistered=false">註冊</button>
        </div>
      </div>
      <div v-else class="sign-up-form">
        <div class="field">
          <div class="username column">
            <div class="input">
              <label class="input-label" for="sign-up-username">使用者名稱:</label>
              <input type="text" id="sign-up-username" v-model="signUpUser.username">
            </div>
            <div class="validate-label"
                 :style="{visibility: signUpValidateMap.username ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.username"
            >
              &#9432;
            </div>
          </div>
          <div class="password column">
            <div class="input">
              <label class="input-label" for="sign-up-password">密碼:</label>
              <input type="password" id="sign-up-password" autocomplete="true"
                     v-model="signUpUser.password">
            </div>
            <div class="validate-label"
                 :style="{visibility: signUpValidateMap.password ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.password"
            >
              &#9432;
            </div>
          </div>
          <div class="confirm-password column">
            <div class="input">
            <label class="input-label" for="confirm-password">確認密碼:</label>
            <input type="password" id="confirm-password" autocomplete="true"
                   v-model="signUpUser.confirmPassword">
            </div>
            <div class="validate-label"
                 :style="{visibility: signUpValidateMap.confirmPassword ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.confirmPassword"
            >
              &#9432;
            </div>
          </div>
          <div class="nickname column">
            <div class="input">
              <label class="input-label" for="nickname">暱稱:</label>
              <input type="text" id="nickname" v-model="signUpUser.nickname">
            </div>
          </div>
          <div class="email column">
            <div class="input">
            <label class="input-label" for="sign-up-email">電子郵件:</label>
            <input type="text" id="sign-up-email" v-model="signUpUser.email">
            </div>
            <div class="validate-label"
                 :style="{visibility: signUpValidateMap.email ? 'visible' : 'hidden'}"
                 data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" :title="signUpValidateMsg.email"
            >
              &#9432;
            </div>
          </div>
          <div class="birthday column">
            <div class="input">
              <label class="input-label" for="birthday">生日:</label>
              <input type="date" id="birthday" v-model="signUpUser.birthday">
            </div>
          </div>
          <div class="sex column">
            <div class="input">
              <label class="input-label">性別:</label>
              <input class="input-radio" type="radio" name="sex" value="1" v-model="signUpUser.sex"/>
              <label class="radio-label">男</label>
              <input class="input-radio" type="radio" name="sex" value="2" v-model="signUpUser.sex"/>
              <label class="radio-label">女</label>
            </div>
          </div>
          <div class="level column">
            <div class="input">
              <label class="input-label" for="types">證照等級:</label>
              <select name="types" id="types"  v-model="signUpUser.level">
                <option v-for="(type, index) in types" :key="index" :value="index">{{ type }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="button-group">
          <button class="default-button" @click="isRegistered=true">登入</button>
          <button v-if="isSignUpFormValidated" class="default-button" @click="signUp">註冊</button>
          <button v-else class="default-button" disabled>註冊</button>
        </div>
      </div>
    </div>
  </div>
  <AlertModal ref="alertModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
  <AlertModal ref="confirmModal" :title="alert.title" :message="alert.message" :isCancelShow="alert.isCancelShow" :confirmFunction="alert.confirmFunction"></AlertModal>
</template>
<script>
import { formatDate, initToolTip } from '@/utils/tools';
import { ErrorCode, Pattern } from '@/assets/constant/constant';
import authMixins from '@/mixins/authMixins';

export default {
  mixins: [authMixins],
  data() {
    return {
      alert: {
        title: '',
        message: '',
        isCancelShow: false,
        confirmFunction: (() => {}),
      },
      isRegistered: true,
      signUpUser: {
        username: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        email: '',
        birthday: formatDate(new Date()),
        sex: 1,
        level: 1,
      },
      signUpValidateMap: {
        username: false,
        password: false,
        confirmPassword: false,
        email: false,
      },
      signInUser: {
        username: '',
        password: '',
        role: 0,
      },
      signInValidateMap: {
        username: false,
        password: false,
        role: true,
      },
      signInValidateMsg: {
        username: '請輸入使用者名稱',
        password: '請輸入密碼',
      },
      signUpValidateMsg: {
        username: '請輸入使用者名稱',
        password: '請輸入密碼',
        confirmPassword: '密碼不一致',
        email: '請輸入電子郵件',
      },
      types: ['請選擇', 'A1', 'A2', 'A3', 'A4'],
      roles: ['請選擇', '學員', '教練', '小光潔西'],
    };
  },
  watch: {
    'signInUser.username': function () {
      this.signInValidateMap.username = this.signInUser.username === '';
    },
    'signInUser.password': function () {
      this.signInValidateMap.password = this.signInUser.password === '';
    },
    'signInUser.role': function () {
      this.signInValidateMap.role = this.signInUser.role === 0;
    },
    'signUpUser.username': function () {
      this.signUpValidateMap.username = this.signUpUser.username === '';
    },
    'signUpUser.password': function () {
      this.signUpValidateMap.password = this.signUpUser.password === '';
      this.signUpValidateMap.confirmPassword = this.signUpUser.confirmPassword !== this.signUpUser.password;
    },
    'signUpUser.confirmPassword': function () {
      this.signUpValidateMap.confirmPassword = this.signUpUser.confirmPassword !== this.signUpUser.password;
    },
    'signUpUser.email': function () {
      if (this.signUpUser.email === '') {
        this.signUpValidateMsg.email = '請輸入電子郵件';
      } else if (!this.signUpUser.email.match(Pattern.EMAIL)) {
        this.signUpValidateMsg.email = '電子郵件格式不符';
      }
      this.signUpValidateMap.email = this.signUpUser.email === '' || !this.signUpUser.email.match(Pattern.EMAIL);
    },

  },
  computed: {
    isSignInFormValidated() {
      return !Object.values(this.signInValidateMap).includes(true) && !Object.values(this.signInUser).includes('');
    },
    isSignUpFormValidated() {
      return !Object.values(this.signUpValidateMap).includes(true) && !Object.values(this.signUpUser).includes('');
    },
  },
  methods: {
    returnHome() {
      this.$router.push('/');
    },
    signIn() {
      const url = `${process.env.VUE_APP_API}/user/sign-in`;
      this.$http.post(url, this.signInUser)
        .then((res) => {
          if (res.status === 200) {
            const user = res.data.data;
            if (user.is_verified) {
              this.user = res.data.data;
              this.setAuth();
              const refs = this.$refs;
              this.alert.title = null;
              this.alert.message = '登入成功';
              this.alert.confirmFunction = this.returnHome;
              refs.alertModal.showModal();
            } else {
              const refs = this.$refs;
              this.alert.title = '等待驗證';
              this.alert.message = '尚未驗證 請通知教練審核';
              this.alert.confirmFunction = (() => {});
              refs.alertModal.showModal();
            }
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            const errorCode = response.data.error_code;
            const refs = this.$refs;
            this.alert.title = '失敗';
            if (errorCode === ErrorCode.UNVERIFIED) {
              this.alert.message = '尚未驗證 請通知教練審核';
            } else {
              this.alert.message = '登入失敗 請確認登入資訊';
            }
            this.alert.confirmFunction = (() => {});
            refs.alertModal.showModal();
          }
        });
    },
    signUp() {
      const url = `${process.env.VUE_APP_API}/user/sign-up`;
      console.log(this.signUpUser);
      this.$http.post(url, this.signUpUser)
        .then((res) => {
          if (res.status === 200) {
            const refs = this.$refs;
            this.alert.title = '等待驗證';
            this.alert.message = '註冊成功 請通知教練審核';
            this.alert.confirmFunction = this.returnHome;
            refs.alertModal.showModal();
          }
        })
        .catch((error) => {
          const response = error.response;
          if (response) {
            console.log(response.data);
            const refs = this.$refs;
            this.alert.title = '失敗';
            this.alert.message = '註冊失敗 請確認使用者名稱及電子郵件是否重複';
            this.alert.confirmFunction = (() => {});
            refs.alertModal.showModal();
          }
        });
    },
    signOut() {
      const refs = this.$refs;
      this.alert.title = '登出';
      this.alert.message = '確定要登出嗎';
      this.alert.isCancelShow = true;
      this.alert.confirmFunction = this.removeCookie;
      refs.confirmModal.showModal();
    },
  },
  mounted() {
    if (this.isSignIn) {
      this.signOut();
    }
  },
  updated() {
    initToolTip();
  },
};
</script>
