<template>
  <div class="overlay" :class="{'visible': $store.getters.modal.show}">
    <div class="modal">
      <div class="modal-header">
        <h4>{{ $store.getters.modal.title }}</h4>
        <button @click="closeModal" class="danger">+</button>
      </div>
      <hr>
      <div class="modal-body">
        <h4>{{ $store.getters.modal.text }}</h4>
      </div>
      <hr>
      <div class="modal-footer">
        <button @click="confirm" class="primary">Подтвердить</button>
        <button @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  methods: {
    closeModal() {
      this.$store.dispatch('closeModal');
    },
    confirm() {
      this.$store.getters.modal.callBack();
    },
  },
};
</script>

<style scoped lang="less">
.overlay {
  position: fixed;
  z-index: 3;
  overflow-y: auto;
  top: 0;
  left: 0;
  height: 100%;
  width: 100vw;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.69);

  visibility: hidden;
  opacity: 0;
  transition: all .2s linear;

  &.visible {
    visibility: visible;
    opacity: 1;
  }
}

.modal {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 16px;

  & > * {
    width: 100%;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-weight: bold;

    button {
      padding: 0;
      width: 18px;
      height: 18px;
      line-height: 16px;
      font-size: small;
      border-radius: 50%;
      font-weight: bold;
      transform: rotate(45deg);
      transition: all linear .1s;

      &:hover {
        transform: scale(1.1) rotate(45deg) !important;
      }
    }
  }

  &-body {
    padding: 20px;
  }

  &-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-start;

    button:first-child {
      margin-right: 12px;
    }
  }
}
</style>
