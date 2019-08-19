class Stuff {
    constructor(context, positionX, positionY){
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.text = '';
    }

    draw(){
        this.context.beginPath();
        this.context.rect(
                (this.positionX * BLOCK_WIDTH) + 1, 
                (this.positionY * BLOCK_HEIGHT) + 1, 
                BLOCK_WIDTH - 1, 
                BLOCK_HEIGHT - 1
            );
        this.context.closePath();
        this.context.strokeStyle = this.getColor();
        this.context.stroke();
        this.context.font = `${BLOCK_HEIGHT-2}px serif`;
        this.context.fillText(
            this.text, 
            (this.positionX * BLOCK_WIDTH) + 1, 
            (this.positionY * BLOCK_HEIGHT) + (BLOCK_HEIGHT - 1)
            );
    }

    getColor(){
        return 'black';
    }
}

class Unicellular extends Stuff {
    constructor(context, positionX, positionY, iterator = undefined){
        super(context, positionX, positionY)
        this.nda = [];
        this.health = HEALTH;
        this.direction = getRandomInt(0, 7);
        if (iterator !== undefined){
            this.iterator = iterator;    
        } else {
            this.iterator = 0;
        }
        this.subIterator = 0;
        this.id;

        for (let i = 0; i < 64; i++){
            this.nda.push(getRandomInt(0, 63));
        }
    }

    getColor(){
        if (this.health > 0) {
            return 'blue';
        } else {
            return 'gray';
        }
    }

    move(value){
        let nextPositionX = this.positionX;
        let nextPositionY = this.positionY;
        let type = 0;
        let foodIndex = 0;
        let foodIsIntoxicated = false;

        // let vector = value + this.direction;

        // if (vector > 7) {
        //     vector = vector - 8;
        // }

        if (this.direction == value){
            switch(value){
                case 0:
                    nextPositionY--;
                    break;
                case 1:
                    nextPositionY--;
                    nextPositionX++;
                    break;
                case 2:
                    nextPositionX++;
                    break;
                case 3:
                    nextPositionX++;
                    nextPositionY++;
                    break;
                case 4:
                    nextPositionY++;
                    break;
                case 5:
                    nextPositionX--;
                    nextPositionY++;
                    break;
                case 6:
                    nextPositionX--;
                    break;
                case 7:
                    nextPositionX--;
                    nextPositionY--;
                    break;
            }
            if (nextPositionX < 0 || nextPositionX >= MAIN_WIDTH 
                || nextPositionY < 0 || nextPositionY >= MAIN_HEIGHT){
                    type = 1;
            } else {
                for (let index in unicellulars){
                    if (unicellulars[index].positionX == nextPositionX 
                        && unicellulars[index].positionY == nextPositionY){
                            type = 3;
                            break;
                    }
                }
    
                for (let index in foods){
                    if (foods[index].positionX == nextPositionX 
                        && foods[index].positionY == nextPositionY){
                            foodIsIntoxicated = foods[index].isIntoxicated;
                            
                            if (foodIsIntoxicated){
                                type = 4;
                            } else {
                                type = 2;
                            }
    
                            foodIndex = index;
                            break;
                    }
                }
            }
        }   
        
        switch(type){
            case 1:
                // стена
                this.iteratorUp(1);
                break;
            case 2:
                // еда
                this.iteratorUp(2);
                this.healthUp();
                delete(foods[foodIndex]);
                break;
            case 3:
                // бот
                this.iteratorUp(3);
                break;
            case 4:
                // яд
                if (!foodIsIntoxicated){
                    this.healthUp();
                } 

                delete(foods[foodIndex]);
                this.positionX = nextPositionX;
                this.positionY = nextPositionY;
                this.death();
                break;

            default:
                // свободно
                this.positionX = nextPositionX;
                this.positionY = nextPositionY;
                this.iteratorUp(5);
                break;
        }

        this.subIterator = 10;
    }

    do(){
        // если живой
        if (this.health > 0){
            do {
                const value = this.nda[this.iterator];
    
                if (value <= 7){
                    this.move(value);
                } else if (value >= 8 && value <= 15){
                    this.take(value);
                } else if (value >= 16 && value <= 23){
                    this.see(value);
                } else if (value >= 24 && value <= 31){
                    this.rotate(value);
                } else {
                    this.subIterator++;
                    this.iteratorUp(value);
                }
            } while (this.subIterator < 10)

            this.health--;
            this.subIterator = 0;
            this.text = this.health;
        }
    }

    take(value) {
        let type = 0;

        let takePositionX = this.positionX;
        let takePositionY = this.positionY;
        let foodIndex = 0;
        let foodIsIntoxicated = false;

        switch(value){
            case 8:
                takePositionY--;
                break;
            case 9:
                takePositionY--;
                takePositionX++;
                break;
            case 10:
                takePositionX++;
                break;
            case 11:
                takePositionX++;
                takePositionY++;
                break;
            case 12:
                takePositionY++;
                break;
            case 13:
                takePositionX--;
                takePositionY++;
                break;
            case 14:
                takePositionX--;
                break;
            case 15:
                takePositionX--;
                takePositionY--;
                break;
        }

        if (takePositionX < 0 || takePositionX >= MAIN_WIDTH 
            || takePositionY < 0 || takePositionY >= MAIN_HEIGHT){
                type = 1;
        } else {
            for (let index in foods){
                if (foods[index].positionX == takePositionX 
                    && foods[index].positionY == takePositionY){
                        foodIsIntoxicated = foods[index].isIntoxicated;
                            
                        if (foodIsIntoxicated){
                            type = 4;
                        } else {
                            type = 2;
                        }

                        foodIndex = index;
                        break;
                }
            }

            for (let index in unicellulars){
                if (unicellulars[index].positionX == takePositionX 
                    && unicellulars[index].positionY == takePositionY){
                        type = 3;
                        break;
                }
            }
        }

        switch(type){
            case 1:
                // стена
                this.iteratorUp(1);
                break;
            case 2:
                // еда
                this.iteratorUp(2);
                
                if (!foodIsIntoxicated){
                    this.healthUp();
                } 

                delete(foods[foodIndex]);
                break;

            case 3:
                // бот
                this.iteratorUp(3);
                break;
            case 4:
                // яд
                foods[foodIndex].isIntoxicated = false;
                this.iteratorUp(4)
                break;
            default:
                // пусто
                this.iteratorUp(5);
                break;
        }

        this.subIterator = 10;
    }

    see(value){
        let type = 1;

        let takePositionX = this.positionX;
        let takePositionY = this.positionY;
        let foodIsIntoxicated = false;

        switch(value){
            case 8:
                takePositionY--;
                break;
            case 9:
                takePositionY--;
                takePositionX++;
                break;
            case 10:
                takePositionX++;
                break;
            case 11:
                takePositionX++;
                takePositionY++;
                break;
            case 12:
                takePositionY++;
                break;
            case 13:
                takePositionX--;
                takePositionY++;
                break;
            case 14:
                takePositionX--;
                break;
            case 15:
                takePositionX--;
                takePositionY--;
                break;
        }

        if (takePositionX < 0 || takePositionX >= MAIN_WIDTH || takePositionY < 0 || takePositionY >= MAIN_HEIGHT){
                type = 1;
        } else {
            for (let index in foods){
                if (foods[index].positionX == takePositionX 
                    && foods[index].positionY == takePositionY){
                        foodIsIntoxicated = foods[index].isIntoxicated;
                            
                        if (foodIsIntoxicated){
                            type = 4;
                        } else {
                            type = 2;
                        }

                        break;
                }
            }

            for (let index in unicellulars){
                if (unicellulars[index].positionX == takePositionX 
                    && unicellulars[index].positionY == takePositionY){
                        type = 3;
                        break;
                }
            }
        }

        switch(type){
            case 1:
                // стена
                this.iteratorUp(1);
                break;
            case 2:
                // еда
                this.iteratorUp(2);
                break;
            case 3:
                // бот
                this.iteratorUp(3);
                break;
            case 4:
                // яд
                this.iteratorUp(4);
                break;
            default:
                // пусто
                this.iteratorUp(5);
                break;
        }

        this.subIterator++;
    }

    rotate(value){
        this.direction += (value - 24);

        if (this.direction > 7){
            this.direction = this.direction - 8;
        }

        this.subIterator++;
        this.iteratorUp();
    }

    healthUp(){
        this.health += 10;

        if (this.health > 100){
            this.health = 100;
        }
    }

    iteratorUp(value){
        if (value === undefined){
            this.iterator++;
        } else {
            this.iterator += value;
        }

        if (this.iterator > 63) {
            this.iterator = this.iterator - 64;
        }
    }

    death(){
        for (const index in unicellulars){
            if (unicellulars[index] === this){
                delete(unicellulars[index]);
            }
        }
    }
}
Unicellular.count = 0;

class Food extends Stuff {
    constructor(context, positionX, positionY, isIntoxicated){
        super(context, positionX, positionY);
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.isIntoxicated = isIntoxicated
    }

    getColor(){
        if (this.isIntoxicated){
            return 'red';
        } else {
            return 'green';
        }
    }
}
Food.count = 0;

class Wall extends Stuff {
    constructor(context, positionX, positionY, isIntoxicated){
        super(context, positionX, positionY);
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
        this.isIntoxicated = isIntoxicated
    }

    getColor(){
        return 'brown';
    }
}

let unicellulars = {};
const stuffs = {};
const foods = {};

const MAIN_WIDTH = 60;
const MAIN_HEIGHT = 25;
const BLOCK_WIDTH = 20;
const BLOCK_HEIGHT = 20;
const VIEW_HEIGHT = MAIN_HEIGHT * BLOCK_HEIGHT;
const VIEW_WIDHT = MAIN_WIDTH * BLOCK_WIDTH;
const UNICELLULAR_COUNT = 60;
const UNICELLULAR_CHILDREN = 10;
const HEALTH = 100;
const FOOD_COUNT = 150;
let totalIterations = 0;
let totalGenerations = 1;
let totalSurvivors = 0;
let isPaused = true;



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

if ('unicellulars' in localStorage){
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

    if (getRandomInt(0, 10) > 6){
        isIntoxicated = true;
    }
    
    foods[Food.count++] = new Food(context, newPosition.x,
        newPosition.y, isIntoxicated);
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

            if (getRandomInt(0, 10) > 6){
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

            if (survivor > 0){
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
    } while(!unique);
            
    return position;
}