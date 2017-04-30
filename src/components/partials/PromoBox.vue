<template>
    <div class="flex-child">
        <div class="panel panel-warning panel-promo">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-percent"/> Get <strong>50% off</strong> price!
                </h3>
            </div>
            <div class="panel-body">
                <div>
                    <div class="row text-center percent-row">
                        <span class="text-success"><strong>-50%</strong></span>
                    </div>
                    <div class="row text-row">
                        <h4>Soon we will provide a <strong>premium</strong> features such as:</h4>
                        <ul>
                            <li>No limit of pages</li>
                            <li>No limit of filters</li>
                            <li>Daily email notifications with last day online servers</li>
                            <li>Export any table to *.txt or CSV format!</li>
                        </ul>
                        <div class="alert alert-success"><i class="glyphicon-info-sign glyphicon"/>
                            Register right now to get 50% off for first 3 months.
                        </div>
                        <p class="btn-container">
                            <router-link to="/account" class="btn btn-xs btn-default"><i
                                    class="fa fa-sign-in"/> Register now
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'promo-box-component',
    components: {}
  }
</script>

<style scoped>

</style>
