<template>
    <div class="page page-index">
        <header-component></header-component>
        <div class="container">
            <div class="jumbotron">
                <h1>Welcome,</h1>
                <h2>we are <strong>the largest</strong> proxy database in the internet!</h2>
                <p>
                    In our database we have more than 3.5kk addresses and over 200k addresses marked as online
                    at least once.
                    <br/>
                    Check out our list and feel free to register to get even more options!
                </p>
                <p>
                    <router-link to="/servers">
                        <a href="#" class="btn btn-default btn-lg">
                            <i class="fa fa-server"></i>
                            Go to proxy list
                        </a>
                    </router-link>
                </p>
            </div>
            <div class="row flex-parent">
                <news-component></news-component>
                <promo-box-component></promo-box-component>
            </div>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
  import HeaderComponent from '../partials/Header.vue'
  import FooterComponent from '../partials/Footer.vue'
  import NewsComponent from '../partials/News.vue'
  import PromoBoxComponent from '../partials/PromoBox.vue'

  export default {
    components: {
      'header-component': HeaderComponent,
      'footer-component': FooterComponent,
      'news-component': NewsComponent,
      'promo-box-component': PromoBoxComponent
    },
    name: 'home'
  }
</script>

<style scoped>

</style>
