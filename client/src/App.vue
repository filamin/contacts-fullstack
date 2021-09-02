<template>
  <div id="app">
    <Header/>
    <Modal/>
    <router-view/>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'App',
  components: {Modal, Header},
  created() {
    this.$http.interceptors.response.use(undefined, (err) => new Promise(function () {
      if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
        this.$store.dispatch('logout');
      }
      throw err;
    }));
  },
};
</script>

<style lang="less">
@import "styles.less";
</style>
