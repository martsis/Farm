const settings = require('./settings');
const blocks = require('./blocks');
const position = require('./position');
const view = require('./view');
const adds = require('./adds');

function init(){

    if (Object.keys(blocks.unicellulars).length == 0){
        while (Object.keys(blocks.unicellulars).length < settings.UNICELLULAR_COUNT) {
            const newPosition = position.getNewPosition();
            blocks.unicellulars[blocks.Unicellular.count++] = new blocks.Unicellular(view.context, newPosition.x,
                newPosition.y);
        }
    } else {
        for (let i = 0; i < settings.UNICELLULAR_CHILDREN; i++) {
            const newPosition = position.getNewPosition();
            blocks.unicellulars[blocks.Unicellular.count++] = new blocks.Unicellular(view.context, newPosition.x,
                newPosition.y);
        }
    }
    
    while (blocks.Food.count < settings.FOOD_COUNT) {
        const newPosition = position.getNewPosition();
        let isIntoxicated = false;
    
        if (!(adds.getRandomInt(0, 100) > settings.INTOXICATE_PROB)){
            isIntoxicated = true;
        }
        
        blocks.foods[blocks.Food.count++] = new blocks.Food(view.context, newPosition.x,
            newPosition.y, isIntoxicated);
    }
    
    while (blocks.Wall.count < settings.WALL_COUNT) {
        const newPosition = position.getNewPosition();
        
        blocks.walls[blocks.Wall.count++] = new blocks.Wall(view.context, newPosition.x,
            newPosition.y);
    }
}

module.exports = {
    init
}