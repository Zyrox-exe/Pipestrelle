let hunger;
let energy;
let happiness;
let currentPet;

let savedData = localStorage.getItem("pip_pet_state")
if(savedData){
    let parsed = JSON.parse(savedData);
    hunger = parsed.hunger;
    energy = parsed.energy;
    happiness = parsed.happiness;
    currentPet = parsed.pet;
    document.getElementById("petSelect").value = currentPet;
} else{
    hunger = 100;
    energy = 100;
    happiness = 100;
    currentPet = "cat";
}


const hungerBar = document.getElementById("hungerBar");
const feedBtn = document.getElementById("feedBtn");

const energyBar = document.getElementById("energyBar");
const sleepBtn = document.getElementById("sleepBtn");

const happinessBar = document.getElementById("happinessBar");
const playBtn = document.getElementById("playBtn");

const energyStatus = document.getElementById("energyStatus");
const hungerStatus = document.getElementById("hungerStatus");
const happinessStatus = document.getElementById("happinessStatus");

const pet = document.querySelector(".pet");

const petSelect = document.getElementById("petSelect");
const gameContainer = document.getElementById("container");

hungerStatus.innerText = "Hunger: Good";
energyStatus.innerText = "Energy: Awake";
happinessStatus.innerText = "Happiness: Content";


petSelect.addEventListener("change", function(){
    currentPet = petSelect.value;
    let currentAnim = pet.className.split(" ")[1] || "idle";
    pet.className = `pet ${currentPet} ${currentAnim}`;
});

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

    let currentAnimation = "idle";

    if(hunger <= 30) {
        hungerStatus.innerText = "Hunger: Starving";
    } else if(hunger > 30 && hunger < 60){
        hungerStatus.innerText = "Hunger: Wants Food";
    } else {
        hungerStatus.innerText = "Hunger: Full";
    }

    if(energy <= 30) {
        currentAnimation = "sleep"
        energyStatus.innerText = "Energy: Tired";
    } else if(energy > 30 && energy < 60){
        energyStatus.innerText = "Energy: Getting Sleepy";
    } else {
        energyStatus.innerText = "Energy: Energetic";
    }

    if(happiness <= 30) {
        happinessStatus.innerText = "Lonely";
    } else if(happiness > 30 && happiness < 60){
        happinessStatus.innerText = "Happiness: Bored";
    } else {
        max = 100;
        happinessStatus.innerText = "Happiness: Happy!"
    }
        pet.className = `pet ${currentPet} ${currentAnimation}`
    
    if(hunger <= 0){
        alert("Oh no! Pip ran away to find food. Feed him better next time!!!");
        hunger = 100; energy = 100; happiness = 100;
    } else if(happiness <= 0){
        alert("Pip grew bored of you, so it left for more fun things. Play with him more next time!!!");
        hunger = 100; energy = 100; happiness = 100;
    } else if(energy <= 0){
        alert("Pip passed out from exhaustion! Giving him a forced nap.");
        energy = 100;
    }

    let gameState = {
        hunger: hunger,
        energy: energy,
        happiness: happiness,
        pet: currentPet
    };
    localStorage.setItem("pip_pet_state", JSON.stringify(gameState));
}, 1000);

// Buttons
feedBtn.addEventListener('click', function(){
    if (hunger < 100){
        hunger += 15;
        if(hunger > 100) hunger = 100;
        hungerBar.value = hunger;
        pet.className = `pet ${currentPet} jump`
    }
});

sleepBtn.addEventListener('click', function(){
    if (energy < 100){
        energy += 20;
        if(energy > 100) energy = 100;
        energyBar.value = energy;
        pet.className = `pet ${currentPet} sleep`
    }
});

playBtn.addEventListener('click', function(){
    if (happiness < 100){
        happiness += 10;
        if(happiness > 100) happiness = 100;
        happinessBar.value = happiness;
        pet.className = `pet ${currentPet} happy`
    }
});