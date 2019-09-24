const Stuff = require('./Stuff');

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

module.exports = Wall;