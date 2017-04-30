<template>
    <div class="row statistics-row">
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-globe"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">All servers which were online</span>
                    <span class="info-box-number">{{statistics.nb_servers_available_in_past}}</span>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-clock-o"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">Servers online within 24h</span>
                    <span class="info-box-number">{{statistics.nb_servers_available_today}}</span>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-clock-o"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">Servers online within 15min</span>
                    <span class="info-box-number">{{statistics.nb_servers_available_past_15min}}</span>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-info"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">SOCKS5 servers online</span>
                    <span class="info-box-number">{{statistics.nb_servers_socks5_online}} / <small>{{statistics.nb_servers_socks5_available}}</small></span>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-map-marker"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">Servers countries</span>
                    <span class="info-box-number">{{statistics.nb_server_countries}}</span>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-6 col-xs-6">
            <div class="info-box">
                <span class="info-box-icon bg-aqua"><i class="fa fa-map-marker"></i></span>
                <div class="info-box-content">
                    <span class="info-box-text">Servers cities</span>
                    <span class="info-box-number">{{statistics.nb_server_cities}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'statistics-component',
    components: {},
    computed: {
      statistics () {
        return this.$store.getters.statistics
      }
    },
    mounted () {
      this.$store.commit('setStatistics', {})
      this.$store.dispatch('fetchStatistics')
    }
  }
</script>

<style scoped>

</style>
