window.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".wheel-circle");
  const pred = document.querySelector(".predict");
  const acc = document.querySelector(".accuracy");
  let answerArray = [];
  let currentAnswer;
  let mousedownTimestamp;
  let mouseupTimestamp;
  let prediction = Math.floor(Math.random() * 10) + 1;
  let initialPrediction = prediction;
  let accuracy = [];
  let selectedList = document.getElementsByTagName("li");
  let predictionList = [];

  function AccuracyChecker(acc, predictionList, answerArray, accuracy) {
    //Here I check whether the currentAnswer and prediciton are the same and push a 1 for yes and 0 for no
    Number(answerArray.slice(0, answerArray.length).pop()) ===
    predictionList[predictionList.length - 2]
      ? accuracy.push(1)
      : accuracy.push(0);

    //finally I work out the accuracy percentage and display it on the page
    var accuracyTotal = accuracy.reduce((a, b) => a + b);
    var accuracyPercentage = (accuracyTotal / accuracy.length) * 100;
    setTimeout(function () {
      acc.innerHTML = Math.round(accuracyPercentage) + "%";
    }, 1000);
  }

  function CurrentAnswerDetector(
    difference,
    currentAnswer,
    selectedList,
    answerArray
  ) {
    const ans = document.querySelector(".prevans");
    let rotations = Math.floor(difference / 360);
    let angle = difference - 360 * rotations;
    let answerLocation = Math.ceil(angle / 36);

    currentAnswer = selectedList[answerLocation - 1].getAttribute("data-value");
    answerArray.push(currentAnswer);
    setTimeout(() => (ans.innerHTML = answerArray), 1000);
    answerArray = answerArray.filter((n) => n !== 0);
  }

  function NumberPredictor(prediction, answerArray, predictionList, a, pred) {
    let arrWind = answerArray.slice(0, -1).map(Number);
    //if we only have one answer in the array, our next prediction was set in the initial constructor as a random number so set the prediction as that otherwise, work out the prediction via the moving window.
    answerArray.length === 1
      ? prediction
      : (prediction = arrWind
          .sort(function (a, b) {
            return (
              arrWind.filter((v) => v === a).length -
              arrWind.filter((v) => v === b).length
            );
          })
          .pop());

    //set the next prediction from above.
    pred.innerHTML = prediction;
    predictionList.push(prediction);
  }
  function RotateWheel(difference, el) {
    try {
      el.animate(
        [
          {
            transform: "rotate(0deg)",
          },
          {
            transform: "rotate(-" + difference + "deg)",
          },
        ],
        {
          duration: 1000,
          iterations: 1,
          easing: "ease-out",
        }
      );
    } catch (e) {
      document.querySelector(".error").innerHTML =
        "Your browser doesn't support animate(). No fun spining for you! Try Chrome ;)";
    }

    //change the style to stay at the last rotated state of the animation otherwise it will reset. This should occur even if the above animation doesn't work in a browser.
    el.style.transform = "rotate(-" + difference + "deg)";
  }

  //mouseDown or touchdown.
  el.onmousedown = (e) => mousedown();
  el.ontouchstart = (e) => mousedown();
  //MouseUp. Ditto above.
  el.onmouseup = (e) => mouseup();
  el.ontouchend = (e) => mouseup();

  function mousedown() {
    mousedownTimestamp = new Date();
  }
  function mouseup() {
    mouseupTimestamp = new Date();
    let difference = mouseupTimestamp - mousedownTimestamp;
    //rotates the wheel (on browsers that support .animate only such as chrome)
    RotateWheel(difference, el);
    //works out result
    CurrentAnswerDetector(difference, currentAnswer, selectedList, answerArray);
    //number predictor
    NumberPredictor(prediction, answerArray, predictionList, answerArray, pred);
    //accuray checker
    AccuracyChecker(acc, predictionList, answerArray, accuracy);
  }
  // an initial prediction is made and displayed randomly.
  pred.innerHTML = initialPrediction;
  predictionList.push(initialPrediction);
});
