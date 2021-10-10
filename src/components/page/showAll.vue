<template>
  <div>
    <div class="col-md-12">
      <el-button type="primary" style="text-align: center" @click="show_all" round>重置列表</el-button>
      <el-button type="success" style="text-align: center" @click="upset" round>打乱顺序</el-button>
      <el-button type="danger" style="text-align: center" @click="check_all" round>全部检错</el-button>
      <div style="float: right">
        <span style="margin-right: 5px">选择日期</span>
        <el-date-picker
          v-model="date"
          type="date"
          @change="date_change"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </div>
    <el-table
      :data="result.word_list.slice(0,page_size)"
      height="500"
      style="width: 100%"
      ref="table">
      <el-table-column
        label="序号"
        prop="id"
        type="index"
        sortable
        :index="indexMethod"
        width="150px"
      >
      </el-table-column>
      <el-table-column
        label="单词"
        sortable
        prop="word"
        v-if="is_hide_word">
      </el-table-column>
      <el-table-column
        label="中文意思"
        prop="mean"
        v-if="is_hide_mean">
      </el-table-column>
      <el-table-column
        label="检测"
        prop="word"
      >
        <template slot-scope="scope"
                  ref="word_column"
        >
          <el-input v-if="!is_hide_word" placeholder="word"
                    v-model="word_model[scope.$index]"></el-input>
          <el-input v-else-if="!is_hide_mean" placeholder="中文含义"
                    v-model="mean_model[scope.$index]"></el-input>
          <span v-else-if="word_model[scope.$index]==undefined&&mean_model[scope.$index]==undefined">待检测</span>
          <span v-else-if="word_model[scope.$index]!=undefined&&mean_model[scope.$index]==undefined">{{word_model[scope.$index]}}</span>
          <span v-else-if="word_model[scope.$index]==undefined&&mean_model[scope.$index]!=undefined">{{mean_model[scope.$index]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" size="mini" @click="hide_mean" v-show="is_hide_mean">隐藏/显示中文</el-button>
          <el-button type="success" size="mini" @click="hide_word" v-show="is_hide_word" style="margin-top: 10px">
            隐藏/显示英文
          </el-button>
        </template>
        <template slot-scope="scope">
          <i :class="result_show[scope.$index]?'el-icon-success':'el-icon-error'"
             :style="result_show[scope.$index]?{color:'green'}:{color:'red'}"></i>
          <el-button
            size="mini"
            type="danger"
            @click="check_one(scope.$index, scope.row)">检错
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="right"
      style="margin-top: 10px"
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

  export default {
    name: "showAll",
    data() {
      return {
        date: "",
        result_show: [],
        word_model: [],
        mean_model: [],
        total_page: 0,
        page_size: 30,
        current_page: 1,
        is_hide_word: true,
        is_hide_mean: true,
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
      date_change() {
        this.getAllWord(this.current_page, this.page_size)
      },
      check_all() {
        var count = 0;
        for (var i = 0; i < this.result.word_list.length; i++) {
          if (this.word_model[i] == this.result.word_list[i].word) {
            this.result_show[i] = true
            count++;
          } else {
            this.result_show[i] = false
          }
        }
        this.$message.success("本次检错共" + this.page_size + "个，正确" + count + "个，继续加油！")
      },
      upset() {
        this.result.word_list.sort(function () {
          return .5 - Math.random();
        });
        this.word_model = [];
        this.mean_model = [];
      },
      check_one(index, word_object) {
        if (word_object.word === this.word_model[index]) {
          this.$message.success("正确");
          this.result_show[index] = true
        } else {
          this.$message.error("错误");
          this.result_show[index] = false
        }
      },
      change_current_page(val) {
        this.current_page = val;
        this.getAllWord(this.current_page, this.page_size);
        this.word_model = [];
        this.mean_model = [];
        this.result_show = [];
      },
      change_size(val) {
        this.page_size = val;
        this.getAllWord(this.current_page, this.page_size);
        this.result_show = [];
        this.word_model = [];
        this.mean_model = [];
      },
      show_all() {
        this.is_hide_mean = true;
        this.is_hide_word = true;
      },
      hide_mean() {
        this.is_hide_mean = !this.is_hide_mean;
        this.is_hide_word = !this.is_hide_mean;
        this.word_model = []
      },
      hide_word() {
        this.is_hide_word = !this.is_hide_word;
        this.is_hide_mean = !this.is_hide_word;
        this.mean_model = []
      },
      getAllWord(page, pageSize) {
        if (this.user.uid != undefined) {
          var url = "";
          if (this.date == "" || this.date == null) {
            url = "/query/" + this.user.uid + "/" + page + "/" + pageSize
          } else {
            var date_list = this.date.split("-");
            url = "/query/" + this.user.uid + "/" + page + "/" + pageSize + "/" + date_list[0] + "/" + date_list[1] + "/" + date_list[2]
          }
          this.axios.get(url).then(response => {
            // console.log(response);
            this.result.word_count = response.data.word_count;
            this.result.word_list = response.data.word_list;
            this.result.message = response.data.message;
            this.total_page = this.result.word_count / this.page_size;
            if (this.result.word_count === 0 && this.result.word_list.length === 0) {
              this.$message.warning(this.result.message)
            } else if (this.result.word_count != 0 && this.result.word_list.length === 0) {
              this.result.message = "没有多余的单词了";
              this.$message.warning(this.result.message)
            } else {
              // console.log("111111")
              console.log(this.result.word_list)
            }
          })
        } else {
          this.$message.error("登录已过期，请重新登录")
          this.$router.push("/signIn")
        }
      }
    }
    ,
    mounted() {
      this.getAllWord(0, this.page_size)
    }
  }
</script>

<style scoped>
  .transition-box {
    /*margin-top: 10px;*/
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    /*padding: 40px 20px;*/
    /*box-sizing: border-box;*/
    margin-right: 20px;
  }
</style>
