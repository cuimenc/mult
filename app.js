window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  alert("Error occured: " + errorMsg);//or any message
  return false;
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

var app = new Vue({
  el: '#app',
  data: {
    startTime: 0,
    lastTime: 0,
    correctCount: 0,
    wrongCount: 0,
    leftNum: 0,
    rightNum: 0,
    answer: 0,
    history: [],
  },

  computed: {
    duration: function () {
      let duration = Math.round((this.lastTime - this.startTime)/1000)
      return `${Math.round(duration/60).pad(2)}:${Math.round(duration%60).pad(2)}`;
    },

    answerText: function () {
      return this.answer ? this.answer : "";
    },
  },

  methods: {
    newTest: function () {
      this.startTime = Date.now();
      this.lastTime = Date.now();
      this.correctCount = 0;
      this.wrongCount = 0;
      this.history = [];

      // fire a timer
      this.nextQuestion();
    },

    nextQuestion: function () {
      this.leftNum = this.nextRand();
      this.rightNum = this.nextRand();
      this.answer = 0;
    },

    nextRand: function () {
      return Math.ceil(Math.random() * 8 + 1);
    },

    clearAnswer: function () {
      this.answer = 0;
    },

    checkHistory: function () {
      if (!this.history) {
        return;
      }

      alert(this.history.join('\n'));
    },

    inputKey: function (event) {
      if (!this.startTime) {
        return;
      }

      this.lastTime = Date.now();

      let val = parseInt(event.target.innerText)

      // check answer
      this.answer = this.answer * 10 + val;
      let expected = this.leftNum * this.rightNum;
      console.log(`this.answer=${this.answer}, expected=${expected}`);

      if (this.answer == expected) {
        this.correctCount++;
      } else if (!expected.toString().startsWith(this.answer.toString())) {
        this.wrongCount++;
        alert(`${this.leftNum} x ${this.rightNum} = ${expected}!`);
        this.history.push(`${this.leftNum} x ${this.rightNum} = ${this.answer}`);
      } else {
        // do nothing on partial answer
        return;
      }

      this.nextQuestion();
    },
  }
});
