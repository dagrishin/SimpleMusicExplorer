'use strict';
import apiStatusList from "@/store/apiStatusList";

export default {
  actions: {
    getUser(ctx) {
      if (ctx.getters.isToken) {
        ctx.commit('updateGetUserApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/me/`, {
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 200:
              case 401:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (Object.keys(data).includes('detail')) {
              localStorage.removeItem('token');
              ctx.commit('updateSignInApiStatus', apiStatusList.INIT);
              ctx.commit('updateShowSignInModal', true);
              ctx.commit('updateTokenStatus', false);

              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            } else {
              ctx.commit('updateGetUserApiStatus', apiStatusList.LOADED);
              ctx.commit('updateUser', data);
            }
          })
          .catch(error => {
            ctx.commit('updateGetUserApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateGetUserApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    patchUser(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updatePatchUserApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/me/`, {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 200:
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (Object.values(data).some(value => Array.isArray(value))) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            } else {
              ctx.commit('updatePatchUserApiStatus', apiStatusList.LOADED);

            }
          })
          .catch(error => {
            ctx.commit('updatePatchUserApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updatePatchUserApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    deleteUser(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updateDeleteUserApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/me/`, {
          method: 'DELETE',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 204:
                ctx.commit('updateDeleteUserApiStatus', apiStatusList.LOADED);
                localStorage.removeItem('token');
                ctx.commit('updateTokenStatus', false);
                ctx.commit('updateUser', {});
                break;
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (data) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            }
          })
          .catch(error => {
            ctx.commit('updateDeleteUserApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateDeleteUserApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    resetUsername(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updateResetUsernameApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/reset_username/`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 204:
                ctx.commit('updateResetUsernameApiStatus', apiStatusList.LOADED);
                break;
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (data) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            }
          })
          .catch(error => {
            ctx.commit('updateResetUsernameApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateResetUsernameApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    resetUsernameConfirm(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updateResetUsernameConfirmApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/reset_username_confirm/`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            let user = null;

            switch (response.status) {
              case 204:
                ctx.commit('updateResetUsernameConfirmApiStatus', apiStatusList.LOADED);
                user = ctx.getters.user;
                user['username'] = data.new_username
                ctx.commit('updateUser', user);
                break;
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (data) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            }
          })
          .catch(error => {
            ctx.commit('updateResetUsernameConfirmApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateResetUsernameConfirmApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    resetPassword(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updateResetPasswordApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/reset_password/`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 204:
                ctx.commit('updateResetPasswordApiStatus', apiStatusList.LOADED);
                break;
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (data) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            }
          })
          .catch(error => {
            ctx.commit('updateResetPasswordApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateResetPasswordApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

    resetPasswordConfirm(ctx, data) {
      if (ctx.getters.isToken) {
        ctx.commit('updateResetPasswordConfirmApiStatus', apiStatusList.LOADING);

        fetch(`${ctx.getters.apiAuth}/users/reset_password_confirm/`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            switch (response.status) {
              case 204:
                ctx.commit('updateResetPasswordConfirmApiStatus', apiStatusList.LOADED);
                break;
              case 400:
                return response.json();
              default:
                throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .then(data => {
            if (data) {
              const error = Object.values(data).flat().join(', ');
              throw Error(error);
            }
          })
          .catch(error => {
            ctx.commit('updateResetPasswordConfirmApiStatus', apiStatusList.ERROR);
            ctx.commit('updateUserErrorMessage', error.message);
          })
      } else {
        ctx.commit('updateResetPasswordConfirmApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },

  },
  mutations: {
    updateGetUserApiStatus(state, apiStatus) {
      state.getUserApiStatus = apiStatus;
    },

    updatePatchUserApiStatus(state, apiStatus) {
      state.patchUserApiStatus = apiStatus;
    },

    updateDeleteUserApiStatus(state, apiStatus) {
      state.deleteUserApiStatus = apiStatus;
    },

    updateResetUsernameApiStatus(state, apiStatus) {
      state.resetUsernameApiStatus = apiStatus;
    },

    updateResetUsernameConfirmApiStatus(state, apiStatus) {
      state.resetUsernameConfirmApiStatus = apiStatus;
    },

    updateResetPasswordApiStatus(state, apiStatus) {
      state.resetPasswordApiStatus = apiStatus;
    },

    updateResetPasswordConfirmApiStatus(state, apiStatus) {
      state.resetPasswordConfirmApiStatus = apiStatus;
    },

    updateUser(state, user) {
      state.user = user;
    },

    updateUserErrorMessage(state, errorMessage) {
      state.userErrorMessage = errorMessage;
    },
  },
  state: {
    getUserApiStatus: apiStatusList.INIT,
    patchUserApiStatus: apiStatusList.INIT,
    deleteUserApiStatus: apiStatusList.INIT,
    resetUsernameApiStatus: apiStatusList.INIT,
    resetUsernameConfirmApiStatus: apiStatusList.INIT,
    resetPasswordApiStatus: apiStatusList.INIT,
    resetPasswordConfirmApiStatus: apiStatusList.INIT,

    user: {},
    userErrorMessage: '',
  },
  getters: {
    getUserApiStatus(state) {
      return state.getUserApiStatus;
    },

    patchUserApiStatus(state) {
      return state.patchUserApiStatus;
    },

    deleteUserApiStatus(state) {
      return state.deleteUserApiStatus;
    },

    resetUsernameApiStatus(state) {
      return state.resetUsernameApiStatus;
    },

    resetUsernameConfirmApiStatus(state) {
      return state.resetUsernameConfirmApiStatus;
    },

    resetPasswordApiStatus(state) {
      return state.resetPasswordApiStatus;
    },

    resetPasswordConfirmApiStatus(state) {
      return state.resetPasswordConfirmApiStatus;
    },

    user(state) {
      return state.user;
    },

    isUser(state) {
      return Boolean(Object.keys(state.user).length);
    },

    userErrorMsg(state) {
      return state.userErrorMessage;
    },
  },
};