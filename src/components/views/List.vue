<template>
    <div class="page page-servers">
        <header-component></header-component>
        <div class="container" role="main">
            <h3 class="page-header">Proxy List</h3>
            <statistics-component></statistics-component>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
  import HeaderComponent from '../partials/Header.vue'
  import FooterComponent from '../partials/Footer.vue'
  import StatisticsComponent from '../partials/Statistics.vue'

  export default {
    components: {
      'header-component': HeaderComponent,
      'footer-component': FooterComponent,
      'statistics-component': StatisticsComponent
    },
    name: 'list-component'
  }
</script>

<style scoped>

</style>
