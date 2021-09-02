import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const url_contacts = '/api/contacts/';
const url_login = '/api/auth/login/';

// Helpers

function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamelCase(str) {
  return str.replace(/_[a-z]/, (letter) => `${letter[1].toUpperCase()}`);
}

function getFormattedApiData(data, fromClientToServer = false) {
  const param = {};
  Object.keys(data).forEach((key) => {
    param[`${fromClientToServer ? camelToSnakeCase(key) : snakeToCamelCase(key)}`] = data[key];
  });
  return param;
}

export default new Vuex.Store({
  state: {
    status: {
      auth: '',
      contacts: '',
      contact: '',
    },
    modal: {
      show: false,
      text: '',
      title: '',
      callBack: () => {
      },
    },
    token: localStorage.getItem('token') || '',
    user: {},
    contacts: [],
    showModal: false,
  },
  mutations: {
    auth_request(state) {
      state.status.auth = 'loading';
    },
    auth_success(state, token, user) {
      state.status.auth = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status.auth = 'error';
    },
    logout(state) {
      state.status.auth = '';
      state.token = '';
    },
    contacts_request(state) {
      state.status.contacts = 'loading';
    },
    contacts_success(state, data) {
      state.status.contacts = 'success';
      state.contacts = data;
    },
    contacts_error(state) {
      state.status.contacts = 'error';
    },
    contact_request(state) {
      state.status.contact = 'loading';
    },
    contact_success(state) {
      state.status.contact = 'success';
    },
    contact_error(state) {
      state.status.contact = 'error';
    },
    modal_open(state, options) {
      state.modal.show = true;
      state.modal.callBack = options.callBack;
      state.modal.title = options.title;
      state.modal.text = options.text;
    },
    modal_close(state) {
      state.modal.show = false;
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios.post(url_login, user, { method: 'POST' })
          .then((res) => {
            const { token } = res.data;
            const userRes = res.data.user;
            localStorage.setItem('token', token);
            axios.defaults.headers.common.Authorization = token;
            commit('auth_success', token, userRes);
            resolve(res);
          })
          .catch((err) => {
            commit('auth_error');
            localStorage.removeItem('token');
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
    getContacts({ commit }) {
      return new Promise((resolve, reject) => {
        commit('contacts_request');
        axios.get(url_contacts)
          .then((res) => {
            const data = res.data.map((i) => getFormattedApiData(i));
            commit('contacts_success', data);
            resolve(data);
          })
          .catch((err) => {
            commit('contacts_error');
            reject(err);
          });
      });
    },
    addContact({ commit }, bodyParams) {
      return new Promise((resolve, reject) => {
        commit('contact_request');
        axios.post(url_contacts, getFormattedApiData(bodyParams, true))
          .then(() => {
            commit('contact_success');
            resolve();
          })
          .catch((err) => {
            commit('contact_error');
            reject(err);
          });
      });
    },
    editContact({ commit }, { bodyParams, id }) {
      return new Promise((resolve, reject) => {
        commit('contact_request');
        debugger; // eslint-disable-line no-debugger
        axios.put(`${url_contacts}${id}`, getFormattedApiData(bodyParams, true))
          .then(() => {
            commit('contact_success');
            resolve();
          })
          .catch((err) => {
            commit('contact_error');
            reject(err);
          });
      });
    },
    deleteContact({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('contact_request');
        axios.delete(`${url_contacts}${id}`)
          .then((res) => {
            commit('contact_success');
            resolve(res);
          })
          .catch((err) => {
            commit('contact_error');
            reject(err);
          });
      });
    },
    openModal({ commit }, options) {
      commit('modal_open', options);
    },
    closeModal({ commit }) {
      commit('modal_close');
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    contacts: (state) => state.contacts,
    status: (state) => state.status,
    modal: (state) => state.modal,
  },
});
