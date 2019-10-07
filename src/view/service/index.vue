<template>
  <div class="service">
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
  },
  computed: {
    ...mapState({
      content: state => state.home.content
    })
  },

  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      search: state => state.home.search
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    
  }
};
</script>

<style lang="scss">
.service{
  
}
</style>
