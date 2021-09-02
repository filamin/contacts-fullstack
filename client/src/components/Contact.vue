<template>
  <div class="contact-wrapper blurred faded" :class="{'blur': loading, 'fade': loading}">
    <form class="contact" @submit.prevent="formSubmit">
      <h1>{{ title || 'Филлер' }} контакт</h1>
      <div class="field">
        <label>Имя пользователя</label>
        <input required v-model="userName" placeholder="Введите имя пользователя"/>
      </div>
      <div class="field">
        <label>Имя</label>
        <input required v-model="firstName" placeholder="Введите имя"/>
      </div>
      <div class="field">
        <label>Фамиля</label>
        <input required v-model="secondName" placeholder="Введите фамилию"/>
      </div>
      <div class="field">
        <label>Телефон</label>
        <input required v-model="phone" type="tel" placeholder="Введите номер телефона"/>
      </div>
      <div class="field">
        <label>Email</label>
        <input required v-model="email" type="email" placeholder="Введите email"/>
      </div>
      <div class="additional-field">
        <transition-group tag="div" name="list-complete" mode="in-out">
          <div class="row list-complete-item" v-for="(field, idx) in additionalInfo"
               :key="field.id">
            <input required v-model="field.key" class="key" placeholder="Ключ"/>
            <input required v-model="field.value" class="value" placeholder="Значение"/>
            <button type="button" class="danger" @click="confirmDelete(idx)">Удалить</button>
            <button type="button" @click="confirmCancel(idx)">Отмена</button>
          </div>
        </transition-group>
        <button type="button" class="primary" @click="addField">Добавить поле</button>
      </div>
      <hr>
      <div class="panel">
        <button type="submit" class="primary left">{{
            isEdit ? 'Редактировать' : 'Добавить'
          }}
        </button>
        <button @click="$router.push('/contacts')">На главную</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  created() {
    this.title = this.contactId ? 'Редаетировать' : 'Добавить';
  },
  // Problem with shorthand - lost context of component
  async mounted() {
    if (this.contactId && !this.currentContact) {
      await this.$store.dispatch('getContacts').then(() => {
        this.loading = false;
      });
    }
    setTimeout(() => {
      this.loading = false;
    }, 1);
  },
  data() {
    return {
      title: '',
      userName: '',
      firstName: '',
      secondName: '',
      phone: '',
      email: '',
      additionalInfo: [],
      loading: true,
      isEdit: false,
    };
  },
  computed: {
    contactId() {
      return this.$route.params.id;
    },
    currentContact() {
      return this.$store.getters.contacts.find((contact) => contact.Id === this.contactId);
    },
  },
  watch: {
    currentContact: {
      immediate: true,
      deep: true,
      handler(val) {
        this.isEdit = val;
        this.title = val ? 'Редактировать' : 'Добавить';
        this.userName = val?.userName || '';
        this.firstName = val?.firstName || '';
        this.secondName = val?.secondName || '';
        this.phone = val?.phone || '';
        this.email = val?.email || '';
        this.additionalInfo = val?.additionalInfo.map((i) => ({
          id: this.generateRandomString(),
          key: i.key,
          value: i.value,
        })) || [];
      },
    },
    contactId: {
      handler() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 200);
      },
    },
  },
  methods: {
    generateRandomString() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    // Problem with shorthand - lost context of component
    async formSubmit() {
      event.preventDefault();
      const bodyParams = {
        userName: this.userName,
        firstName: this.firstName,
        secondName: this.secondName,
        phone: this.phone,
        email: this.email,
        additionalInfo: this.additionalInfo.map((i) => ({key: i.key, value: i.value})),
      };
      this.loading = true;
      if (this.isEdit) {
        await this.$store.dispatch('editContact', {
          bodyParams,
          id: this.contactId
        }).then(this.formCallback);
      } else {
        await this.$store.dispatch('addContact', bodyParams).then(this.formCallback);
      }
    },
    async formCallback() {
      await this.$store.dispatch('getContacts').then(() => (
        this.$router.push('/contacts')
      ));
    },
    getCurrentField(idx) {
      return this.currentContact && this.currentContact.additionalInfo[idx];
    },
    fieldIsNotEmpty(idx) {
      return this.additionalInfo[idx].key !== '' || this.additionalInfo[idx].value !== '';
    },
    confirmDelete(idx) {
      const callBack = () => {
        this.deleteField(idx);
        this.$store.dispatch('closeModal');
      };
      if (this.getCurrentField(idx) || this.fieldIsNotEmpty(idx)) {
        this.$store.dispatch(
          'openModal',
          {
            text: 'Вы уверены, что хотите удалить этот поле?',
            title: 'Подтвердите удаление',
            callBack
          },
        );
      } else {
        this.deleteField(idx);
      }
    },
    confirmCancel(idx) {
      const callBack = () => {
        this.resetField(idx);
        this.$store.dispatch('closeModal');
      };
      if (this.getCurrentField(idx) || this.fieldIsNotEmpty(idx)) {
        this.$store.dispatch(
          'openModal',
          {
            text: 'Вы уверены, что хотите вернуть это поле к исходному зачению?',
            title: 'Подтвердите удаление',
            callBack,
          },
        );
      }
    },
    addField() {
      this.additionalInfo.push({key: '', value: '', id: this.generateRandomString()});
    },
    deleteField(idx) {
      this.additionalInfo.splice(idx, 1);
    },
    resetField(idx) {
      // Most complex for understanding)
      const currentField = this.getCurrentField(idx);
      const replacedKey = currentField?.key ?? '';
      const replacedValue = currentField?.value ?? '';
      this.additionalInfo[idx].key = replacedKey;
      this.additionalInfo[idx].value = replacedValue;
    },
  },
};
</script>

<style scoped lang="less">
.contact-wrapper {
  padding: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.faded {
    &.fade {
      opacity: 0.1;
    }
  }

  .contact {
    width: 500px;

    h1 {
      margin-bottom: 20px;
    }

    .field {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      label {
        width: 200px;
        text-align: left;
      }

      input,
      textarea {
        width: 300px;
      }
    }

    .additional-field {
      display: flex;
      flex-direction: column;

      .list-complete-item {
        transition: all .4s ease-in;
      }

      .list-complete-enter, .list-complete-leave-to {
        filter: blur(10px);
        transform: scaleY(0);
      }

      .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .key {
          width: 190px;
          margin-right: 10px;
        }

        .value {
          width: 145px;
          margin-right: 10px;
        }

        button {
          height: 36px;

          &.danger {
            margin-right: 10px;
          }
        }
      }

      & > button {
        width: 150px;
      }
    }

    .panel {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
