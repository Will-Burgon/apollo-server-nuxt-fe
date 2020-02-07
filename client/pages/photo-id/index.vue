<template>
  <v-app>
    <v-container d-flex justify-center>

     <v-card width="50%">
         <v-layout class="mb-6">
          <v-flex justify-center>
            <h1 display-1 font-weight-bold class="text-center"> Enter a number below </h1>
            <h4 class="text-center">This will be how long your code is</h4>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" style="margin: 0 auto;">
             <v-text-field

              label="Length of Code"
              type="number"
              required
                outlined
              v-model="codeLength"
              class="mt-6"
              @change.capture="calculateCode"
              v-on:keydown.enter="captureEnter"
              ref="inputField"
              ></v-text-field>
               <input type="hidden" id="finished-now" :value="finishedNow">
            </v-col>
            <v-layout d-flex justify-center>
              <h2 class="text-center">{{ finishedNow }}</h2>
             <v-btn v-if="finishedNow.length" color="success" absolute right
             @click.prevent="copyToClipboard">Copy</v-btn>
             <v-btn v-if="finishedNow.length" color="warning" absolute left
             @click.prevent="resetInput">Reset</v-btn>

            </v-layout>

          </v-flex>
         </v-layout>
     </v-card>

    </v-container>
  </v-app>
</template>

<script>
export default {
data(){
  return {
    codeLength: 0,
    finishedNow: ""
  }
},
methods: {
  calculateCode() {
    const lowLettersStr = 'abcdefghijklmnopqrstuvwxyz';
    const bigLettersStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbersStr = '0123456789';
    const symbolStr = '-_.~'
    function randomGen(...args){
        const randomString = args.reduce((acc, cur)=>{
         return   acc.concat(cur)
        }, "" )
        return Array.from(randomString.split("").join(""))
    }
    const reducedArr = randomGen(lowLettersStr, bigLettersStr, numbersStr, symbolStr);
    let nearlyFinished = [];
    [...Array(parseFloat(this.codeLength)).keys()].forEach((el, i) => {
       i =  Math.floor(Math.random() * reducedArr.length)
    nearlyFinished.push(reducedArr[i])
    this.finishedNow = nearlyFinished.join("");

    })
  },
  copyToClipboard() {
      let codeToCopy = document.getElementById("finished-now");
      codeToCopy.setAttribute("type", "text");
      codeToCopy.select();
         try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            alert('Code copying was ' + msg);
          } catch (err) {
            alert('Oops, unable to copy');
          }
          codeToCopy.setAttribute('type', 'hidden')
          window.getSelection().removeAllRanges();
          //this.inputElement.$refs.input.disabled = false
          this.resetInput()
    },
    captureEnter(e){
      e.target.setAttribute("disabled", true)
    },
    resetInput() {
       this.inputElement.$refs.input.disabled = false;
        this.inputElement.$refs.input.value = 0;
        this.finishedNow = "";
        this.codeLength = 0;
    }
},
computed: {
  inputElement(){
      const { inputField } = this.$refs;
      return inputField
  }
},
middleware: "isAuth"
}
</script>

<style lang="scss">

</style>
