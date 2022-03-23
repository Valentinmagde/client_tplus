<template>
  <svg :height="size" :width="size" class="icon-svg">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="iconId"></use>
  </svg>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 20
      }
    },
    computed: {
      iconId() {
        return `#icon-${this.name}`;
      }
    }
  }
</script>
<style>
  .icon-svg {
    margin-right: 7px;
  }
</style>
