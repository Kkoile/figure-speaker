<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <Search/>
  </div>
</template>

<script>
  import Search from '@/components/Search'

  export default {
    name: 'Main',
    components: {
      Search
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
