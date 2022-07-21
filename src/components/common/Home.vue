<template>
  <!--  <el-container>-->
  <!--    <el-header>Header</el-header>-->
  <!--    <el-main>Main</el-main>-->
  <!--    <el-footer>Footer</el-footer>-->
  <!--  </el-container>-->

  <div id="app">
    <div class="navbar-dark fixed-top">
      <div class="col-md-offset-2 col-md wrap" style="color: #ffffff">
        <el-row :gutter="20">
          <el-col :span="3" :offset="1">
            <el-image class="logo" src="../../../static/logo.png"/>
          </el-col>
          <el-col :span="2" :offset="14" style="padding: 11px">
            <el-switch
              v-model="is_tips"
              inactive-text="Tips"
              @change="change_tips">
            </el-switch>
          </el-col>
          <el-col :span="3" :offset="0" style="margin-top:6px;padding: 5px">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
              菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exit">退出</el-dropdown-item>
                <el-dropdown-item command="github">github库</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--            <el-button type="text" @click="exit">菜单</el-button>-->
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="main_body">
      <div class="row" style="margin-left: 20px">
        <div class="col-md-2 col-md-offset-2">
          <div class="list-group">
            <router-link to="/showAll" class="list-group-item" active-class="active">词库</router-link>
            <router-link to="/addWord" class="list-group-item " active-class="active">添加单词</router-link>
          </div>
        </div>
        <div class="col-md-9">
          <div class="panel">
            <div class="panel-body">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="navbar-dark fixed-bottom" style="background-color: #f6f6f6;text-align: center;padding: 5px">
      Copyright © {{year}}
      <a href="https://github.com/srx-2000/" style="color: #6E7173;text-decoration:none;" target="_blank">Beier</a>
      <a href="https://beian.miit.gov.cn/" style="color: #6E7173;text-decoration:none;"
         target="_blank">京ICP备2021026492号</a>
    </div>
  </div>

</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'

  export default {
    data() {
      return {
        is_tips: true,
        tagsList: [],
        collapse: false,
        year: new Date().getFullYear()
      };
    },
    methods: {
      exit() {
        localStorage.removeItem('ms_index');
        localStorage.removeItem('ms_uid');
        localStorage.removeItem('ms_username');
        localStorage.removeItem('ms_password');
        localStorage.removeItem('tips');
        this.$router.push('/signIn');
      }, change_tips() {
        // this.is_tips = !this.is_tips;
        localStorage.setItem('tips', this.is_tips)
      },
      handleCommand(command) {
        if (command === "exit") {
          this.exit()
        } else {
          let redict_url="https://github.com/srx-2000/word_web_front_end";
          window.open(redict_url, '_blank')
        }
      }
    },
    mounted() {
      this.is_tips = localStorage.getItem("tips") !== "false" ? true : false;
    }
  };
</script>
<style>
  .list-group-item {
    color: #7f7f7f;
  }

  html, body {
    height: 100%;
    overflow: auto;
    margin: 0;
    background-color: #f6f6f6;
  }

  html {
    overflow-y: auto;
  }

  .logo {
    width: 300px;
    margin-left: 50px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .main_body {
    background-color: #f6f6f6;
    padding-top: 20px;
    margin-top: 50px;
  }

  .wrap {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.1);

  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .exit {

    /*margin-top: 7px;*/
  }


  /*.footer {*/
  /*  height: 50px;*/
  /*  text-align: center;*/
  /*  position: absolute;*/
  /*  bottom: 0px;*/
  /*  left: 0px;*/
  /*  line-height: 50px;*/
  /*  width: 100%;*/
  /*  color: #6E7173;*/
  /*}*/
</style>
