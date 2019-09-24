"use strict";

const wrapper = document.createElement('div');
const canvas = document.createElement('canvas');
const totalIterationText = document.createElement('p');
const totalGenerationText = document.createElement('p');
const totalSurvivorText = document.createElement('p');
const toolbar = document.createElement('div');
const body = document.body;
const pauseButton = document.createElement('button');

document.body.append(wrapper);
wrapper.append(canvas);
wrapper.append(toolbar);
wrapper.append(totalIterationText);
wrapper.append(totalGenerationText);
wrapper.append(totalSurvivorText);

body.style.backgroundColor = '#000';
wrapper.style.width = `${VIEW_WIDHT}px`;
wrapper.style.margin = 'auto';

// canvas
const context = canvas.getContext('2d');
canvas.style.backgroundColor = '#FFF';
canvas.width = VIEW_WIDHT;
canvas.height = VIEW_HEIGHT;

// toolbar
pauseButton.textContent = "Start";
pauseButton.addEventListener('click', pauseToggle);
toolbar.append(pauseButton);

totalIterationText.style.color = '#FFF';
totalGenerationText.style.color = '#FFF';
totalSurvivorText.style.color = '#FFF';

if ('unicellulars' in localStorage && saveEnabled){
    const unicsStors = JSON.parse(localStorage['unicellulars']);
    for (const index in unicsStors){
        unicellulars[index] = new Unicellular(context, unicsStors[index].positionX, unicsStors[index].positionY, unicsStors[index].iterator);

        unicellulars[index].nda = unicsStors[index].nda;
        
        if (index > Unicellular.count){
            Unicellular.count = index;
        }
    }
    Unicellular.count++;
}

if (Object.keys(unicellulars).length == 0){
    while (Object.keys(unicellulars).length < UNICELLULAR_COUNT) {
        const newPosition = getNewPosition();
        unicellulars[Unicellular.count++] = new Unicellular(context, newPosition.x,
            newPosition.y);
    }
} else {
    for (let i = 0; i < UNICELLULAR_CHILDREN; i++) {
        const newPosition = getNewPosition();
        unicellulars[Unicellular.count++] = new Unicellular(context, newPosition.x,
            newPosition.y);
    }
}


while (Food.count < FOOD_COUNT) {
    const newPosition = getNewPosition();
    let isIntoxicated = false;

    if (!(getRandomInt(0, 100) > INTOXICATE_PROB)){
        isIntoxicated = true;
    }
    
    foods[Food.count++] = new Food(context, newPosition.x,
        newPosition.y, isIntoxicated);
}

while (Wall.count < WALL_COUNT) {
    const newPosition = getNewPosition();
    
    walls[Wall.count++] = new Wall(context, newPosition.x,
        newPosition.y);
}


updateCanvas();
setInterval(iterations, 0);



function iterations() {
    if (!isPaused){
        totalIterations++;
        const survivor = Object.keys(unicellulars).length;

        for (const index in unicellulars){
            if (unicellulars[index].health > 0) {
                unicellulars[index].do();
            } else {
                unicellulars[index].death();
            }
        }

        while (Object.keys(foods).length < FOOD_COUNT) {
            const newPosition = getNewPosition();

            let isIntoxicated = false;

            if (!(getRandomInt(0, 100) > INTOXICATE_PROB)){
                isIntoxicated = true;
            }

            foods[Food.count++] = new Food(context, newPosition.x,
                newPosition.y, isIntoxicated);
        }
            
        if (survivor == 0){
            pauseToggle();
        }

        if (survivor < (UNICELLULAR_COUNT / 5)){
            const newUnicellulars = {};
            let newUnicellularsCount = 0;
            totalGenerations++;

            if (survivor > 0 && saveEnabled){
                localStorage['unicellulars'] = JSON.stringify(unicellulars);
            } 

            for (const index in unicellulars){
                const u = unicellulars[index];
                unicellulars[index].health = 100;

                for (let i = 0; i < UNICELLULAR_CHILDREN; i++){
                    const newPosition = getNewPosition();
                    newUnicellulars[newUnicellularsCount] = new Unicellular(
                        u.context, 
                        newPosition.x, 
                        newPosition.y,
                        u.iterator
                    );
                    u.nda.forEach((value, index, arr) => {
                        if (i == 0){
                            const randomD = getRandomInt(0, 63);
                            
                            if (randomD === NaN || randomD === null){
                                debugger;
                            }

                            if (value === NaN || value === null){
                                debugger;
                                value = 0;
                            }

                            if (index != randomD){
                                newUnicellulars[newUnicellularsCount].nda[index] = value;
                            } else {
                                newUnicellulars[newUnicellularsCount].nda[index] = randomD;
                            }
                        } else {
                            newUnicellulars[newUnicellularsCount].nda[index] = value;
                        }
                    });
                    newUnicellularsCount++
                }
            }


            for (const index in newUnicellulars){
                unicellulars[Unicellular.count++] = newUnicellulars[index];
            }
        }
        
        
    }
}

function infoUpdate(){
    totalIterationText.textContent = `Iterations: ${totalIterations}`;
    totalGenerationText.textContent = `Generation: ${totalGenerations}`;
    totalSurvivorText.textContent = `Survivors: ${totalSurvivors}`;
}

async function updateCanvas(){
    requestAnimationFrame(updateCanvas);
    infoUpdate();
    canvas.width = canvas.width;

    for (const index in unicellulars){
        unicellulars[index].draw();
    }

    for (const index in foods){
        foods[index].draw();
    }

    for (const index in walls){
        walls[index].draw();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function pauseToggle(){
    isPaused = !isPaused;

    if (isPaused) {
        pauseButton.textContent = 'Play';
    } else {
        pauseButton.textContent = 'Pause';
    }
}

function getNewPosition(){
    let unique = false;
    const position = {
        x: 0,
        y: 0
    };

    do {
        position.x = getRandomInt(0, MAIN_WIDTH);
        position.y = getRandomInt(0, MAIN_HEIGHT);
        unique = true;

        for (let index in unicellulars) {
            if(unicellulars[index].positionX == position.x && unicellulars[index].positionY == position.y) {
                unique = false;
                break;
            }
        }        

        if (unique) {
            for (let index in foods) {
                if(foods[index].positionX == position.x && foods[index].positionY == position.y) {
                    unique = false;
                    break;
                }
            }
        }

        if (unique) {
            for (let index in walls) {
                if(walls[index].positionX == position.x && walls[index].positionY == position.y) {
                    unique = false;
                    break;
                }
            }
        }
    } while(!unique);
            
    return position;
}