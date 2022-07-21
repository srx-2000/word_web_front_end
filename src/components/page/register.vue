<template>
  <div class="register-wrap">
    <div class="ms-register">
      <div class="ms-title">
        <el-row>
          <el-col :span="3">
            <el-button class="el-button" @click="goBack" icon="el-icon-back" type="text" size="large"></el-button>
          </el-col>
          <el-col :offset="7" :span="5">
            <span>注册</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <template slot="content">
                <div>不建议使用常用密码，数据库并没有密码加密</div>
              </template>
              <i class="header-icon el-icon-warning" @click="drawer = true"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-form ref="reigsterForm"
               :rules="rules"
               :label-position="labelPosition"
               label-width="100px"
               :model="reigsterForm"
               class="ms-content"
               size="middle">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="reigsterForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="reigsterForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input v-model="reigsterForm.confirmPassword" type="password"
                    @keyup.enter.native="submitForm()" placeholder="确认密码"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-row>
            <el-button size="large" type="primary" @click="submitForm('reigsterForm')">注册</el-button>
          </el-row>
          <el-row>
            <el-button size="large" @click="resetForm('reigsterForm')">重置</el-button>
          </el-row>
        </div>
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
    data() {
      let passwordReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,12}$/;
      var validateNewPwd = (rule, value, callback) => {
        if (!passwordReg.test(value)) {
          callback(new Error('密码应是6-12位数字、字母或字符'))
        } else {
          callback()
        }
      };
      var validateUsername = (rule, value, callback) => {
        this.axios.get("/isUsernameExist/" + value).then((response => {
          if (response.data.flag) {
            callback(new Error("用户名已注册"))
          } else {
            callback()
          }
        }))
      };
      var validateComfirmPwd = (rule, value, callback) => {
        if (!passwordReg.test(value)) {
          callback(new Error('密码应是6-12位数字、字母或字符'))
        } else if (this.reigsterForm.password !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      };
      return {
        year: new Date().getFullYear(),
        labelPosition: 'right',
        reigsterForm: {
          username: "",
          password: "",
          confirmPassword: ""
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {validator: validateUsername, trigger: "blur"}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validateNewPwd, trigger: "blur"}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validateComfirmPwd, trigger: 'blur'}
          ]
        },
      };
    },
    methods: {
      resetForm(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });

      },
      goBack() {
        this.$router.push('/signIn');
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单
            this.axios.post("/signup", {
                username: this.reigsterForm.username,
                password: this.reigsterForm.password,
              }
            ).then((response) => {
              // console.log(response);
              if (response.data.flag) {
                this.$router.push('/signIn');
              } else {
                this.$message.error('注册失败，请检查网络或填写是否正确');
                console.log('error submit!!');
              }
              // console.log(response.data)
            }).catch((response) => {
              console.log(response)
            })
          } else {   //校验不通过
            this.$message.error("请输入正确的注册信息！");
            return false;
          }
        });

      },
    },
  }
</script>

<style>
  body, html {
    height: 100%;
    width: 100%;
  }

  .register-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #F4F6F9;
    display: flex;
  }

  .ms-register {
    width: 450px;
    border-radius: 5px;
    margin: auto;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 2px 4px rgba(128, 128, 128, 0.1);
  }

  .ms-title {
    width: 100%;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #6777ef;
    border-bottom: 1px solid #ddd;
    font-weight: bold
  }

  .login-btn {
    text-align: center;
  }

  .ml5 {
    margin-left: 10px;
    font-weight: bold;
    vertical-align: middle;
    float: left;
  }

  .ms-content {
    padding: 30px 30px;
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
