<template>
  <div class="login-wrapper blurred faded" :class="{'blur': loading, 'fade': loading}">
    <h1>Вход</h1>
    <form class="login" @submit.prevent="login">
      <div class="field">
        <label>Логин</label>
        <input required v-model="userName" placeholder="Введите логин"/>
      </div>
      <div class="field">
        <label>Пароль</label>
        <input required v-model="password" type="password" placeholder="Введите пароль"/>
      </div>
      <hr/>
      <button type="submit" class="primary">Войти</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1);
  },
  data() {
    return {
      userName: '',
      password: '',
      loading: true,
    };
  },
  methods: {
    login() {
      const username = this.userName;
      const {password} = this;
      this.$store.dispatch('login', {username, password})
        .then(() => this.$router.push('/contacts'))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped lang="less">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    margin-bottom: 20px;
  }

  hr {
    padding-bottom: 10px;
  }

  .field {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    label {
      width: 100px;
      text-align: left;
    }

    input,
    textarea {
      width: 300px;
    }
  }
}
</style>
