let hunger;
let energy;
let happiness;
let currentPet;
let isHaunted = false;
let currentSongIndex = 0;
let isActing = false;

const defaultPets = ["bunny","cat","dog","dragon","panda"];
const pets = {
    cat: {
        folder: "Cat",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive = true
    },
    dog: {
        folder: "Dog",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive = true
    },
    panda: {
        folder: "Panda",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive = true
    },
    bunny: {
        folder: "Bunny",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive = true
    },
    dragon: {
        folder: "Dragon",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive = true
    },
    ghost: {
        folder: "Ghost",
        hungerDecay: 1.0,
        energyDecay: 1.0,
        happinessDecay: 1.0,
        interactive: false
    }
};

let savedData = localStorage.getItem("pip_pet_state");
if(savedData){
    let parsed = JSON.parse(savedData);
    hunger = parsed.hunger;
    energy = parsed.energy;
    happiness = parsed.happiness;
    currentPet = parsed.pet;
    let aliveList = parsed.aliveList || defaultPets;
    
    const selectElement = document.getElementById("petSelect");
    
    selectElement.innerHTML = "";
    
    aliveList.forEach(petValue => {
        let opt = document.createElement("option");
        opt.value = petValue;
        opt.innerText = petValue.charAt(0).toUpperCase() + petValue.slice(1);
        selectElement.appendChild(opt);
    });
    
    if(aliveList.length === 0){
        isHaunted = true;
        selectElement.disabled = true;
    } else {
        selectElement.value = currentPet;
    }
} else {
    hunger = 100;
    energy = 100;
    happiness = 100;
    currentPet = "cat";
    isHaunted = false;
    
    const selectElement = document.getElementById("petSelect");
    selectElement.disabled = false;
    
    selectElement.innerHTML = "";
    defaultPets.forEach(petValue => {
        let opt = document.createElement("option");
        opt.value = petValue;
        opt.innerText = petValue.charAt(0).toUpperCase() + petValue.slice(1);
        selectElement.appendChild(opt);
    });
    selectElement.value = currentPet;
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

const gameOverOverlay = document.getElementById("gameOverOverlay");
const gameOverText = document.getElementById("gameOverText");
const rebootBtn = document.getElementById("rebootBtn");

const bootScreen = document.getElementById("bootScreen");
const mainBootBtn = document.getElementById("bootBtn");

const feedSound = new Audio("./assets/Sound-Effects/eating.mp3");
const sleepSound = new Audio("./assets/Sound-Effects/sleep.wav");
const playSound = new Audio("./assets/Sound-Effects/yay.mp3");

const playlist = [
    "./assets/music/ddlc_main_theme.mp3",
    "./assets/music/ohayou_sayori.mp3"
];
const hauntedPlaylist = [
    "./assets/music/ending_music/ohayou_sayori_glitch.mp3",
    "./assets/music/ending_music/sayo_nara.mp3"
];

const bgMusic = new Audio(isHaunted ? hauntedPlaylist[currentSongIndex] : playlist[currentSongIndex]);
bgMusic.volume = 0.3;

function playNextSong() {
    let activeList = isHaunted ? hauntedPlaylist : playlist;
    currentSongIndex = (currentSongIndex + 1) % activeList.length;
    bgMusic.src = activeList[currentSongIndex];
    bgMusic.play().catch(error => console.log("Audio play blocked by the browser:"+error));
}
bgMusic.addEventListener("ended", playNextSong);

mainBootBtn.addEventListener('click', function() {
    bgMusic.play().catch(error => console.log("Audio play blocked:"+error));
    bootScreen.style.display = "none";
});

function setAnimation(state) {

    const petData = pets[currentPet];
    const image = `./assets/Pets/${folder}/${currentPet}_${state}_64.png`;
    pet.style.setProperty("--sprite", `url("${image}")`);
    pet.dataset.state = state;
}

hungerStatus.innerText = "Hunger: Good";
energyStatus.innerText = "Energy: Awake";
happinessStatus.innerText = "Happiness: Content";

petSelect.addEventListener("change", function(){
    currentPet = petSelect.value;
    const currentAnim = pet.dataset.state || "idle";
    setAnimation(currentAnim);
});

setInterval(function() {
    const petData = pets[currentPet];
    if (petData.interactive) {
        hunger -= petData.hungerDecay;
        energy -= petData.energyDecay;
        happiness -= petData.happinessDecay;
        
        feedBtn.disabled = false;
        sleepBtn.disabled = false;
        playBtn.disabled = false;
        feedBtn.className = "";
        sleepBtn.className = "";
        playBtn.className = "";
} else {
    hunger = 100;
    energy = 100;
    happiness = 100;
    feedBtn.className = "disabledBtn";
    sleepBtn.className = "disabledBtn";
    playBtn.className = "disabledBtn";
}

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
        currentAnimation = "sleep";
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
        happinessStatus.innerText = "Happiness: Happy!";
    }
    
    if(!isActing){
        setAnimation(currentAnimation);
    }
    
    if(hunger <= 0){
        gameOverText.innerText = `${currentPet.toUpperCase()} has left this world because of YOU....And he is NEVER coming BACK.`;
        gameOverOverlay.classList.remove("hidden");
        let currentOption = petSelect.querySelector(`option[value = ${currentPet}]`);
        if (currentOption) {
            currentOption.remove();
        }
        currentPet = "ghost";
        pet.className = "pet ghost idle";
        hunger = 100;
        energy = 100;
        happiness = 100;
    } else if(happiness <= 0){
        gameOverText.innerText = "Play with Pip if you want to stay with him.";
        gameOverOverlay.classList.remove("hidden");
        happiness = 20;
    } else if(energy <= 0){
        gameOverText.innerText = "Pip passed out from exhaustion! Giving him a forced nap.";
        gameOverOverlay.classList.remove("hidden");
        energy = 100;
    }
    
    let remainingPets = Array.from(petSelect.options).map(opt => opt.value);
    let gameState = {
        hunger: hunger,
        energy: energy,
        happiness: happiness,
        pet: currentPet,
        aliveList: remainingPets
    };
    localStorage.setItem("pip_pet_state", JSON.stringify(gameState));
}, 1000);

feedBtn.addEventListener('click', function(){
    feedSound.currentTime = 0;
    feedSound.play();
    if (hunger < 100 && !isActing){
        hunger += 15;
        if(hunger > 100) hunger = 100;
        hungerBar.value = hunger;
        isActing = true;
        setAnimation("jump");
        setTimeout(function() {
            isActing = false;
        }, 1000);
    }
});

sleepBtn.addEventListener('click', function(){
    sleepSound.currentTime = 0;
    sleepSound.play();
    if (energy < 100 && !isActing){
        energy += 20;
        if(energy > 100) energy = 100;
        energyBar.value = energy;
        isActing = true;
        setAnimation("sleep");
        setTimeout(function() {
            isActing = false;
        }, 2000); 
    }
});

playBtn.addEventListener('click', function(){
    playSound.currentTime = 0;
    playSound.play();
    if (happiness < 100 && !isActing){
        happiness += 10;
        if(happiness > 100) happiness = 100;
        happinessBar.value = happiness;
        isActing = true;
        setAnimation("happy");
        setTimeout(function() {
            isActing = false;
        }, 1000);
    }
});

rebootBtn.addEventListener('click', function(){
    gameOverOverlay.classList.add("hidden");

    if (petSelect.options.length > 0) {
        currentPet = petSelect.options[0].value;
        petSelect.value = currentPet;
        setAnimation("idle");
    } else {
        gameOverText.innerText = "G A M E  O V E R :  N O O N E' S  L E F T.";
        isHaunted = true;
        currentSongIndex = 0;

        bgMusic.pause();
        bgMusic.src = hauntedPlaylist[currentSongIndex];
        bgMusic.play().catch(e => console.log(e));
        currentPet = "ghost";
        pet.className = "pet ghost idle";
        petSelect.disabled = true;
    }
});