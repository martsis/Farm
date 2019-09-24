const settings = require('./settings');
const blocks = require('./blocks');

function check(){
    if ('unicellulars' in localStorage && settings.saveEnabled){
        const unicsStors = JSON.parse(localStorage['unicellulars']);
        for (const index in unicsStors){
            unicellulars[index] = new blocks.Unicellular(view.context, unicsStors[index].positionX, unicsStors[index].positionY, unicsStors[index].iterator);
    
            unicellulars[index].nda = unicsStors[index].nda;
            
            if (index > blocks.Unicellular.count){
                blocks.Unicellular.count = index;
            }
        }
        blocks.Unicellular.count++;
    }
}

module.exports = {
    check
}