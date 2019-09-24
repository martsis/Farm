const settings = require('./settings');
const blocks = require('./blocks');
const adds = require('./adds');

function getNewPosition(){
    let unique = false;
    const position = {
        x: 0,
        y: 0
    };

    do {
        position.x = adds.getRandomInt(0, settings.MAIN_WIDTH);
        position.y = adds.getRandomInt(0, settings.MAIN_HEIGHT);
        unique = true;

        for (let index in blocks.unicellulars) {
            if(blocks.unicellulars[index].positionX == position.x && blocks.unicellulars[index].positionY == position.y) {
                unique = false;
                break;
            }
        }        

        if (unique) {
            for (let index in blocks.foods) {
                if(blocks.foods[index].positionX == position.x && blocks.foods[index].positionY == position.y) {
                    unique = false;
                    break;
                }
            }
        }

        if (unique) {
            for (let index in blocks.walls) {
                if(blocks.walls[index].positionX == position.x && blocks.walls[index].positionY == position.y) {
                    unique = false;
                    break;
                }
            }
        }
    } while(!unique);
            
    return position;
}

module.exports = {
    getNewPosition
}