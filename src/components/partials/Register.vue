<template>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div class="panel panel-default panel-register">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <i class="fa fa-user-plus"/>Create account for free!
                </h3>
            </div>
            <div class="panel-body">
                <div class="alert alert-info">
                    <p><i class="fa fa-info-circle"></i>
                        Email is required for account confirmation.
                    </p>
                </div>
                <div class="alert alert-success" v-if="alertSuccess">
                    <p>You are registered now. Check your email for confirmation link.</p>
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
                                    <input type="email" placeholder="Email" name="email"
                                           id="formHorizontalEmail" class="form-control" v-model="model.email" required>
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
                         v-bind:class="{'has-error': hasFieldError('formState', 'email_repeat')}"
                    >
                        <label for="formHorizontalEmailRepeat" class="col-sm-2 control-label">
                            Repeat email
                        </label>
                        <div class="col-sm-10">
                            <div class="input-group-sm input-group">
                                <span class="input-group-addon">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <validate :custom="{emailRepeatValidator}">
                                    <input type="email" placeholder="Repeat email" name="email_repeat"
                                           id="formHorizontalEmailRepeat"
                                           class="form-control" v-model="model.email_repeat" required>
                                </validate>
                            </div>
                            <field-messages name="email_repeat" show="$touched || $submitted">
                                <div slot="required">
                                    <span class="help-block">
                                        Email field is required.
                                    </span>
                                </div>
                                <div slot="emailRepeatValidator">
                                    <span class="help-block">
                                        Email addresses do not match.
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
                            <div class="input-group-sm input-group">
                                <span class="input-group-addon">
                                    <i class="fa fa-lock"></i>
                                </span>
                                <validate>
                                    <input type="password" placeholder="Password"
                                           name="password" id="formHorizontalPassword"
                                           class="form-control" v-model="model.password" required>
                                </validate>
                            </div>
                            <field-messages name="password" show="$touched || $submitted">
                                <div slot="required">
                                    <span class="help-block">
                                        Password field is required.
                                    </span>
                                </div>
                            </field-messages>
                        </div>
                    </div>
                    <div class="form-group-sm form-group"
                         v-bind:class="{'has-error': hasFieldError('formState', 'password_repeat')}"
                    >
                        <label for="formHorizontalPasswordRepeat" class="col-sm-2 control-label">
                            Repeat password
                        </label>
                        <div class="col-sm-10">
                            <div class="input-group-sm input-group">
                                <span class="input-group-addon">
                                    <i class="fa fa-lock"></i>
                                </span>
                                <validate :custom="{passwordRepeatValidator}">
                                    <input type="password" placeholder="Repeat password"
                                           name="password_repeat"
                                           id="formHorizontalPasswordRepeat"
                                           class="form-control" v-model="model.password_repeat" required>
                                </validate>
                            </div>
                            <field-messages name="password_repeat" show="$touched || $submitted">
                                <div slot="required">
                                    <span class="help-block">
                                        Password repeat field is required.
                                    </span>
                                </div>
                                <div slot="passwordRepeatValidator">
                                    <span class="help-block">
                                        Passwords do not match.
                                    </span>
                                </div>
                            </field-messages>
                        </div>
                    </div>
                    <div class="form-group-sm form-group">
                        <div class="col-sm-10 col-sm-offset-2">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="newsletter" value="1" v-model="model.newsletter">
                                    I agree to receive a newsletter.
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group-sm form-group">
                        <label class="col-sm-2 control-label">
                            I'm not a robot
                        </label>
                        <div class="col-sm-10">
                            <p>
                                <img class="captcha"
                                     v-bind:src="`http://proxy.local/captcha/${this.captchaToken}`"
                                     @click="refreshCaptchaToken()"
                                     alt=""
                                     ref="captcha"
                                >
                            </p>
                            <input type="text" placeholder="Enter code from image" name="captcha" class="form-control"
                                   v-model="model.captcha" required
                            >
                        </div>
                    </div>
                    <div class="form-group-sm form-group">
                        <div class="col-sm-10 col-sm-offset-2">
                            <button type="submit" class="btn-sm btn btn-default">Register</button>
                        </div>
                    </div>
                </vue-form>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from '../../modules/axios'
  import FormMixin from '../../mixins/form'

  export default {
    name: 'register-component',
    components: {},
    mixins: [FormMixin],
    data () {
      return {
        formState: {},
        model: {
          email: '',
          email_repeat: '',
          password: '',
          password_repeat: '',
          newsletter: true,
          catpcha: ''
        },
        alertSuccess: false,
        formErrors: [],
        captchaToken: ''
      }
    },
    methods: {
      handleFormSubmit () {
        if (this.formState.$invalid) {
          return false
        }
        axios.post('/register', this.model).then((response) => {
          this.alertSuccess = true
        }).catch((error) => {
          this.formErrors = error.response.data
        })
      },
      emailRepeatValidator (value) {
        return value === this.model.email
      },
      passwordRepeatValidator (value) {
        return value === this.model.password
      },
      refreshCaptchaToken () {
        this.captchaToken = (new Date()).getTime()
      }
    },
    mounted () {
      this.refreshCaptchaToken()
    }
  }
</script>

<style scoped>

</style>
