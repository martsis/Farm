const MAIN_WIDTH = 60;
const MAIN_HEIGHT = 35;
const BLOCK_WIDTH = 20;
const BLOCK_HEIGHT = 20;
const VIEW_HEIGHT = MAIN_HEIGHT * BLOCK_HEIGHT;
const VIEW_WIDHT = MAIN_WIDTH * BLOCK_WIDTH;
const UNICELLULAR_COUNT = 60;
const UNICELLULAR_CHILDREN = 4;
const HEALTH = 100;
const FOOD_COUNT = 150;
const INTOXICATE_PROB = 20;
const WALL_COUNT = 150;
let totalIterations = 0;
let totalGenerations = 1;
let totalSurvivors = 0;
let isPaused = true;
let saveEnabled = false;

module.exports = {
    MAIN_HEIGHT,
    MAIN_WIDTH,
    BLOCK_HEIGHT,
    BLOCK_WIDTH,
    VIEW_HEIGHT,
    VIEW_WIDHT,
    UNICELLULAR_COUNT,
    UNICELLULAR_CHILDREN,
    HEALTH,
    FOOD_COUNT,
    INTOXICATE_PROB,
    WALL_COUNT,
    totalIterations,
    totalGenerations,
    totalSurvivors,
    isPaused,
    saveEnabled
}