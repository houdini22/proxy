<template>
    <div class="flex-child">
        <div class="panel panel-default panel-news">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-newspaper-o"/> News</h3>
            </div>
            <div class="panel-body">
                <ul>
                    <li>
                        <div class="clearfix">
                            <router-link to="/news/1">First production database testing started.</router-link>
                            <span class="pull-right date">2016.01.01</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'news-component',
    components: {
    }
  }
</script>

<style scoped>

</style>
