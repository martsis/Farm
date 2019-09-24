const settings = require('./settings');
const blocks = require('./blocks');
const view = require('./view');
const storage = require('./storage');
const blocksInit = require('./blocksInit');
const iterations = require('./iterations');
const position = require('./position');

view.init();
storage.check();
blocksInit.init();

view.updateCanvas();

setInterval(iterations.run, 100);