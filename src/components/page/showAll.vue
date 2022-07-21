<template>
  <div class="container">
    <el-row :gutter="50" type="flex" justify="space-between	">
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-d-arrow-left" style="text-align: center" @click="show_all" round>重置
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="success" icon="el-icon-refresh-left" style="text-align: center"
                   @click="upset" round>打乱
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="warning" icon="el-icon-view" style="text-align: center"
                   @click="check_all(is_mean)" round>全检
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="danger" icon="el-icon-delete" style="text-align: center;"
                   @click="delete_words" round>删除
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="info" icon="el-icon-s-flag" style="text-align: center"
                   @click="get_high_frequency"
                   round>高频
        </el-button>
      </el-col>
      <el-tooltip style="margin-left: 80px" effect="dark" content="输入中文含义时，各个意思之间可用【,，、；;】五种符号间隔" placement="bottom">
        <i class="el-icon-warning" style="text-align: center"></i>
      </el-tooltip>
      <el-col :span="9" class="inputDeep">
        <el-input
          label="left"
          type="text"
          v-model="search_word"
          clearable
          @clear="clear_search"
          @keyup.enter.native="search"
          prefix-icon="el-icon-search"
          placeholder="请输入查询单词">
          <el-select style="width: 90px;background-color: #fff;" v-model="select" slot="prepend"
                     placeholder="请选择">
            <el-option label="英" value="1"></el-option>
            <el-option label="中" value="2"></el-option>
          </el-select>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="date"
          type="date"
          @change="date_change"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          placeholder="选择日期查询单词">
        </el-date-picker>
      </el-col>

    </el-row>
    <el-table
      class="word_table"
      :data="result.word_list.slice(0,page_size)"
      height="500"
      :key="table_key"
      style="width: 100%"
      :highlight-current-row="true"
      ref="table">
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column
        label="序号"
        prop="id"
        type="index"
        sortable
        :index="indexMethod"
        width="50px"
      >
      </el-table-column>
      <el-table-column
        label="单词"
        sortable
        prop="word"
        v-if="is_hide_word">
        <template slot-scope="{index,row}">
          <template v-if="row.edit&&global_edit">
            <el-input v-model="row.word" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.word }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="中文意思"
        prop="mean"
        width="300"
        v-if="is_hide_mean">
        <template slot-scope="{index,row}">
          <template v-if="row.edit&&global_edit">
            <el-input v-model="row.mean" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.mean }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="记忆技巧"
        prop="memory_way"
        width="200"
        v-if="is_hide_mean&&is_hide_word">
        <template slot-scope="{index,row}">
          <template v-if="row.edit&&global_edit">
            <el-input v-model="row.memory_way" class="edit-input" size="small"/>
          </template>
          <span v-else>{{ row.memory_way }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="检测"
        prop="word"
        :width="that|widthFilter"
      >
        <template slot-scope="scope"
                  ref="word_column"
        >
          <el-input :ref="'word'+scope.$index" v-if="!is_hide_word" placeholder="word"
                    v-model="word_model[scope.$index]"
                    @keydown.up.native="move_up_down('word',scope.$index,-1)"
                    @keydown.down.native="move_up_down('word',scope.$index,1)"
                    @keydown.enter.native="check_one_enter('word',scope.$index, scope.row,is_mean)"
          ></el-input>
          <el-input :ref="'mean'+scope.$index" v-else-if="!is_hide_mean" placeholder="中文含义"
                    v-model="mean_model[scope.$index]"
                    @keydown.up.native="move_up_down('mean',scope.$index,-1)"
                    @keydown.down.native="move_up_down('mean',scope.$index,1)"
                    @keydown.enter.native="check_one_enter('mean',scope.$index, scope.row,is_mean)"
          ></el-input>
          <span v-else-if="word_model[scope.$index]===undefined&&mean_model[scope.$index]===undefined">待检测</span>
          <span v-else-if="word_model[scope.$index]!==undefined&&mean_model[scope.$index]===undefined">{{word_model[scope.$index]}}</span>
          <span v-else-if="word_model[scope.$index]===undefined&&mean_model[scope.$index]!==undefined">{{mean_model[scope.$index]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-row>
            <el-button type="primary" size="mini" @click="hide_mean" v-show="is_hide_mean">隐藏/显示中文</el-button>
          </el-row>
          <el-row>
            <el-button type="success" size="mini" @click="hide_word" v-show="is_hide_word" style="margin-top: 10px">
              隐藏/显示英文
            </el-button>
          </el-row>
        </template>
        <template slot-scope="scope">
          <el-tag :type="result_show[scope.$index] | statusFilter">
            {{ result_show[scope.$index] }}
          </el-tag>
          <el-button
            v-if="(!scope.row.edit)&&global_edit"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-else-if="(!local_edit)&&(!global_edit)"
            type="warning"
            size="small"
            icon="el-icon-view"
            @click="check_one(scope.$index,scope.row,is_mean)"
          >
            检查
          </el-button>
          <el-button
            v-else-if="scope.row.edit&&global_edit"
            type="success"
            size="small"
            @click="confirmEdit(scope.row,scope.$index)"
          >
            Ok
          </el-button>
          <el-button
            style="margin-top: 5px"
            v-if="scope.row.edit&&global_edit"
            type="danger"
            size="small"
            @click="cancelEdit(scope.row)"
          >
            No
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="right"
      style="margin-top: 20px"
      background
      layout="prev, pager, next, sizes"
      :page-sizes="[30, 60, 90, 120]"
      @size-change="change_size"
      :total="result.word_count"
      @current-change="change_current_page"
    >
    </el-pagination>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'

  function object_equal(object1, object2) {
    var flag = 0;
    for (var prop in object1) {
      if (object1.hasOwnProperty(prop)) {
        if (object2[prop] === object1[prop]) {
          flag += 1
        }
      }
    }
    return flag === Object.keys(object1).length;
  }

  function shallowCopy(src) {
    var dst = {};
    for (var prop in src) {
      if (src.hasOwnProperty(prop)) {
        dst[prop] = src[prop];
      }
    }
    return dst;
  }

  var word = {};
  export default {
    name: "showAll",
    filters: {
      statusFilter(status) {
        const statusMap = {
          right: 'success',
          uncheck: 'info',
          wrong: 'danger',
          half: 'warning'
        };
        return statusMap[status]
      }, widthFilter(that) {
        if (that.is_hide_word && that.is_hide_mean)
          return "100px";
        else
          return "250px"
      }
    },
    data() {
      return {
        year: new Date().getFullYear(),
        date: "",
        that: this,
        select: "1",
        is_mean: false, //判断现在是要检查中文还是检查英文
        table_key: 0,
        global_edit: true, //判断全局是否是在编辑状态
        local_edit: false, //判断局部是否是在编辑状态
        search_word: "",
        result_show: [],
        word_model: [],
        mean_model: [],
        total_page: 0,
        page_size: 30,
        current_page: 1,
        is_hide_word: true,
        is_hide_mean: true,
        status: 1,
        is_frequency: false,
        word_mean_list: [],
        user: {
          uid: localStorage.getItem('ms_uid')
        },
        result: {
          message: "",
          word_list: [],
          word_count: 0
        }
      }
    },
    methods: {
      indexMethod(index) {
        return (this.current_page - 1) * this.page_size + index + 1;
      },
      get_high_frequency() {
        if (this.is_frequency) {
          this.word_model = [];
          this.mean_model = [];
          this.getAllWord(this.current_page, this.page_size, this.status);
          this.is_frequency = false;
          this.table_key += 1
        } else {
          this.word_model = [];
          this.mean_model = [];
          this.axios.get("/high_frequency/" + this.user.uid).then((response) => {
            if (response.data.word_count !== 0) {
              this.result.word_count = response.data.word_count;
              this.result.word_list = response.data.word_list;
              this.result.message = response.data.message;
              this.total_page = this.result.word_count / this.page_size;
              this.result_show = new Array(this.result.word_count).fill("uncheck");
              if (this.result.word_count === 0 && this.result.word_list.length === 0) {
                this.$message.warning(this.result.message)
              } else if (this.result.word_count !== 0 && this.result.word_list.length === 0) {
                this.result.message = "没有多余的单词了";
                this.$message.warning(this.result.message)
              } else {
                this.word_mean_list = [];
                this.split_mean();
              }
            } else {
              this.$message.warning("暂时为查询到出现频率大于1的单词呦！")
            }
          });
          this.table_key += 1;
          this.is_frequency = true;
        }
      },
      check_one_enter(input_type, index, word_object, is_mean) {
        this.check_one(index, word_object, is_mean);
        this.$refs[input_type + (index + 1)].focus()
      },
      edit(row) {
        if (this.global_edit) {
          word = shallowCopy(row);
          word.edit = false;
          row.edit = true;
          this.local_edit = true;
          this.table_key += 1
        }
      },
      confirmEdit(row) {
        row.edit = false;
        this.local_edit = false;
        if (row.id === undefined) {
          this.$message.warning("无法在高频词表中修改单词")
        } else {
          if (object_equal(row, word)) {
            this.$message.info("单词并未修改")
          } else {
            this.axios.post("/update_word", row).then((response) => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
            }).catch((response) => {
              console.log(response)
            }).finally(() => {
              this.getAllWord(this.current_page, this.page_size, this.status)
            });
          }
        }
        this.table_key += 1;
      },
      cancelEdit(row) {
        row.edit = false;
        this.local_edit = false;
        this.$message.info("已取消编辑");
        this.table_key += 1;
      },
      search() {
        this.axios.get("/search/" + this.user.uid + "/" + this.search_word + "/" + this.select + "/" + this.status).then((response) => {
          this.result.word_count = response.data.word_count;
          this.result.word_list = response.data.word_list;
          this.result.message = response.data.message;
          this.total_page = this.result.word_count / this.page_size;
          this.word_mean_list = [];
          this.split_mean();
          this.result_show = new Array(this.result.word_count).fill("uncheck");
          if (this.result.word_count === 0 && this.result.word_list.length === 0) {
            this.$message.warning(this.result.message)
          } else if (this.result.word_count !== 0 && this.result.word_list.length === 0) {
            this.result.message = "没有查到单词鸭";
            this.$message.warning(this.result.message)
          } else {
            this.$message.success("查到啦！")
          }
        });
      },
      move_up_down(input_type, index, offset) {
        this.$refs[input_type + (index + offset)].focus()
      },
      clear_search() {
        this.mean_model = [];
        this.word_model = [];
        this.getAllWord(this.current_page, this.page_size, this.status)
      },
      date_change() {
        this.word_model = [];
        this.mean_model = [];
        this.getAllWord(this.current_page, this.page_size, this.status);
      },
      split_mean() {
        for (var i = 0; i < this.result.word_list.length; i++) {
          var mean = this.result.word_list[i].mean;
          mean = mean.replaceAll(";", ",").replaceAll("，", ",").replaceAll("；", ",");
          var pattern = /[a-z]*\./g;
          var mid_mean = mean.replace(pattern, ",");
          var mean_list = mid_mean.split(",");
          var new_mean_list = mean_list.filter(item => item !== "");
          this.word_mean_list.push({word: this.result.word_list[i].word, mean_list: new_mean_list})
        }
      },
      delete_words() {
        var word_list = this.$refs.table.selection;
        if (word_list.length === 0) {
          this.$message.warning("请使用复选框选择想要删除的单词")
        } else {
          this.$confirm('此操作将删除选中单词, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var delete_object = {"user_uuid": this.user.uid, "word_list": word_list};
            this.axios.post("/batch_delete_word", delete_object
            ).then((response) => {
              if (response.data.flag) {
                this.$message.success(response.data.message);
              } else {
                this.$message.error(response.data.message);
              }
            }).catch((response) => {
              console.log(response)
            }).finally(() => {
              this.getAllWord(this.current_page, this.page_size, this.status)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      split_mean_model(mean) {
        if (mean !== undefined) {
          mean = mean.replaceAll(";", ",").replaceAll("，", ",").replaceAll("；", ",").replaceAll("、", ",");
          var mean_list = mean.split(",");
          return mean_list
        } else {
          return []
        }
      },
      get_intersection(arr1, arr2) {
        let temp = [];
        for (const item of arr2) {
          arr1.find(i => i === item) ? temp.push(item) : ""
        }
        return temp
      },
      check_all(is_mean) {
        var count = 0;
        var count1 = 0;
        if (is_mean) {
          for (let i = 0; i < this.word_mean_list.length; i++) {
            const user_mean_list = this.split_mean_model(this.mean_model[i]);
            const inter_arr = this.get_intersection(this.word_mean_list[i].mean_list, user_mean_list);
            if (user_mean_list.length === inter_arr.length && user_mean_list.length !== 0) {
              this.result_show[i] = "right";
              count++;
            } else if (inter_arr.length === 0 && this.mean_model[i] === undefined) {
              this.result_show[i] = "uncheck";
            } else if (user_mean_list.length > inter_arr.length && inter_arr.length !== 0) {
              this.result_show[i] = "half";
              count1++;
            } else {
              this.result_show[i] = "wrong";
            }
            if (this.result_show.length > this.word_mean_list.length) {
              this.result_show = this.result_show.splice(0, this.word_mean_list.length)
            }
          }
        } else {
          for (var i = 0; i < this.result.word_list.length; i++) {
            if (this.word_model[i] === this.result.word_list[i].word) {
              this.result_show[i] = "right";
              count++;
            } else if (this.word_model[i] === undefined) {
              this.result_show[i] = "uncheck"
            } else {
              this.result_show[i] = "wrong"
            }
          }
          if (this.result_show.length > this.result.word_list.length) {
            this.result_show = this.result_show.splice(0, this.result.word_list.length)
          }
        }
        this.table_key += 1;
        if (is_mean) {
          if (count / this.result_show.length < 0.5)
            this.$message.error("本次检错共" + this.result_show.length + "个，正确" + count + "个，半对" + count1 + "个，继续加油！");
          else if (count / this.result_show.length >= 0.5 && count / this.result_show.length <= 0.8)
            this.$message.warning("本次检错共" + this.result_show.length + "个，正确" + count + "个，半对" + count1 + "个，继续加油！");
          else
            this.$message.success("本次检错共" + this.result_show.length + "个，正确" + count + "个，半对" + count1 + "个，继续加油！");
        } else {
          if (count / this.result_show.length < 0.5)
            this.$message.error("本次检错共" + this.result_show.length + "个，正确" + count + "个，继续加油！");
          else if (count / this.result_show.length >= 0.5 && count / this.result_show.length <= 0.8)
            this.$message.warning("本次检错共" + this.result_show.length + "个，正确" + count + "个，继续加油！");
          else
            this.$message.success("本次检错共" + this.result_show.length + "个，正确" + count + "个，继续加油！");
        }
      },
      upset() {
        var c = this.result.word_list.map((item, index) => [item, this.word_mean_list[index]]);
        // console.log(c);
        c.sort(function () {
          return Math.random() - 0.5;
        });
        // console.log(c);
        c.forEach(([_a, _b], index) => {
          this.result.word_list[index] = _a;
          this.word_mean_list[index] = _b;
        });
        this.table_key += Math.random();
        this.word_model = [];
        this.mean_model = [];
      },
      check_one(index, word_object, is_mean) {
        if (is_mean) {
          let obj = this.word_mean_list.find(o => o.word === word_object.word);
          var mean_list = obj.mean_list;
          const user_mean_list = this.split_mean_model(this.mean_model[index]);
          const inter_arr = this.get_intersection(mean_list, user_mean_list);
          if (user_mean_list.length === inter_arr.length && user_mean_list.length !== 0) {
            this.$message.success("正确");
            this.result_show[index] = "right";
          } else if (user_mean_list.length > inter_arr.length && inter_arr.length !== 0) {
            this.$message.warning("对了一半");
            this.result_show[index] = "half"
          } else if (inter_arr.length === 0 && this.mean_model[index] === undefined) {
            this.$message.info("未输入");
            this.result_show[index] = "uncheck"
          } else {
            this.$message.error("错误");
            this.result_show[index] = "wrong"
          }
          this.table_key += 1;
          word_object.word_status = this.result_show[index]
        } else {
          if (word_object.word === this.word_model[index]) {
            this.$message.success("正确");
            this.result_show[index] = "right";
          } else if (this.word_model[index] === undefined) {
            this.$message.info("未输入");
            this.result_show[index] = "uncheck"
          } else {
            this.$message.error("错误");
            this.result_show[index] = "wrong"
          }
          this.table_key += 1;
          word_object.word_status = this.result_show[index]
        }
      },
      change_current_page(val) {
        this.current_page = val;
        this.getAllWord(this.current_page, this.page_size, this.status);
        this.word_model = [];
        this.mean_model = [];
        this.result_show = [];
      },
      change_size(val) {
        this.page_size = val;
        this.getAllWord(this.current_page, this.page_size, this.status);
        this.result_show = [];
        this.word_model = [];
        this.mean_model = [];
      },
      show_all() {
        this.is_hide_mean = true;
        this.is_hide_word = true;
        this.global_edit = true;
        // this.local_edit
      },
      hide_mean() {
        if (!this.local_edit) {
          this.is_hide_mean = !this.is_hide_mean;
          this.is_hide_word = !this.is_hide_mean;
          this.is_mean = true;
          this.global_edit = false;
          this.word_model = []
        } else {
          this.$message.warning("编辑单词时无法进入默写呦！")
        }
      },
      hide_word() {
        if (!this.local_edit) {
          this.is_hide_word = !this.is_hide_word;
          this.is_hide_mean = !this.is_hide_word;
          this.global_edit = false;
          this.is_mean = false;
          this.mean_model = []
        } else {
          this.$message.warning("编辑单词时无法进入默写呦！")
        }
      },
      getAllWord(page, pageSize, status) {
        console.log(this.user.uid);
        if (this.user.uid !== undefined) {
          var url = "";
          if (this.date === "" || this.date == null) {
            url = "/query/" + this.user.uid + "/" + page + "/" + pageSize + "/" + status
          } else {
            var date_list = this.date.split("-");
            url = "/query/" + this.user.uid + "/" + page + "/" + pageSize + "/" + date_list[0] + "/" + date_list[1] + "/" + date_list[2] + "/" + status
          }
          this.axios.get(url).then(response => {
            this.result.word_count = response.data.word_count;
            this.result.word_list = response.data.word_list;
            this.result.message = response.data.message;
            this.total_page = this.result.word_count / this.page_size;
            this.result_show = new Array(this.result.word_count).fill("uncheck");
            if (this.result.word_count === 0 && this.result.word_list.length === 0) {
              this.$message.warning(this.result.message)
            } else if (this.result.word_count !== 0 && this.result.word_list.length === 0) {
              this.result.message = "没有多余的单词了";
              this.$message.warning(this.result.message)
            } else {
              this.word_mean_list = [];
              this.split_mean();
            }

          })
        } else {
          this.$message.error("登录已过期，请重新登录");
          this.$router.push("/signIn")
        }
      }
    }
    ,
    mounted() {
      this.getAllWord(0, this.page_size, this.status)
    }
  }
</script>

<style scoped>
  .input-with-select {
    background-color: #fff;

  }

  .el-input-group__prepend {
    background-color: #fff;
    width: 100px
  }

  .inputDeep >>> .el-input__inner {
    border: 0;
  }

  .word_table {
    margin-top: 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 2px 4px rgba(204, 205, 201, 0.1);
  }
</style>
