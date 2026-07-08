let hunger = 100;
let energy = 100;
let happiness = 100;

const hungerBar = document.getElementById("hungerBar");
const feedBtn = document.getElementById("feedBtn");

const energyBar = document.getElementById("energyBar");
const sleepBtn = document.getElementById("sleepBtn");

const happinessBar = document.getElementById("happinessBar");
const playBtn = document.getElementById("playBtn");

setInterval(function() {
    hunger = hunger - 0.9;
    energy = energy - 0.5;
    happiness = happiness - 0.75;

    hungerBar.value = hunger;
    energyBar.value = energy;
    happinessBar.value = happiness;

    if(hunger <= 0 || happiness <= 0){
        alert("Oh no! Pip ran away to find food. Feed him better next time!!!");
        hunger = 100;
        energy = 100;
        happiness = 100;
    }
}, 1000);