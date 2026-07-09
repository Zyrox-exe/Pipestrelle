let hunger = 100;
let energy = 100;
let happiness = 100;

const hungerBar = document.getElementById("hungerBar");
const feedBtn = document.getElementById("feedBtn");

const energyBar = document.getElementById("energyBar");
const sleepBtn = document.getElementById("sleepBtn");

const happinessBar = document.getElementById("happinessBar");
const playBtn = document.getElementById("playBtn");

const petFace = document.getElementById("petFace");
const energyStatus = document.getElementById("energyStatus");
const hungerStatus = document.getElementById("hungerStatus");
const happinessStatus = document.getElementById("happinessStatus");

petFace.innerText = "🦖";
hungerStatus.innerText = "Hunger: Good";
energyStatus.innerText = "Energy: Awake";
happinessStatus.innerText = "Happiness: Content";

// Bars
setInterval(function() {
    hunger = hunger - 0.9;
    energy = energy - 0.5;
    happiness = happiness - 0.75;

    if (hunger < 0) hunger = 0;
    if (energy < 0) energy = 0;
    if (happiness < 0) happiness = 0;

    hungerBar.value = hunger;
    energyBar.value = energy;
    happinessBar.value = happiness;

    
    if(hunger <= 30) {
        petFace.innerText = "😩🍖";
        hungerStatus.innerText = "Hunger: Starving";
    } else if(hunger > 30 && hunger < 60){
        petFace.innerText = "🤤🤤";
        hungerStatus.innerText = "Hunger: Wants Food";
    } else {
        hungerStatus.innerText = "Hunger: Full";
    }

    if(energy <= 30) {
        petFace.innerText = "🥱😪";
        energyStatus.innerText = "Energy: Tired";
    } else if(energy > 30 && energy < 60){
        petFace.innerText = "😴";
        energyStatus.innerText = "Energy: Getting Sleepy";
    } else {
        energyStatus.innerText = "Energy: Energetic";
    }

    if(happiness <= 30) {
        petFace.innerText = "😭💔";
        happinessStatus.innerText = "Lonely";
    } else if(happiness > 30 && happiness < 60){
        petFace.innerText = "🙁";
        happinessStatus.innerText = "Happiness: Bored";
    } else {
        happinessStatus.innerText = "Happiness: Happy!";
    }

    if(hunger <= 0){
        alert("Oh no! Pip ran away to find food. Feed him better next time!!!");
        hunger = 100; energy = 100; happiness = 100; petFace.innerText = "🦖"
    } else if(happiness <= 0){
        alert("Pip grew bored of you, so it left for more fun things. Play with him more next time!!!");
        hunger = 100; energy = 100; happiness = 100;
    } else if(energy <= 0){
        alert("Pip passed out from exhaustion! Giving him a forced nap.");
        energy = 100;
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
});

playBtn.addEventListener('click', function(){
    if (happiness < 100){
        happiness += 10;
        if(happiness > 100) happiness = 100;
        happinessBar.value = happiness;
    }
});