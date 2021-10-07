<template>
  <div>
    <el-form>
      <el-table
        :data="word_mean_list"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          prop="word"
          label="单词">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model="scope.row.word" placeholder="word"
                        @keyup.ctrl.delete.native="delete_input"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="mean"
          label="中文含义">
          <template slot-scope="scope">
            <el-form-item>
              <el-input v-model="scope.row.mean" placeholder="mean"
                        @keyup.enter.native="add_input"
                        @keyup.ctrl.delete.native="delete_input"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="text-align: center">
        <el-col :span="12">
          <el-form-item>
            <el-button icon="el-icon-circle-plus-outline" @click="add_input" style="margin-top: 10px;float: left">添加item
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button icon="el-icon-finished" type="primary" @click="add_word" style="margin-top: 10px; float: right">
              提交单词
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "addWord",
    data() {
      return {
        word_mean_list: [{word: "", mean: ""}],
        user_uid: localStorage.getItem("ms_uid"),
        word_list: [],
        mean_list: [],
        limit_size: 30,
      }
    },
    methods: {
      delete_input() {
        if (this.word_mean_list.length <= 0) {
          this.$message.warning("表单中已无表单项，请停止你的行为");
        } else {
          this.word_mean_list.pop()
        }
      },
      add_input() {
        if (this.word_mean_list.length >= this.limit_size) {
          this.$message.warning("以达到最大的提交数量，请提交一次再添加");
        } else {
          this.word_mean_list.push({word: "", mean: ""})
        }
      },
      get_list() {
        for (var i = 0; i < this.word_mean_list.length; i++) {
          this.word_list.push(this.word_mean_list[i]["word"]);
          this.mean_list.push(this.word_mean_list[i]["mean"])
        }
      },
      add_word() {
        if (this.user_uid != undefined) {
          this.get_list();
          if (this.word_list.length == this.mean_list.length && this.word_list.length == 1) {
            this.axios.post("/add_word", {
              "user_uuid": this.user_uid,
              "word": this.word_list[0],
              "mean": this.mean_list[0],
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.word_mean_list = [{word: "", mean: ""}]
              }
              this.$message.error(response.data.message)
            })
          } else if (this.word_list.length == this.mean_list.length && this.word_list.length > 1) {
            this.axios.post("/batch_add_word", {
              "user_uuid": this.user_uid,
              "wordList": this.word_list,
              "meanList": this.mean_list,
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.word_mean_list = [{word: "", mean: ""}]
              }
              this.$message.error(response.data.message)
            })
          } else {
            this.$message.error("请确保单词数和意思数相同且为正整数！")
          }
        } else {
          this.$message.error("登录已过期，请重新登录")
          this.$router.push("/signIn")
        }
      }
    }
  }
</script>

<style scoped>

</style>
