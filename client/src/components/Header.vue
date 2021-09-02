<template>
  <div id="nav" v-if="isLoggedIn">
    <h2 @click="toMain">Контакты</h2>
    <div class="left">
      <button class="faded" :class="{'fade': !addButtonActive}" :disabled='!addButtonActive'
              @click="toAddContact">
        Добавить
      </button>
      <button @click="logout">Выйти</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    addButtonActive() {
      return this.$route.name !== 'ContactAdd';
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login');
        });
    },
    toMain() {
      if (this.$route.name !== 'Contacts') {
        this.$router.push({path: '/contacts'});
      }
    },
    toAddContact() {
      this.$router.push({path: '/contact'});
    },
  },
};
</script>

<style scoped lang="less">
#nav {
  position: sticky;
  z-index: 2;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  background-color: white;
  border-bottom: 1px solid black;

  h2 {
    cursor: pointer;
    transition: all .1s linear;

    &:hover {
      transform: scale(1.05);
    }
  }

  .left {
    & > *:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
