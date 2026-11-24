//DOM Elements
const startScreen = document.getElementById("start-screen")
const paramsScreen = document.getElementById("params-screen")
const startButton = document.getElementById("start-btn");


// event list
startButton.addEventListener("click", startQuiz)

function startQuiz() {

    startScreen.classList.remove("active")
    paramsScreen.classList.add("active")

}