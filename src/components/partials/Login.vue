<template>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div class="panel panel-default panel-register">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-sign-in"/> Log in</h3>
            </div>
            <div class="panel-body">
                <div class="alert alert-danger" v-if="error_message">
                    <p>
                        {{error_message}}
                    </p>
                </div>
                <vue-form :state="formState" @submit.prevent="handleFormSubmit" class="form-horizontal">
                    <div class="form-group-sm form-group"
                         v-bind:class="{'has-error': hasFieldError('formState', 'email')}"
                    >
                        <label for="formHorizontalEmail" class="col-sm-2 control-label">
                            Email
                        </label>
                        <div class="col-sm-10">
                            <div class="input-group-sm input-group">
                                <span class="input-group-addon">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <validate>
                                    <input type="email" placeholder="Email" name="email" id="formHorizontalEmail"
                                           class="form-control" v-model="model.email" required/>
                                </validate>
                            </div>
                            <field-messages name="email" show="$touched || $submitted">
                                <div slot="required">
                                    <span class="help-block">
                                        Email field is required.
                                    </span>
                                </div>
                                <div slot="email">
                                    <span class="help-block">
                                        Value is not valid email address.
                                    </span>
                                </div>
                            </field-messages>
                        </div>
                    </div>
                    <div class="form-group-sm form-group"
                         v-bind:class="{'has-error': hasFieldError('formState', 'password')}"
                    >
                        <label for="formHorizontalPassword" class="col-sm-2 control-label">
                            Password
                        </label>
                        <div class="col-sm-10">
                            <span class="input-group-sm input-group">
                                <span class="input-group-addon">
                                    <i class="fa fa-lock"></i>
                                </span>
                                <validate>
                                    <input type="password" placeholder="Password"
                                           name="password" id="formHorizontalPassword"
                                           class="form-control" v-model="model.password" required>
                                </validate>
                            </span>
                            <field-messages name="password" show="$touched || $submitted">
                                <div slot="required">
                                    <span class="help-block">
                                        Password field is required.
                                    </span>
                                </div>
                            </field-messages>
                        </div>
                    </div>
                    <div class="form-group-sm form-group">
                        <div class="col-sm-10 col-sm-offset-2">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remember" value="1" v-model="model.remember">
                                    Remember me
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group-sm form-group">
                        <div class="col-sm-10 col-sm-offset-2">
                            <button type="submit" class="btn-sm btn btn-default">Login</button>
                        </div>
                    </div>
                </vue-form>
            </div>
        </div>
    </div>
</template>

<script>
  import FormMixin from '../../mixins/form'

  export default {
    name: 'login-component',
    components: {},
    mixins: [FormMixin],
    data () {
      return {
        formState: {},
        model: {
          email: '',
          password: '',
          remember: true
        },
        error_message: ''
      }
    },
    methods: {
      handleFormSubmit () {
        if (this.formState.$invalid) {
          return false
        }
        this.$store.dispatch('login', {
          formData: this.model,
          error: (data) => {
            this.error_message = data._message
          },
          success: () => {
            this.$router.push('/profile')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
