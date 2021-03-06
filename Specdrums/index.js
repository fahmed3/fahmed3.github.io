import Specdrum from "./Specdrums.js"
import MichaelMultiSynth from "./MichaelMultiSynth.js"

let specdrums = {};

let btn = document.getElementById("btn");
btn.addEventListener("click", connectSpec);


//how to do success vs failure callback when the function returns before it even finishes connecting? Apparently promises only return other promises
//
//temporary fix by just having Specdrum.connect() return a promise which we just continue to run with
function connectSpec() {
    //console.log(multiSynth.key);
    Specdrum.connect()
	.then(success, failure)
	.catch(error => { console.log(error); });
}

function success(spec){
    let multiSynth = new MichaelMultiSynth();
    let name = spec.device.name
    console.log("Connected New Specdrum: ", name);
    specdrums[spec.device.id] = spec;
    //console.log(specdrums);
    console.log(spec);
    console.log("Success!");
    spec.addEventListener("tap", (e) => multiSynth.attack(e.note, e.isChord) );
    spec.addEventListener("tap", (e) => console.log("tapped") );
    spec.addEventListener("release", (e) => multiSynth.release(e.isChord) );
    createGUI(spec, multiSynth);
    let volumeUp = document.getElementsByClassName("volume-up");
    for (let i = volumeUp.length-1; i > volumeUp.length-4; i--){
        let falseName = volumeUp[i].classList.item(1);
        volumeUp[i].classList.remove(falseName);
        volumeUp[i].classList.add(name);
    }
    spec.addEventListener("tap", () => {
        for (let i = 0; i < document.getElementsByClassName(name).length; i++){
            document.getElementsByClassName(name)[i].style.display ="block";
            console.log(name, "volume up");
        }
    })
    spec.addEventListener("release", () => {
        for (let i = 0; i < document.getElementsByClassName(name).length; i++){
            document.getElementsByClassName(name)[i].style.display ="none";
            console.log(name, "volume down");
        }
    })
}

function failure() {
    console.log("Failed to connect");
}

function createGUI(spec, multisynth){
    /* When Specdrum connects, show GUI */
    let wrap = document.getElementById("synth-wrap");
    let synth = document.getElementById("synth");
    // If connecting first Specdrum, show synth node
    if (synth.style.display == "none"){
        let s = document.getElementsByClassName("settings")[0];
        s.innerHTML = spec.device.name + ": Settings";
        let keyDD = document.getElementsByClassName('ddKey')[0];
        let keySelect = document.getElementsByClassName('dropdown-item-key');
        let synthDD = document.getElementsByClassName('ddSynth')[0];
        let synthSelect = document.getElementsByClassName('dropdown-item-synth');
        for (let i = 0; i < keySelect.length; i++){
            keySelect[i].addEventListener("click", ()=>{
                alterKey(keySelect[i].text, multisynth);
                keyDD.textContent = "Key: " + keySelect[i].text;
                console.log(keySelect[i].text);
                console.log(keyDD.textContent);
            })
        }
        for (let i = 0; i < synthSelect.length; i++){
            synthSelect[i].addEventListener("click", ()=>{
                alterSynth(synthSelect[i].classList[2], multisynth);
                synthDD.textContent = "Synth: " + synthSelect[i].text;
            })
        }
        synth.style.display = "block";
        console.log("block");
    }
    // If connecting further Specdrums, clone synth node and insert before video node
    else {
        let newGUI = synth.cloneNode(true);
        console.log(spec.device.name);
        let s = newGUI.getElementsByClassName("settings")[0];
        s.innerHTML = spec.device.name + ": Settings";
        let keyDD = newGUI.getElementsByClassName('ddKey')[0];
        let keySelect = newGUI.getElementsByClassName('dropdown-item-key');
        let synthDD = newGUI.getElementsByClassName('ddSynth')[0];
        let synthSelect = newGUI.getElementsByClassName('dropdown-item-synth');
        keyDD.textContent = "Key: C";
        synthDD.textContent = "Synth: Default";
        for (let i = 0; i < keySelect.length; i++){
            keySelect[i].addEventListener("click", ()=>{
                alterKey(keySelect[i].text, multisynth);
                keyDD.textContent = "Key: " + keySelect[i].text;
            })
        }
        for (let i = 0; i < synthSelect.length; i++){
            synthSelect[i].addEventListener("click", ()=>{
                alterSynth(synthSelect[i].classList[2], multisynth);
                synthDD.textContent = "Synth: " + synthSelect[i].text;
            })
        }
        // wrap.insertBefore(newGUI, )
        // wrap.append(newGUI);
        wrap.insertBefore(newGUI, document.getElementById("new"));
    }
    
}

function alterKey(newKey, multisynth){
    multisynth.setKey(newKey);
}

function alterSynth(newSynth, multisynth){
    multisynth.setSynth(newSynth);
}
