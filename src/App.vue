<template>
  <div id="app">
    <transition name="fold">
      <keep-alive include="Index">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
  },
  mounted () {
    document.addEventListener('visibilitychange', () => {
      var isHidden = document.hidden
      if (isHidden) {
        // document.title = '隐藏'
      } else {
        // document.title = '显示'
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import url("./css/bases.scss");
.fold-enter-active {
  animation-name: fold-in;
  animation-duration: .3s;
}
.fold-leave-active {
  animation-name: fold-out;
  animation-duration: .3s;
}

@keyframes fold-in {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fold-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 0;
  }
}

#app{
  // background: $theme-lan;
}
</style>
