<template>
    <div class="page page-profile">
        <header-component></header-component>
        <div class="container" role="main">
            <h3 class="page-header">Profile</h3>
            <div class="well">
                Profile
            </div>
        </div>
        <div class="container" v-if="hasUserImportPermission">
            <div class="panel panel-default panel-import">
                <div class="panel-heading">
                    <h3 class="panel-title"><i class="fa fa-upload"/> Import</h3>
                </div>
                <div class="panel-body">
                    <vue-form :state="formState" @submit.prevent="handleFormSubmit" class="form-horizontal">
                        <div class="alert alert-success" v-if="imported_count !== false">
                            <p>
                                <i class="fa fa-info-circle"/>
                                {{imported_count}} imported.
                            </p>
                        </div>
                        <div class="form-group-sm form-group"
                             v-bind:class="{'has-error': hasFieldError('formState', 'import_text')}"
                        >
                            <label for="formHorizontalEmail"
                                   class="col-md-3 col-sm-3 control-label">HTML / text
                            </label>
                            <div class="col-md-9 col-sm-9">
                                <validate>
                                    <textarea name="import_text" id="formHorizontalEmail"
                                              class="form-control"
                                              required v-model="model.import_text">
                                    </textarea>
                                </validate>
                                <field-messages name="import_text" show="$touched || $submitted">
                                    <div slot="required">
                                        <span class="help-block">
                                            Field cannot be empty.
                                        </span>
                                    </div>
                                </field-messages>
                            </div>
                        </div>
                        <div class="form-group-sm form-group">
                            <label for="formHorizontalEmail" class="col-md-3 col-sm-3 control-label"></label>
                            <div class="col-md-9 col-sm-9">
                                <button type="submit" class="btn-xs btn btn btn-default">Import</button>
                            </div>
                        </div>
                    </vue-form>
                </div>
            </div>
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script>
  import axios from '../../modules/axios'

  import HeaderComponent from '../partials/Header.vue'
  import FooterComponent from '../partials/Footer.vue'
  import FormValidationMixin from '../../mixins/form-validation'

  export default {
    components: {
      'header-component': HeaderComponent,
      'footer-component': FooterComponent
    },
    name: 'profile-component',
    mixins: [FormValidationMixin],
    data () {
      return {
        formState: {},
        model: {
          import_text: ''
        },
        imported_count: false
      }
    },
    computed: {
      hasUserImportPermission () {
        return this.$store.getters.hasLoggedUserPermission('server.import')
      }
    },
    methods: {
      handleFormSubmit () {
        if (this.formState.$invalid) {
          return false
        }
        this.imported_count = false
        axios.post('/import', this.model).then((response) => {
          this.imported_count = response.data.count
        })
      }
    }
  }
</script>

<style scoped>

</style>
