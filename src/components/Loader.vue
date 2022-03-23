<template>
    <div class="loading-bg">
      <div class="loading-cube-m76dib0u8us">
        <div class="loader-70hwl0ihryg">
          <div id="line-1">
            <div></div><div></div>
          </div>
          <div id="line-2">
            <div></div><div></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="css">
    @keyframes loader-70hwl0ihryg {
        0% { transform: scale(1.1500000000000001) }
        100% { transform: scale(1) }
    }
    .loader-70hwl0ihryg  #line-1 > div, .loader-70hwl0ihryg  #line-2  > div{
        position: relative;
        width: 30px;
        height: 30px;
        margin: auto;
        background: #1c4595;
        animation: loader-70hwl0ihryg 1s cubic-bezier(0,0.5,0.5,1) infinite;
        animation-delay: -0.3s;
    }
    .loader-70hwl0ihryg  #line-1 div:nth-child(1) {
        display: inline-block;
        margin: 0 4px;
    }
    .loader-70hwl0ihryg  #line-1 div:nth-child(2) {
        display: inline-block;
        margin: 0 4px;
        background: #24c5e7;
        animation-delay: -0.2s;
    }
    .loader-70hwl0ihryg  #line-2 div:nth-child(1) {
        display: inline-block;
        margin: 0 4px;
        background: #1aa740;
        animation-delay: 0s;
    }
    .loader-70hwl0ihryg  #line-2 div:nth-child(2) {
        display: inline-block;
        margin: 0 4px;
        background: #e76a24;
        animation-delay: -0.1s;
    }
    .loading-cube-m76dib0u8us {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: hsla(0,0%,100%,.6);
        z-index: 300000 !important;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
    }
    .loader-70hwl0ihryg {
        position: fixed;
        margin: auto;
    }
    .loader-70hwl0ihryg div { box-sizing: content-box; }
</style>


