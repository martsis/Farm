const settings = require('../settings');

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

module.exports = Stuff;