<template>
    <div class="page page-account">
        <header-component></header-component>
        <div class="container">
            <div class="row">
                <login-component></login-component>
                <register-component></register-component>
            </div>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
  import HeaderComponent from '../partials/Header.vue'
  import FooterComponent from '../partials/Footer.vue'
  import LoginComponent from '../partials/Login.vue'
  import RegisterComponent from '../partials/Register.vue'

  export default {
    components: {
      'header-component': HeaderComponent,
      'footer-component': FooterComponent,
      'login-component': LoginComponent,
      'register-component': RegisterComponent
    },
    name: 'account-component'
  }
</script>

<style scoped>

</style>
