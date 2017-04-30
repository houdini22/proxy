<template>
    <div class="page page-about">
        <header-component></header-component>
        <div class="container" role="main">
            <h3 class="page-header">About</h3>
            <div class="well">
                Copyright © 2017 proxydatabase.online
            </div>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
  import HeaderComponent from '../partials/Header.vue'
  import FooterComponent from '../partials/Footer.vue'

  export default {
    components: {
      'header-component': HeaderComponent,
      'footer-component': FooterComponent
    },
    name: 'about-component'
  }
</script>

<style scoped>

</style>
