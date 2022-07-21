<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import index from './components/page/index'

  export default {
    name: 'App',
    components: {
      index
    },

  }
</script>

