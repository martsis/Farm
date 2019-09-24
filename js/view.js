const settings = require('./settings');
const blocks = require('./blocks');

const wrapper = document.createElement('div');
const canvas = document.createElement('canvas');
const totalIterationText = document.createElement('p');
const totalGenerationText = document.createElement('p');
const totalSurvivorText = document.createElement('p');
const toolbar = document.createElement('div');
const body = document.body;
const pauseButton = document.createElement('button');

const view = {
    context: null,
    init,
    pauseToggle,
    updateCanvas
}

function init(){
    document.body.append(wrapper);
    wrapper.append(canvas);
    wrapper.append(toolbar);
    wrapper.append(totalIterationText);
    wrapper.append(totalGenerationText);
    wrapper.append(totalSurvivorText);
    
    body.style.backgroundColor = '#000';
    wrapper.style.width = `${settings.VIEW_WIDHT}px`;
    wrapper.style.margin = 'auto';
    
    // canvas
    view.context = canvas.getContext('2d');
    canvas.style.backgroundColor = '#FFF';
    canvas.width = settings.VIEW_WIDHT;
    canvas.height = settings.VIEW_HEIGHT;
    
    // toolbar
    pauseButton.textContent = "Start";
    pauseButton.addEventListener('click', pauseToggle);
    toolbar.append(pauseButton);
    
    totalIterationText.style.color = '#FFF';
    totalGenerationText.style.color = '#FFF';
    totalSurvivorText.style.color = '#FFF';
}

function pauseToggle(){
    settings.isPaused = !settings.isPaused;

    if (settings.isPaused) {
        pauseButton.textContent = 'Play';
    } else {
        pauseButton.textContent = 'Pause';
    }
}

function infoUpdate(){
    totalIterationText.textContent = `Iterations: ${settings.totalIterations}`;
    totalGenerationText.textContent = `Generation: ${settings.totalGenerations}`;
    totalSurvivorText.textContent = `Survivors: ${settings.totalSurvivors}`;
}

function updateCanvas(){
    requestAnimationFrame(updateCanvas);
    infoUpdate();
    canvas.width = canvas.width;

    for (const index in blocks.unicellulars){
        blocks.unicellulars[index].draw();
    }

    for (const index in blocks.foods){
        blocks.foods[index].draw();
    }

    for (const index in blocks.walls){
        blocks.walls[index].draw();
    }
}

module.exports = view;