<template>
  <div id="app" style="max-width: 3000px;margin: 20px">
    <div class="row" style="margin: 20px">
      <div class="col-md-offset-2 col-md">
        <div class="page-header" style="background-color: #000000">
          <el-image src="static/logo.jpg" style="width: 160px;margin: 20px"/>
        </div>
      </div>
    </div>
    <div class="row" style="margin-left: 20px">
      <div class="col-md-2 col-md-offset-2">
        <div class="list-group">
<!--          <router-link to="/reviewWord" class="list-group-item" active-class="active">复习单词</router-link>-->
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
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'

  export default {
    data() {
      return {
        tagsList: [],
        collapse: false
      };
    },
    created() {
    }
  };
</script>
<style>
  .list-group-item {
    color: #7f7f7f;
  }
</style>
