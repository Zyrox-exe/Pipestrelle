//=============Global Variables================
let hunger;
let energy;
let happiness;
let currentPet;
let isHaunted = false;
let currentSongIndex = 0;
let isActing = false;
let nextBehaviourTime = Date.now() + 15000;
//========Pets Data===============
const defaultPets = ["bunny","cat","dog","dragon","panda"];
const pets = {
    cat: {
        folder: "Cat",
        hungerDecay: 0.8,
        energyDecay: 0.4,
        happinessDecay: 0.35,
        interactive: true,

        feed: 15,
        sleep: 25,
        play: 8,
        ignorePlayChance: 0.30
    },
    dog: {
        folder: "Dog",
        hungerDecay: 1,
        energyDecay: 0.7,
        happinessDecay: 1.2,
        interactive: true,

        feed: 15,
        sleep: 18,
        play: 20,
        excitementChance: 0.40
    },
    panda: {
        folder: "Panda",
        hungerDecay: 0.7,
        energyDecay: 0.25,
        happinessDecay: 0.45,
        interactive: true,

        feed: 20,
        sleep: 35,
        play: 10,
        extraSleepChance: 0.50
    },
    bunny: {
        folder: "Bunny",
        hungerDecay: 1.3,
        energyDecay: 0.8,
        happinessDecay: 0.9,
        interactive: true,

        feed: 12,
        sleep: 20,
        play: 18,
        extraHopChance: 0.35
    },
    dragon: {
        folder: "Dragon",
        hungerDecay: 1.6,
        energyDecay: 0.6,
        happinessDecay: 0.25,
        interactive: true,

        feed: 30,
        sleep: 15,
        play: 5,
        angryThreshold: 20
    },
    ghost: {
        folder: "Ghost",
        hungerDecay: 0,
        energyDecay: 0,
        happinessDecay: 0,
        interactive: false,

        feed: 0,
        sleep: 0,
        play: 0
    }
};

const petSpeech = {
    cat:[
        "Leave me alone.",
        "...",
        "Meow",
        "I am watching you."
    ],
    dog:[
        "woof!",
        "Play with me!",
        "You're back, woof!!",
        "That was nice."
    ],
    bunny:[
        "Hop!",
        "Did you get my Carrots?",
        "Let's Bounce",
        "Hop, Hop!"
    ],
    panda:[
        "Five more minutes...",
        "*yawn*",
        "I'm sleepy.",
        "Meh!"
    ],
    dragon:[
        "Feed me!",
        "Roar!",
        "I'm hungry.",
        "Get Away insect!"
    ],
}
//==============Pets Animation================
function setAnimation(state) {
    const petData = pets[currentPet];
    if (!petData) return;
    
    const folder = petData.folder;
    const image = `./assets/Pets/${folder}/${currentPet}_${state}_64.png`;
    
    const petElement = document.querySelector(".pet");
    if (petElement) {
        petElement.style.setProperty("--sprite", `url("${image}")`);
        petElement.dataset.state = state;
    }
}
//=========More global constants===============
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

const speechBubble = document.getElementById("speechBubble");


const playlist = [
    "./assets/music/ddlc_main_theme.mp3",
    "./assets/music/ohayou_sayori.mp3"
];
const hauntedPlaylist = [
    "./assets/music/ending_music/ohayou_sayori_glitch.mp3",
    "./assets/music/ending_music/sayo_nara.mp3"
];
const backgrounds = [
    "./assets/images/Backgrounds/bg_Autumn.png",
    "./assets/images/Backgrounds/bg_spring.png",
    "./assets/images/Backgrounds/bg_summer.png",
    "./assets/images/Backgrounds/bg_winter.png"
]
let currentBackground = 0;
function changeBackground(index){
    gameContainer.querySelector(".arcadeScreen").style.backgroundImage = `url(${backgrounds[index]})`;
}
setInterval(() => {
    currentBackground++;
    if(currentBackground >= backgrounds.length)
        currentBackground = 0;
    changeBackground(currentBackground);
},60000);
//============Local Storage=================
let savedData = localStorage.getItem("pip_pet_state");
if(savedData){
    let parsed = JSON.parse(savedData);
    hunger = parsed.hunger;
    energy = parsed.energy;
    happiness = parsed.happiness;
    currentPet = parsed.pet;
    let aliveList = parsed.aliveList || defaultPets;
    
    petSelect.innerHTML = "";
    aliveList.forEach(petValue => {
        let opt = document.createElement("option");
        opt.value = petValue;
        opt.innerText = petValue.charAt(0).toUpperCase() + petValue.slice(1);
        petSelect.appendChild(opt);
    });
    
    if(aliveList.length === 0){
        isHaunted = true;
        petSelect.disabled = true;
    } else {
        petSelect.value = currentPet;
    }
} else {
    hunger = 100;
    energy = 100;
    happiness = 100;
    currentPet = "cat";
    isHaunted = false;
    
    petSelect.disabled = false;
    petSelect.innerHTML = "";
    defaultPets.forEach(petValue => {
        let opt = document.createElement("option");
        opt.value = petValue;
        opt.innerText = petValue.charAt(0).toUpperCase() + petValue.slice(1);
        petSelect.appendChild(opt);
    });
    petSelect.value = currentPet;
}
//===========Music========
const bgMusic = new Audio(isHaunted ? hauntedPlaylist[currentSongIndex] : playlist[currentSongIndex]);
bgMusic.volume = 0.3;

function playNextSong() {
    let activeList = isHaunted ? hauntedPlaylist : playlist;
    currentSongIndex = (currentSongIndex + 1) % activeList.length;
    bgMusic.src = activeList[currentSongIndex];
    bgMusic.play().catch(error => console.log("Audio play blocked by the browser:"+error));
}
bgMusic.addEventListener("ended", playNextSong);

hungerStatus.innerText = "Hunger: Good";
energyStatus.innerText = "Energy: Awake";
happinessStatus.innerText = "Happiness: Content";
setAnimation("idle");

mainBootBtn.addEventListener('click', function() {
    bgMusic.play().catch(error => console.log("Audio play blocked:"+error));
    bootScreen.style.display = "none";
});

petSelect.addEventListener("change", function(){
    currentPet = petSelect.value;
    const currentAnim = pet.dataset.state || "idle";
    setAnimation(currentAnim);
});
// ============Pet Behavours==============
function randomBehaviour() {
    speak()
    if (isActing) return;
    switch (currentPet) {
        case "bunny":
            bunnyBehaviour();
            break;
        case "cat":
            catBehaviour();
            break;
        case "dog":
            dogBehaviour();
            break;
        case "dragon":
            dragonBehaviour();
            break;
        case "panda":
            pandaBehaviour();
            break;
    }
    nextBehaviourTime = Date.now() + 15000 + Math.random() * 15000;
}
function dogBehaviour() {
     isActing = true;
     setAnimation("happy");
     setTimeout(() => { isActing = false;}, 1000);
}
function bunnyBehaviour() {
     isActing = true;
     setAnimation("jump");
     setTimeout(() => { isActing = false;}, 1000);
}
function pandaBehaviour() {
     isActing = true;
     setAnimation("sleep");
     sleepSound.play();
     setTimeout(() => { isActing = false;}, 2000);
}
function dragonBehaviour() {
    const petData = pets[currentPet];
    if(hunger> petData.angryThreshold) return;
     isActing = true;
     setAnimation("jump");
     setTimeout(() => { isActing = false;}, 1000);
}
function catBehaviour() {
    if (Math.random() < pets[currentPet].ignorePlayChance)
        return;
     isActing = true;
     setAnimation("sleep");
     setTimeout(() => { isActing = false;}, 2000);
}
function speak(){
    const list = petSpeech[currentPet];
    if(!list) return;
    speechBubble.innerText = list[Math.floor(Math.random()*list.length)];
    speechBubble.classList.remove("hidden");
    setTimeout(() => {
        speechBubble.classList.add("hidden");
    }, 2500);
}
// ===========Progress Logic=================
setInterval(function() {
    const petData = pets[currentPet];
    if (!petData) return;

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
        feedBtn.disabled = true;
        sleepBtn.disabled = true;
        playBtn.disabled = true;
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
        hunger = 100;
        energy = 100;
        happiness = 100;
        setAnimation("idle");
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
    }
    if (Date.now() >= nextBehaviourTime) {
        randomBehaviour();
    };
    localStorage.setItem("pip_pet_state", JSON.stringify(gameState));
}, 1000);
// ===============Buttons==============
feedBtn.addEventListener('click', function(){
    const petData = pets[currentPet];
    if (hunger >= 100 || isActing || !petData.interactive) return;
    feedSound.currentTime = 0;
    feedSound.play();
    hunger = Math.min(100, hunger + petData.feed);
    hungerBar.value = hunger;
    isActing = true;
    setAnimation("jump");
    setTimeout(() => {isActing = false;}, 1000);
});

sleepBtn.addEventListener('click', function(){
    const petData = pets[currentPet];
    if (energy >= 100 || isActing || !petData.interactive) return;
    sleepSound.currentTime = 0;
    sleepSound.play();
    energy = Math.min(100, energy + petData.sleep);
    energyBar.value = energy;
    isActing = true;
    setAnimation("sleep");
    const duration = Math.random() < (petData.extraSleepChance || 0) ? 4000 : 2000;
    setTimeout(() => {
       isActing = false; 
    }, duration);
});

playBtn.addEventListener('click', function(){
    const petData = pets[currentPet];
    if (happiness >= 100 || isActing || !petData.interactive) return;
    if(Math.random()<(petData.ignorePlayChance || 0)) {
        return;
    }
    playSound.currentTime = 0;
    playSound.play();
    happiness = Math.min(100, happiness + petData.play);

    if (Math.random() < (petData.excitementChance || 0)){
        happiness = Math.min(100, happiness + 5);
    }
    happinessBar.value = happiness;
    isActing = true;
    setAnimation("happy");
    setTimeout(() => {
        if(Math.random()<(petData.extraHopChance || 0)){
            setAnimation("jump")
            setTimeout(() => {
                    isActing = false;
                }, 1000);
        } else {
            isActing = false;
        }
        
    }, 1000);
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
        petSelect.disabled = true;
        setAnimation("idle");
    }
});