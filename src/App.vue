<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
<!--    <HelloWorld/>-->
<!--    <index/>-->
    <router-view></router-view>
  </div>
</template>

<script>
import index from './components/page/index'

export default {
  name: 'App',
  components: {
    index
  }
}
</script>


