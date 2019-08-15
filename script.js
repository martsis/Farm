const unicellulars = {};
const stuffs = {};
const foods = {};
const MAIN_WIDTH = 50;
const MAIN_HEIGHT = 35;
const BLOCK_WIDTH = 15;
const BLOCK_HEIGHT = 15;
const VIEW_HEIGHT = MAIN_HEIGHT * BLOCK_HEIGHT;
const VIEW_WIDHT = MAIN_WIDTH * BLOCK_WIDTH;
const UNICELLULAR_COUNT = 40;
const FOOD_COUNT = 150;
let totalIterations = 0;

class Stuff {
    constructor(context, positionX, positionY){
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    draw(){
        this.context.beginPath();
        this.context.rect(
                (this.positionX * BLOCK_WIDTH), 
                (this.positionY * BLOCK_HEIGHT), 
                BLOCK_WIDTH, 
                BLOCK_HEIGHT
            );
        this.context.closePath();
        this.context.strokeStyle = this.getColor();
        this.context.stroke();
    }

    getColor(){
        return 'black';
    }
}

class Unicellular extends Stuff {
    constructor(context, positionX, positionY){
        super(context, positionX, positionY)
        this.nda = [];
        this.health = 100;
        this.iterator = 0;
        this.subIterator = 0;
        this.direction = getRandomInt(0, 7);

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
        let isMob = false;

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
                this.iteratorUp();
                return;
        } else {
            for (let index in unicellulars){
                if (unicellulars[index].positionX == nextPositionX 
                    && unicellulars[index].positionY == nextPositionY){
                        isMob = true;
                        break;
                }
            }

            if (isMob){
                this.iteratorUp(3);
                return;
            }
            else {
                this.iteratorUp(5);
                this.positionX = nextPositionX;
                this.positionY = nextPositionY;
            }
        }

        this.subIterator = 10;
    }

    do(){
        // если живой
        if (this.health > 0){
            while (this.subIterator < 10){
                const value = this.nda[this.iterator];
    
                if (value <= 7){
                    this.move(value);
                } else if (value >= 8 && value <= 15){
                    this.take(value);
                } else if (value >= 16 && value <= 23){
                    this.subIterator++;
                    this.iteratorUp(value);
                } else if (value >= 24 && value <= 31){
                    this.subIterator++;
                    this.iteratorUp(value);
                } else {
                    this.subIterator = 10;
                    this.iteratorUp(value);
                }
            }
            this.health--;
            this.subIterator = 0;
        }
    }

    take(value) {
        //this.subIterator++;
        let type = 0;

        let takePositionX = this.positionX;
        let takePositionY = this.positionY;
        

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
                this.iteratorUp();
                return;
        } else {
            for (let index in foods){
                if (foods[index].positionX == takePositionX 
                    && foods[index].positionY == takePositionY){
                        type = 2;
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

            switch(type){
                case 2:
                    this.iteratorUp(2);
                    this.health++;
                    break;

                case 3:
                    this.iteratorUp(3);
            }
        }

        this.subIterator++;
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



const wrapper = document.createElement('div');
const canvas = document.createElement('canvas');
const totalIterationText = document.createElement('p');
const body = document.body;
document.body.append(wrapper);
wrapper.append(canvas);
wrapper.append(totalIterationText);

body.style.backgroundColor = '#000';
wrapper.style.width = `${VIEW_WIDHT}px`;
wrapper.style.margin = 'auto';

const context = canvas.getContext('2d');
canvas.style.backgroundColor = '#FFF';
canvas.width = VIEW_WIDHT;
canvas.height = VIEW_HEIGHT;

totalIterationText.style.color = '#FFF';


while (Unicellular.count < UNICELLULAR_COUNT) {
    let newPositionX = getRandomInt(0, MAIN_WIDTH);
    let newPositionY = getRandomInt(0, MAIN_HEIGHT);
    let unique = true;

    for (let index in unicellulars) {
        if(unicellulars[index].positionX == newPositionX 
            && unicellulars[index].positionY == newPositionY) {
            unique = false;
        }
    }

    if (!unique) {
        continue;
    }

    unicellulars[Unicellular.count++] = new Unicellular(context, newPositionX,
        newPositionY);
}

while (Food.count < FOOD_COUNT) {
    let newPositionX = getRandomInt(0, MAIN_WIDTH);
    let newPositionY = getRandomInt(0, MAIN_HEIGHT);
    let unique = true;

    for (let index in foods) {
        if(foods[index].positionX == newPositionX 
            && foods[index].positionY == newPositionY) {
            unique = false;
        }
    }

    if (!unique) {
        continue;
    }

    foods[Food.count++] = new Food(context, newPositionX,
        newPositionY);
}

updateCanvas();
setInterval(iterations, 10);
//iterations();

function iterations() {
    for (const index in unicellulars){
        if (unicellulars[index].health > 0) {
            unicellulars[index].do();
        } 
        
    }

    totalIterations++;
    totalIterationText.innerHTML = `Iterations: ${totalIterations}`;
}

async function updateCanvas(){
    requestAnimationFrame(updateCanvas);
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