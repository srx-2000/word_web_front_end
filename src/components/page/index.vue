<template>
  <div class="login-wrap">
        <h2 style="background-color: white;width: 200px">仅自己与朋友共用考研学习，还望大佬们手下留情</h2>
    <div class="ms-login">
      <h3 class="title">Beier单词本</h3>
      <h4 class="ms-title" style="margin-top: 0px;padding-top: 0px">登录</h4>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <router-link to="/signUp" class="login-tips">还没有账号？点击注册</router-link>
      </el-form>
    </div>
    <div class="footer">
      Copyright © {{year}}
      <a href="https://beian.miit.gov.cn/" style="color: #6E7173;text-decoration:none;">Beier 京ICP备2021026492号</a>
    </div>
  </div>
</template>

<script>

  export default {
    data: function () {
      return {
        year: new Date().getFullYear(),
        param: {
          username: '',
          password: '',
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
      };
    },
    methods: {
      submitForm() {
        if (this.param.password !== "" && this.param.username !== "") {
          // var params = {username: "srx", password: "srx62600"};
          // var data = "";
          // for (var attr in params) data += '&' + attr + '=' + encodeURIComponent(params[attr]);//转键值对，然后设置下content-type。axios的content-type是application/json的，不是键值对
          // data = data.substring(1);
          var data = {
            username: this.param.username,
            password: this.param.password
          };
          this.axios.post("/login", data).then((response) => {
            console.log(response);
            if (response.data.flag) {
              this.$message.success('登录成功');
              localStorage.setItem('ms_index', response.data.user_data[0]);
              localStorage.setItem('ms_uid', response.data.user_data[1]);
              localStorage.setItem('ms_username', response.data.user_data[2]);
              localStorage.setItem('ms_password', response.data.user_data[3]);
              localStorage.setItem('tips', true);
              this.$router.push('/');
            } else {
              this.$message.error(response.data.message);
            }
            // console.log(response.data)
          }).catch((response) => {
            console.log(response)
          })
        } else {
          this.$message.error("请输入账号密码");
        }
      },
    },
  };
</script>
<style>
  .login-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-color: #F4F6F9;
    /*background-size: 100%;*/
    background-repeat: no-repeat;
    background-size: cover;
  }
  html, body {
    height: 100%;
    overflow: auto;
    margin: 0;
  }
  html {
    overflow-y: auto;
  }
  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    /*font-size: 20px;*/
    color: #6777ef;
    font-size: 16px;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 80%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 2px 4px rgba(128, 128, 128, 0.2);
    overflow: hidden;
  }

  .ms-content {
    padding: 40px 40px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 14px;
    line-height: 30px;
    text-underline: blue;
    text-align: right;
    color: #3D9FFC;
  }

  .title{
    text-align: center;
    margin: 10px;
    margin-bottom: 0px;
    color: #4834d4;
    /*border-bottom: 1px solid #ddd;*/

  }
  .footer {
    height: 50px;
    text-align: center;
    position: absolute;
    bottom: 0px;
    left: 0px;
    line-height: 50px;
    width: 100%;
    color: #6E7173;
  }
</style>
