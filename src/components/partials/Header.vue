<template>
    <b-navbar type="default" fixed="top" sticky="true">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <span>proxydatabase.online</span>
            </router-link>

            <b-nav is-nav-bar>
                <b-nav-item to="/">
                    Home
                </b-nav-item>
                <b-nav-item to="/list">
                    <strong>Proxy List</strong>
                </b-nav-item>
            </b-nav>

            <b-nav is-nav-bar class="ml-auto navbar-right">
                <b-nav-item to="/about">
                    About
                </b-nav-item>
                <b-nav-item @click.prevent="handleUserDropdownClick">
                    <span class="has-icon">
                        <i class="fa fa-user-o"></i>
                    </span>
                    <span v-if="!isUserLoggedIn">Guest</span>
                    <span v-if="isUserLoggedIn">{{user.email}}</span>
                    <span class="caret"></span>
                </b-nav-item>
            </b-nav>

            <ul class="user user-menu dropdown-menu" v-if="userMenuVisible">
                <li class="user-header" v-if="!isUserLoggedIn">
                    <p>Guest</p>
                </li>
                <li class="user-footer" v-if="!isUserLoggedIn">
                    <div class="pull-right">
                        <router-link to="/account" class="btn btn-xs btn-default">
                            <i class="fa fa-sign-in"></i>
                            Login or Register
                        </router-link>
                    </div>
                </li>
                <li class="user-header" v-if="isUserLoggedIn">
                    <p>
                        {{user.email}}
                        <small>Member since {{user.created_at}}</small>
                    </p>
                </li>
                <li class="user-footer" v-if="isUserLoggedIn">
                    <div class="pull-left">
                        <router-link to="/profile" class="btn btn-xs btn-default">
                            <i class="fa fa-user-o"/> Profile
                        </router-link>
                    </div>
                    <div class="pull-right">
                        <a href="#" class="btn btn-xs btn-default" @click.prevent="handleUserLogoutClick()">
                            <i class="fa fa-sign-out"/> Sign out
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </b-navbar>
</template>

<script>
  export default {
    name: 'header',
    components: {},
    data () {
      return {
        userMenuVisible: false
      }
    },
    computed: {
      isUserLoggedIn () {
        return this.$store.getters.isUserLoggedIn
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      handleUserDropdownClick () {
        this.userMenuVisible = !this.userMenuVisible
      },
      handleUserLogoutClick () {
        this.$store.dispatch('logout', {
          success: () => {
            this.$router.push('/account')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

    .user-menu {
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        padding: 1px 0 0 0;
        border-top-width: 0;
        width: 280px;
        left: auto;
        right: 0;
        display: block;
    }

    .user-menu,
    .user-menu > .user-body {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .user-menu > li.user-header {
        height: 175px;
        padding: 10px;
        text-align: center;
        background: #325d88;
    }

    .user-menu > li.user-header > img {
        z-index: 5;
        height: 90px;
        width: 90px;
        border: 3px solid;
        border-color: transparent;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .user-menu > li.user-header > p {
        z-index: 5;
        color: #fff;
        color: rgba(255, 255, 255, 0.8);
        font-size: 17px;
        margin-top: 10px;
        text-transform: none;
    }

    .user-menu > li.user-header > p > small {
        display: block;
        font-size: 12px;
    }

    .user-menu > .user-body {
        padding: 15px;
        border-bottom: 1px solid #f4f4f4;
        border-top: 1px solid #dddddd;
    }

    .user-menu > .user-body:before,
    .user-menu > .user-body:after {
        content: " ";
        display: table;
    }

    .user-menu > .user-body:after {
        clear: both;
    }

    .user-menu > .user-body a {
        color: #444 !important;
    }

    @media (max-width: 991px) {
        .user-menu > .user-body a {
            background: #fff !important;
            color: #444 !important;
        }
    }

    .user-menu > .user-footer {
        background-color: #f9f9f9;
        padding: 10px;
    }

    .user-menu > .user-footer:before,
    .user-menu > .user-footer:after {
        content: " ";
        display: table;
    }

    .user-menu > .user-footer:after {
        clear: both;
    }

    .navbar-nav > .user-menu .user-image {
        float: left;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        margin-right: 10px;
        margin-top: -2px;
    }

    @media (max-width: 767px) {
        .navbar-nav {
            margin: 0 -15px;
            & > .user-menu {
                .dropdown-menu {
                    width: 100%;
                }
                .user-image {
                    float: none;
                    margin-right: 0;
                    margin-top: -8px;
                    line-height: 10px;
                }
            }
        }
    }

</style>
