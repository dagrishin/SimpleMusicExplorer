<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand :to="{ name: 'Index' }" class="logo-link">
        Simple Music Explorer
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
<!--          <b-nav-form>-->
<!--            <b-form-input-->
<!--                @input="changeQuery"-->
<!--                :value="query"-->
<!--                size="sm"-->
<!--                class="mr-sm-2"-->
<!--                placeholder="Search"-->
<!--            ></b-form-input>-->
<!--            <b-button-->
<!--                @click.stop.prevent="filterAlbums"-->
<!--                size="sm"-->
<!--                class="my-2 my-sm-0"-->
<!--                type="submit"-->
<!--            >-->
<!--              Search-->
<!--            </b-button>-->
<!--          </b-nav-form>-->

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>

            <b-dropdown-item v-if="!isToken" @click="showSignUpModal">Sign Up</b-dropdown-item>
            <b-dropdown-item v-if="!isToken" @click="showSignInModal">Sign In</b-dropdown-item>
            <b-dropdown-item v-if="!isToken" @click="showResendActivationModal">Resend Activation Email</b-dropdown-item>

<!--            <b-dropdown-item :to="{ name: 'account' }" v-if="isToken">Account</b-dropdown-item>-->
            <b-dropdown-item v-if="isToken" @click="showPatchUserModal">Update user</b-dropdown-item>
            <b-dropdown-item v-if="isToken" @click="showDeleteUserModal">Delete user</b-dropdown-item>
            <b-dropdown-item v-if="isToken" @click="showResetUsernameModal">Change username</b-dropdown-item>
            <b-dropdown-item v-if="isToken" @click="showResetPasswordModal">Change password</b-dropdown-item>

            <b-dropdown-item v-if="isToken" @click="signOut">Sign Out</b-dropdown-item>

            <SignInModalForm/>
            <SignUpModalForm/>
            <PatchUserModalForm/>
            <DeleteUserModalForm/>
            <ResendActivationModalForm/>

          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  import SignInModalForm from '@/components/SignInModalForm.vue';
  import SignUpModalForm from '@/components/SignUpModalForm.vue';
  import PatchUserModalForm from '@/components/PatchUserModalForm.vue';
  import DeleteUserModalForm from '@/components/DeleteUserModalForm.vue';
  import ResendActivationModalForm from '@/components/ResendActivationModalForm.vue';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: "NavBar",
    components: {
      SignInModalForm,
      SignUpModalForm,
      PatchUserModalForm,
      DeleteUserModalForm,
      ResendActivationModalForm,
    },
    computed: mapGetters(['isToken', 'user']),
    methods: {
      ...mapActions(['signOut', 'deleteUser', 'resetUsername', 'resetPassword']),

      showSignUpModal() {
        this.$bvModal.show('modal-sign-up');
      },

      showSignInModal() {
        this.$bvModal.show('modal-sign-in');
      },

      showResendActivationModal() {
        this.$bvModal.show('modal-resend-activation');
      },

      showPatchUserModal() {
        this.$bvModal.show('modal-patch-user');
      },

      showDeleteUserModal() {
        const msg = 'Please confirm that you want to permanently delete your account.'
        this.$bvModal.msgBoxConfirm(msg, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'DELETE',
          cancelTitle: 'CANCEL',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(result => {
            if (result) {
              this.$bvModal.show('modal-delete-user');
            }
          })
      },

      showResetUsernameModal() {
        const msg = 'Please confirm that you want to reset username.'
        this.$bvModal.msgBoxConfirm(msg, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          okTitle: 'RESET',
          cancelTitle: 'CANCEL',
          footerClass: 'p-2',
          centered: true
        })
          .then(result => {
            if (result) {
              const data = {email: this.user.email}
              this.resetUsername(data);

              this.$bvModal.msgBoxOk('Please check your email', {
                buttonSize: 'sm',
                centered: true,
                size: 'sm',
              })
            }
          })
      },

      showResetPasswordModal() {
        const msg = 'Please confirm that you want to reset password.'
        this.$bvModal.msgBoxConfirm(msg, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          okTitle: 'RESET',
          cancelTitle: 'CANCEL',
          footerClass: 'p-2',
          centered: true
        })
          .then(result => {
            if (result) {
              const data = {email: this.user.email}
              this.resetPassword(data);

              this.$bvModal.msgBoxOk('Please check your email', {
                buttonSize: 'sm',
                centered: true,
                size: 'sm',
              })
            }
          })
      },
    },
  }
</script>

<style scoped>
  .logo-link:hover,
  .logo-link:active,
  .logo-link {
    text-decoration: unset;
  }

</style>