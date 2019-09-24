const settings = require('./settings');
const blocks = require('./blocks');
const view = require('./view');
const position = require('./position');
const adds = require('./adds');

function run() {
    if (!settings.isPaused){
        settings.totalIterations++;
        const survivor = Object.keys(blocks.unicellulars).length;

        for (const index in blocks.unicellulars){
            if (blocks.unicellulars[index].health > 0) {
                blocks.unicellulars[index].do();
            } else {
                blocks.unicellulars[index].death();
            }
        }

        while (Object.keys(blocks.foods).length < settings.FOOD_COUNT) {
            const newPosition = position.getNewPosition();

            let isIntoxicated = false;

            if (!(adds.getRandomInt(0, 100) > settings.INTOXICATE_PROB)){
                isIntoxicated = true;
            }

            blocks.foods[blocks.Food.count++] = new blocks.Food(view.context, newPosition.x,
                newPosition.y, isIntoxicated);
        }
            
        if (survivor == 0){
            view.pauseToggle();
        }

        if (survivor < (settings.UNICELLULAR_COUNT / 5)){
            const newUnicellulars = {};
            let newUnicellularsCount = 0;
            settings.totalGenerations++;

            if (survivor > 0 && settings.saveEnabled){
                localStorage['unicellulars'] = JSON.stringify(blocks.unicellulars);
            } 

            for (const index in blocks.unicellulars){
                const u = blocks.unicellulars[index];
                blocks.unicellulars[index].health = 100;

                for (let i = 0; i < settings.UNICELLULAR_CHILDREN; i++){
                    const newPosition = position.getNewPosition();
                    newUnicellulars[newUnicellularsCount] = new blocks.Unicellular(
                        u.context, 
                        newPosition.x, 
                        newPosition.y,
                        u.iterator
                    );
                    u.nda.forEach((value, index, arr) => {
                        if (i == 0){
                            const randomD = adds.getRandomInt(0, 63);
                            
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
                blocks.unicellulars[blocks.Unicellular.count++] = newUnicellulars[index];
            }
        }
    }
}

module.exports = {
    run
}