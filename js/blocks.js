const settings = require('./settings');
const adds = require('./adds');
//const Stuff = require('./blocks/Stuff');
//const Unicellular = require('./blocks/Unicellular');
//const Food = require('./blocks/Food');
//const Wall = require('./blocks/Wall');

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
                (this.positionX * settings.BLOCK_WIDTH) + 1, 
                (this.positionY * settings.BLOCK_HEIGHT) + 1, 
                settings.BLOCK_WIDTH - 1, 
                settings.BLOCK_HEIGHT - 1
            );
        this.context.closePath();
        this.context.strokeStyle = this.getColor();
        this.context.stroke();
        this.context.font = `${settings.BLOCK_HEIGHT-2}px serif`;
        this.context.fillText(
            this.text, 
            (this.positionX * settings.BLOCK_WIDTH) + 1, 
            (this.positionY * settings.BLOCK_HEIGHT) + (settings.BLOCK_HEIGHT - 1)
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
        this.health = settings.HEALTH;
        this.direction = adds.getRandomInt(0, 7);
        if (iterator !== undefined){
            this.iterator = iterator;    
        } else {
            this.iterator = 0;
        }
        this.subIterator = 0;
        this.id;

        for (let i = 0; i < 64; i++){
            this.nda.push(adds.getRandomInt(0, 63));
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

            if (nextPositionX < 0) {
                nextPositionX = settings.MAIN_WIDTH;
            }

            if (nextPositionX > settings.MAIN_WIDTH) {
                nextPositionX = 0;
            }

            if (nextPositionY < 0) {
                nextPositionY = settings.MAIN_HEIGHT;
            }

            if (nextPositionY > settings.MAIN_HEIGHT){
                nextPositionY = 0;
            }

            for (let index in blocks.walls){
                if (blocks.walls[index].positionX == nextPositionX 
                    && blocks.walls[index].positionY == nextPositionY){
                        type = 1;
                        break;
                }
            }
            
            for (let index in blocks.unicellulars){
                if (blocks.unicellulars[index].positionX == nextPositionX 
                    && blocks.unicellulars[index].positionY == nextPositionY){
                        type = 3;
                        break;
                }
            }

            for (let index in blocks.foods){
                if (blocks.foods[index].positionX == nextPositionX 
                    && blocks.foods[index].positionY == nextPositionY){
                        foodIsIntoxicated = blocks.foods[index].isIntoxicated;
                        
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
        
        switch(type){
            case 1:
                // стена
                this.iteratorUp(1);
                break;
            case 2:
                // еда
                this.iteratorUp(2);
                this.healthUp();
                delete(blocks.foods[foodIndex]);
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

                delete(blocks.foods[foodIndex]);
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
        
        for (let index in blocks.walls){
            if (blocks.walls[index].positionX == takePositionX 
                && blocks.walls[index].positionY == takePositionY){
                    type = 1;
                    break;
            }
        }

        for (let index in blocks.foods){
            if (blocks.foods[index].positionX == takePositionX 
                && blocks.foods[index].positionY == takePositionY){
                    foodIsIntoxicated = blocks.foods[index].isIntoxicated;
                        
                    if (foodIsIntoxicated){
                        type = 4;
                    } else {
                        type = 2;
                    }

                    foodIndex = index;
                    break;
            }
        }

        for (let index in blocks.unicellulars){
            if (blocks.unicellulars[index].positionX == takePositionX 
                && blocks.unicellulars[index].positionY == takePositionY){
                    type = 3;
                    break;
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

                delete(blocks.foods[foodIndex]);
                break;

            case 3:
                // бот
                this.iteratorUp(3);
                break;
            case 4:
                // яд
                blocks.foods[foodIndex].isIntoxicated = false;
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

        for (let index in blocks.walls){
            if (blocks.walls[index].positionX == takePositionX 
                && blocks.walls[index].positionY == takePositionY){
                    type = 1;
                    break;
            }
        }

        for (let index in blocks.foods){
            if (blocks.foods[index].positionX == takePositionX 
                && blocks.foods[index].positionY == takePositionY){
                    foodIsIntoxicated = blocks.foods[index].isIntoxicated;
                        
                    if (foodIsIntoxicated){
                        type = 4;
                    } else {
                        type = 2;
                    }

                    break;
            }
        }

        for (let index in blocks.unicellulars){
            if (blocks.unicellulars[index].positionX == takePositionX 
                && blocks.unicellulars[index].positionY == takePositionY){
                    type = 3;
                    break;
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

        if (this.health > 200){
            this.health = 200;
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
        for (const index in blocks.unicellulars){
            if (blocks.unicellulars[index] === this){
                delete(blocks.unicellulars[index]);
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
    constructor(context, positionX, positionY){
        super(context, positionX, positionY);
        this.context = context;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    getColor(){
        return 'black';
    }
}
Wall.count = 0;

const blocks = {
    unicellulars: {},
    stuffs: {},
    foods: {},
    walls: {},
    Stuff,
    Unicellular,
    Food,
    Wall
}

module.exports = blocks;