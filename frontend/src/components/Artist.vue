<template>
  <div class="hello">
    <h1>Artist</h1>
    <h2>{{ id }}</h2>
  </div>
</template>

<script>
  export default {
    id: 'HelloWorld',
    data () {
      return {
        id: this.$route.params.id
      }
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
