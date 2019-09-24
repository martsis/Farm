const Stuff = require('./Stuff');

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

module.exports = Food;