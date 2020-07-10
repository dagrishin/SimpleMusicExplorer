'use strict';
import apiStatusList from "@/store/apiStatusList";

export default {
  actions: {
    getTokenFromLocalStorage(ctx) {
      const token = localStorage.getItem('token');
      if (token) {
        ctx.commit('updateTokenStatus', true);
      }
    },

    signUp(ctx, data) {
      ctx.commit('updateSignUpApiStatus', apiStatusList.LOADING);

      fetch(`${ctx.getters.apiAuth}/users/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        }
      })
        .then(response => {
          switch (response.status) {
            case 201:
              ctx.commit('updateSignUpApiStatus', apiStatusList.LOADED);
              ctx.commit('updateShowSignUpModal', false);
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
          ctx.commit('updateSignUpApiStatus', apiStatusList.ERROR);
          ctx.commit('updateAuthErrorMessage', error.message);
        });
    },

    activate(ctx, data) {
      ctx.commit('updateActivateApiStatus', apiStatusList.LOADING);

      fetch(`${ctx.getters.apiAuth}/users/activation/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        }
      })
        .then(response => {
          switch (response.status) {
            case 204:
              ctx.commit('updateActivateApiStatus', apiStatusList.LOADED);
              break;
            case 400:
            case 403:
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
          ctx.commit('updateActivateApiStatus', apiStatusList.ERROR);
          ctx.commit('updateAuthErrorMessage', error.message);
        });
    },

    resendActivation(ctx, data) {
      fetch(`${ctx.getters.apiAuth}/users/resend_activation/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          switch (response.status) {
            case 204:
              ctx.commit('updateResendActivationApiStatus', apiStatusList.LOADED);
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
          ctx.commit('updateResendActivationApiStatus', apiStatusList.ERROR);
          ctx.commit('updateUserErrorMessage', error.message);
        })
    },

    signIn(ctx, data) {
      ctx.commit('updateSignInApiStatus', apiStatusList.LOADING);

      fetch(`${ctx.getters.apiAuth}/token/login/`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        }
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
          if (!Object.keys(data).includes('auth_token')) {
            const error = Object.values(data).flat().join(', ');
            throw Error(error);
          } else {
            const token = data['auth_token'];
            localStorage.setItem('token', `Token ${token}`);
            ctx.commit('updateSignInApiStatus', apiStatusList.LOADED);
            ctx.commit('updateShowSignInModal', false);
            ctx.commit('updateTokenStatus', true);

            ctx.dispatch('getUser');
          }
        })
        .catch(error => {
          ctx.commit('updateSignInApiStatus', apiStatusList.ERROR);
          ctx.commit('updateAuthErrorMessage', error.message);
        });
    },

    signOut(ctx) {
      ctx.commit('updateSignOutApiStatus', apiStatusList.LOADING);

      if (ctx.getters.isToken) {
        fetch(`${ctx.getters.apiAuth}/token/logout/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        })
          .then(response => {
            if (response.status === 204) {
              localStorage.removeItem('token');
              ctx.commit('updateSignOutApiStatus', apiStatusList.LOADED);
              ctx.commit('updateShowSignInModal', true);
              ctx.commit('updateShowSignUpModal', true);
              ctx.commit('updateTokenStatus', false);
              ctx.commit('updateUser', {});
            } else {
              throw Error(`${response.status}: ${response.statusText}`);
            }
          })
          .catch(error => {
            ctx.commit('updateSignOutApiStatus', apiStatusList.ERROR);
            ctx.commit('updateAuthErrorMessage', error.message);
          });
      } else {
        ctx.commit('updateSignOutApiStatus', apiStatusList.ERROR);
        ctx.commit('updateAuthErrorMessage', 'Token is not exists.');
      }
    },
  },
  mutations: {
    updateSignUpApiStatus(state, apiStatus) {
      state.signUpApiStatus = apiStatus;
    },

    updateActivateApiStatus(state, apiStatus) {
      state.activateApiStatus = apiStatus;
    },

    updateResendActivationApiStatus(state, apiStatus) {
      state.resendActivationApiStatus = apiStatus;
    },

    updateSignInApiStatus(state, apiStatus) {
      state.signInApiStatus = apiStatus;
    },

    updateSignOutApiStatus(state, apiStatus) {
      state.signOutApiStatus = apiStatus;
    },

    updateShowSignInModal(state, showStatus) {
      state.showSignInModal = showStatus;
    },

    updateShowSignUpModal(state, showStatus) {
      state.showSignUpModal = showStatus;
    },

    updateTokenStatus(state, tokenStatus) {
      state.isToken = tokenStatus;
    },

    updateAuthErrorMessage(state, errorMessage) {
      state.authErrorMessage = errorMessage;
    },
  },
  state: {
    signUpApiStatus: apiStatusList.INIT,
    activateApiStatus: apiStatusList.INIT,
    resendActivationApiStatus: apiStatusList.INIT,
    signInApiStatus: apiStatusList.INIT,
    signOutApiStatus: apiStatusList.INIT,

    showSignInModal: true,
    showSignUpModal: true,

    isToken: false,
    authErrorMessage: '',
  },
  getters: {
    signUpApiStatus(state) {
      return state.signUpApiStatus;
    },

    activateApiStatus(state) {
      return state.activateApiStatus;
    },

    resendActivationApiStatus(state) {
      return state.resendActivationApiStatus;
    },

    signInApiStatus(state) {
      return state.signInApiStatus;
    },

    signOutApiStatus(state) {
      return state.signOutApiStatus;
    },

    showSignInModal(state) {
      return state.showSignInModal;
    },

    showSignUpModal(state) {
      return state.showSignUpModal;
    },

    isToken(state) {
      return state.isToken;
    },

    authErrorMsg(state) {
      return state.authErrorMessage;
    },
  },
};