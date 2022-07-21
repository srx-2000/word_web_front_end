<template>
  <div>

    <el-drawer
      :visible.sync="drawer"
      :direction="direction">
      <template slot="title">
        <div style="font-weight: bold">
          快捷键Tips
        </div>
      </template>
      <div class="tips_content">
        <p style="font-weight: bold;font-style: italic">金山词霸/百度翻译添加单词</p>
        <div>Ctrl+Enter(回车键)：添加一个新的item</div>
        <div>Ctrl+Delete：删除当前鼠标指针所在的item</div>
        <div>Tab：跳转到下一个输入框</div>
        <div>上、下、左、右键可跳转不同的单元</div>
        <br>
        <p style="font-weight: bold;font-style: italic">手动添加单词</p>
        <div>Ctrl+Enter(回车键)：添加一个新的item</div>
        <div>Ctrl+Delete：删除当前鼠标指针所在的item</div>
        <div>Tab：跳转到下一个输入框</div>
        <div>上、下、左、右键可跳转不同的单元</div>
      </div>
    </el-drawer>
    <div class="main">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="tips_title">
              金山词霸/百度翻译添加单词
              <el-tooltip class="item" effect="dark" placement="top-start">
                <template slot="content">
                  <div>使用金山词霸+百度翻译接口添加单词，可自动翻译，显示词根，建议配合真题使用，暂无纠错能力</div>
                </template>
                <i class="header-icon el-icon-question" @click="drawer = true"></i>
              </el-tooltip>
            </div>
          </template>
          <el-form>
            <el-table
              :data="baidu_word_list"
              border
              lazy
              :key="table_key"
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
                    <el-input :ref="'api'+scope.$index" v-model="baidu_word_list[scope.$index].word" placeholder="word"
                              @keyup.ctrl.delete.native="delete_api_input(scope.$index)"
                              @keyup.ctrl.enter.native="add_input_api(scope.$index,scope.row)"
                              @keydown.up.native="move_up_down_api(scope.$index,-1)"
                              @keydown.down.native="move_up_down_api(scope.$index,1)"
                              @change="call_spider(scope.row,scope.$index)"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="mean"
                label="中文含义">
              </el-table-column>
              <el-table-column
                prop="memory_skill"
                label="记忆技巧">
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :offset="1" :span=11>
                <el-form-item>
                  <el-button icon="el-icon-circle-plus-outline" @click="add_input_api"
                             style="margin-top: 10px;float: left">
                    添加item
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-button icon="el-icon-finished" type="primary" @click="add_api_word"
                             style="margin-top: 10px; float: right">
                    提交单词
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="tips_title">
              手动添加单词
              <i class="header-icon el-icon-info" @click="drawer = true"></i>
            </div>
          </template>
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
                    <el-input :ref="'word'+scope.$index" v-model="scope.row.word" placeholder="word"
                              @keyup.enter.native="add_input('word',scope.$index)"
                              @keyup.ctrl.delete.native="delete_input"
                              @keyup.right.native="move_right_left('mean',scope.$index)"
                              @keydown.up.native="move_up_down('word',scope.$index,-1)"
                              @keydown.down.native="move_up_down('word',scope.$index,1)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="mean"
                label="中文含义">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input :ref="'mean'+scope.$index" v-model="scope.row.mean" placeholder="mean"
                              @keyup.enter.native="add_input('mean',scope.$index)"
                              @keyup.ctrl.delete.native="delete_input"
                              @keyup.left.native="move_right_left('word',scope.$index)"
                              @keyup.right.native="move_right_left('skill',scope.$index)"
                              @keydown.up.native="move_up_down('mean',scope.$index,-1)"
                              @keydown.down.native="move_up_down('mean',scope.$index,1)"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="mean"
                label="记忆技巧">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input :ref="'skill'+scope.$index" v-model="scope.row.memory_skill" placeholder="memory_skill"
                              @keyup.enter.native="add_input('skill',scope.$index)"
                              @keyup.ctrl.delete.native="delete_input"
                              @keyup.left.native="move_right_left('mean',scope.$index)"
                              @keydown.up.native="move_up_down('skill',scope.$index,-1)"
                              @keydown.down.native="move_up_down('skill',scope.$index,1)"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :offset="1" :span="11">
                <el-form-item>
                  <el-button icon="el-icon-circle-plus-outline" @click="add_input" style="margin-top: 10px;float: left">
                    添加item
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item>
                  <el-button icon="el-icon-finished" type="primary" @click="add_word"
                             style="margin-top: 10px; float: right">
                    提交单词
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: "addWord",
    data() {
      return {
        table_key: 0,
        drawer: false,
        edit_data: [{word: "", mean: "", memory_skill: ""}],
        direction: 'rtl',
        activeNames: ['1'],
        word_mean_list: [{word: "", mean: "", memory_skill: ""}],
        baidu_word_list: [{word: "", mean: "", memory_skill: ""}],
        user_uid: localStorage.getItem("ms_uid"),
        word_list: [],
        mean_list: [],
        memory_skill_list: [],
        limit_size: 30,
      }
    },

    methods: {
      delete_input(index) {
        if (this.word_mean_list.length <= 0) {
          this.$message.warning("表单中已无表单项，请停止你的行为");
        } else {
          this.word_mean_list.splice(index, 1)
        }
      },

      move_right_left(input_type, index) {
        this.$refs[input_type + (index)].focus()
      },
      move_up_down(input_type, index, offset) {
        this.$refs[input_type + (index + offset)].focus()
      },
      move_up_down_api(index, offset) {
        this.$refs['api' + (index + offset)].focus()
      },
      delete_api_input(index) {
        if (this.baidu_word_list.length <= 0) {
          this.$message.warning("表单中已无表单项，请停止你的行为");
        } else {
          this.baidu_word_list.splice(index, 1);
          this.edit_data.splice(index, 1)
        }
      },
      call_spider(row, index) {
        if (row.word !== "") {
          this.axios.get("/get_spider_result/" + row.word).then((response) => {
            var means = response.data["mean"];
            var memory_skill = "";
            if (response.data["affix"] != null) {
              memory_skill = response.data["affix"]
            }
            this.edit_data[index] = {"word": row.word, mean: means, memory_skill: memory_skill};
            // 这两行代码非常关键，可以打破element table的渲染锁死，使input可以随时修改，
            // 使用的是vue的方法：https://cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9
            this.$set(row, "mean", means);
            this.$set(row, "memory_skill", memory_skill);
          });
        }
      },
      add_input_api(index, row) {
        if (this.baidu_word_list.length >= this.limit_size) {
          this.$message.warning("已达到最大的提交数量，请提交一次再添加");
        } else {
          this.baidu_word_list.push({word: "", mean: "", memory_skill: ""});
          this.edit_data.push({word: "", mean: "", memory_skill: ""});
          if (index + 1 <= this.edit_data.length) {
            this.$nextTick(() => {
              this.$refs['api' + (index + 1)].focus()
            });
          }
        }
      },
      add_input(input_type, index) {
        if (this.word_mean_list.length >= this.limit_size) {
          this.$message.warning("已达到最大的提交数量，请提交一次再添加");
        } else {
          this.word_mean_list.push({word: "", mean: "", memory_skill: ""});
          if (index + 1 <= this.edit_data.length) {
            this.$nextTick(() => {
              this.$refs[input_type + (index + 1)].focus()
            });
          }
        }
      },
      get_list(is_baidu = false) {
        this.word_list = [];
        this.mean_list = [];
        this.memory_skill_list = [];
        if (is_baidu) {
          for (var i = 0; i < this.baidu_word_list.length; i++) {
            if (this.baidu_word_list[i]["word"] !== "" && this.baidu_word_list[i]["mean"] !== "") {
              this.word_list.push(this.baidu_word_list[i]["word"]);
              this.mean_list.push(this.baidu_word_list[i]["mean"]);
              this.memory_skill_list.push(this.baidu_word_list[i]["memory_skill"]);
            }
          }
        } else {
          for (var i = 0; i < this.word_mean_list.length; i++) {
            if (this.word_mean_list[i]["word"] !== "" && this.word_mean_list[i]["mean"] !== "") {
              this.word_list.push(this.word_mean_list[i]["word"]);
              this.mean_list.push(this.word_mean_list[i]["mean"]);
              this.memory_skill_list.push(this.word_mean_list[i]["memory_skill"]);
            }
          }
        }
      },
      add_api_word() {
        if (this.user_uid !== undefined) {
          this.get_list(true);
          if (this.word_list.length === this.mean_list.length && this.mean_list.length === this.memory_skill_list.length && this.word_list.length === 1) {
            this.axios.post("/add_word", {
              "user_uuid": this.user_uid,
              "word": this.word_list[0],
              "mean": this.mean_list[0],
              "memory_way": this.memory_skill_list[0],
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.baidu_word_list = [{word: "", mean: "", memory_skill: ""}]
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else if (this.word_list.length === this.mean_list.length && this.mean_list.length === this.memory_skill_list.length && this.word_list.length > 1) {
            this.axios.post("/batch_add_word", {
              "user_uuid": this.user_uid,
              "wordList": this.word_list,
              "meanList": this.mean_list,
              "memory_wayList": this.memory_skill_list,
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.baidu_word_list = [{word: "", mean: "", memory_skill: ""}]
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else {
            this.$message.error("请确保单词数和意思数相同且为正整数！")
          }
        } else {
          this.$message.error("登录已过期，请重新登录");
          this.$router.push("/signIn")
        }
      },
      add_word() {
        if (this.user_uid !== undefined) {
          this.get_list();
          if (this.word_list.length === this.mean_list.length && this.mean_list.length === this.memory_skill_list.length && this.word_list.length === 1) {
            this.axios.post("/add_word", {
              "user_uuid": this.user_uid,
              "word": this.word_list[0],
              "mean": this.mean_list[0],
              "memory_way": this.memory_skill_list[0],
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.word_mean_list = [{word: "", mean: "", memory_skill: ""}]
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else if (this.word_list.length === this.mean_list.length && this.mean_list.length === this.memory_skill_list.length && this.word_list.length > 1) {
            this.axios.post("/batch_add_word", {
              "user_uuid": this.user_uid,
              "wordList": this.word_list,
              "meanList": this.mean_list,
              "memory_wayList": this.memory_skill_list,
            }).then(response => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
                this.word_mean_list = [{word: "", mean: "", memory_skill: ""}]
              } else {
                this.$message.error(response.data.message)
              }
            })
          } else {
            this.$message.error("请确保单词数和意思数相同且为正整数！")
          }
        } else {
          this.$message.error("登录已过期，请重新登录");
          this.$router.push("/signIn")
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.drawer = localStorage.getItem("tips") !== "false" ? true : false;
      });
    }
  }
</script>

<style scoped>
  html, body {
    height: 100%;
    overflow: auto;
    margin: 0;
  }

  .tips_title {
    font-weight: bold;
    margin-left: 20px;
  }

  .tips_content {
    margin-left: 20px;
  }

  .tips {
    padding-bottom: 20px;
  }

  html {
    overflow-y: auto;
  }
</style>
