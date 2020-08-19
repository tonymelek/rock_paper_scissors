const left = document.getElementById("left")
const userDisplay = document.getElementById("userDisplay")
const right = document.getElementById("right")
const header = document.getElementById("header")
const left_image = document.getElementById("left_image")
const right_image = document.getElementById("right_image")
p1Score = document.getElementById("p1Score")
p2Score = document.getElementById("p2Score")
p1Choice = document.getElementById("p1Choice")
p2Choice = document.getElementById("p2Choice")
const options = ["r", "p", "s"];

var userScore = 0
var computerScore = 0
var userInput;
var userD = 0
const headerItems = ["Rock", "Paper", "Scissors"]
var i = 0;
setInterval(() => {
    header.textContent = headerItems[i];
    left_image.src = "./images/0" + i + ".png"
    right_image.src = "./images/00" + i + ".png"
    i = (i + 1) % 3
}, 1000)



left.addEventListener("click", () => {
    userD == 0 ? userD += 2 : userD += -1
    userD = Math.abs(userD % 3)
    userDisplay.src = "./images/" + userD + ".png"
});
right.addEventListener("click", () => {
    userD++
    userD = Math.abs(userD % 3)
    userDisplay.src = "../images/" + userD + ".png"
});

userDisplay.addEventListener("click", () => {
    let userInput = "";
    if (userD == 0) {
        userInput = "r"
    } else if (userD == 1) {
        userInput = "p"
    }
    else {
        userInput = "s"
    }
    test(userInput)
});





function test(userInput) {
    var computerInput = options[Math.floor(Math.random() * 3)]

    p1Choice.src = "./images/" + userInput + ".png"
    p2Choice.src = "./images/" + computerInput + ".png"

    var truthTable = [["r", "p"], ["s", "r"], ["p", "s"]] // [[loser,winner]]
    for (element of truthTable) {
        if (computerInput === element[0] && userInput === element[1]) {
            userScore++;
            p1Score.textContent = userScore
        } else if (computerInput === element[1] && userInput === element[0]) {
            computerScore++;
            p2Score.textContent = computerScore
        }
    }
}

