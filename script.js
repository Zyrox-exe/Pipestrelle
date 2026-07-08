let hunger = 100;
let energy = 100;
let happiness = 100;

const hungerBar = document.getElementById("hungerBar");
const feedBtn = document.getElementById("feedBtn");

const energyBar = document.getElementById("energyBar");
const sleepBtn = document.getElementById("sleepBtn");

const happinessBar = document.getElementById("happinessBar");
const playBtn = document.getElementById("playBtn");

// Bars
setInterval(function() {
    hunger = hunger - 0.9;
    energy = energy - 0.5;
    happiness = happiness - 0.75;

    hungerBar.value = hunger;
    energyBar.value = energy;
    happinessBar.value = happiness;

    if(hunger <= 0){
        alert("Oh no! Pip ran away to find food. Feed him better next time!!!");
        hunger = 100;
        energy = 100;
        happiness = 100;
    } else if(happiness <= 0){
        alert("Pip grew bored of you, so it left for more fun things. Play with him more next time!!!");
        hunger = 100;
        energy = 100;
        happiness = 100;
    }
    else if(energy <= 0){
        alert("Pip is sleeping, give it some rest!!!");
    }
}, 1000);

// Buttons
feedBtn.addEventListener('click', function(){
    if (hunger < 100){
        hunger += 15;
        if(hunger > 100) hunger = 100;
        hungerBar.value = hunger;
    }
});

sleepBtn.addEventListener('click', function(){
    if (energy < 100){
        energy += 20;
        if(energy > 100) energy = 100;
        energyBar.value = energy;
    }
playBtn.addEventListener('click', function(){
    if (happiness < 100){
        happiness += 10;
        if(happiness > 100) happiness = 100;
        happinessBar.value = happiness;
    }
})
})