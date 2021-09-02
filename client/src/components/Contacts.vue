<template>
  <div class="contacts-wrapper blurred faded" :class="{'blur': loading , 'fade': loading}">
    <div class="contacts">
      <div v-for="(contact, idx) in contacts" :key="`${contact.Id}${idx}`" class="test">
        <div class="contact">
          <h4>{{ contact.firstName }} {{ contact.secondName }}</h4>
          <p class="small">{{ contact.userName }}</p>
          <p>Телефон: {{ contact.phone }}</p>
          <p>Email: {{ contact.email }}</p>
          <div class="description">
            <p v-for="(field, idx) in contact.additionalInfo" :key="`${contact.Id}${idx}`">
              {{ field.key }} :
              {{ field.value }}</p>
          </div>
          <div class="panel">
            <button @click="edit(contact.Id)" class="primary">Редактировать</button>
            <button @click="confirmDelete(contact.Id)" class="danger">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Contacts',
  async created() {
    this.loading = true;
    if (this.$store.getters.contacts.length === 0) await this.load();
    setTimeout(() => {
      this.loading = false;
    }, 1);
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    contacts() {
      return this.$store.getters.contacts;
    },
    error() {
      return this.$store.getters.status.contacts === 'error';
    },
  },
  methods: {
    async load() {
      await this.$store.dispatch('getContacts');
    },
    confirmDelete(id) {
      this.$store.dispatch(
        'openModal',
        {
          text: 'Вы уверены, что хотите удалить этот контакт?',
          title: 'Подтвердите удаление',
          callBack: () => this.delete(id),
        },
      );
    },
    async delete(id) {
      this.loading = true;
      await this.$store.dispatch('deleteContact', id).then(() => this.$store.dispatch('closeModal'));
      await this.load();
      this.loading = false;
    },
    edit(id) {
      this.$router.push(`/contact/${id}`);
    },
  },
};
</script>
<style scoped lang="less">
.contacts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  padding: 40px 16px;

  .contact {
    display: grid;
    grid-template: repeat(4, auto) 100px auto / auto;
    padding: 24px;
    justify-items: flex-start;
    border: 1px solid black;
    border-radius: 6px;
    text-align: left;

    .small {
      font-size: 10px;
      margin-bottom: 10px;
    }

    .description {
      overflow-y: auto;
      margin-bottom: 5px;
    }

    .panel {
      width: 100%;
      display: flex;
      justify-content: space-between;

      & > button:first-child {
        margin-right: 8px;
      }
    }
  }
}

</style>
