.import "StageConfiguration.js" as Config

var imgExt = ".png";
var virusExt = "-virus.png";
var imgPath = "../img/";

var tuxs = 0;
var bugs = 0;
var packs = 0;
var virus = 0;
var clocks = 0;
var elements = 0;

var stage;
var hasStarted = false;


function init(stage)
{
    this.stage = stage;

    tuxs = 0;
    bugs = 0;
    packs = 0;
    virus = 0;
    clocks = 0;
    elements = 0;
    hasStarted = false;
    Config.configure(stage);
}


function createBlock(index, virus)
{
    var block = {
        "key": "",
        "index": index,
        "moveable": true,
        "matchable": true,
        "img": ""
    };

    if (hasStarted)
    {
        block = createTux(block, index);

        if (block.key === "") {
            block = createPack(block);
        }
    }

    if (block.key === "") {
        block = createElement(block);
    }

    if (virus === block.key) {
        virusImage(block);
    } else {
        realImage(block);
    }
    return block;
}

function createElement(block)
{
    elements++;
    var index = Math.floor(Math.random() * Config.elements);
    block.key = Config.elementKeys[index];
    return block;
}

function createFromPack(index, isElement, virus)
{
    var block = {
        "key": "",
        "index": index,
        "moveable": true,
        "matchable": true,
        "img": ""
    };

    if (hasStarted && !isElement)
    {
        block = createVirus(block);

        if (block.key === "") {
            block = createBug(block);
        }
        if (block.key === "") {
            block = createClock(block);
        }
    }

    if (block.key === "") {
        block = createElement(block);
    }

    if (virus === block.key) {
        virusImage(block);
    } else {
        realImage(block);
    }
    return block;
}

function createTux(block, index)
{
    if (isTux(index)) {
        tuxs++;
        block.key = Config.tux.key;
        block.moveable = Config.tux.moveable;
        block.matchable = Config.tux.matchable;
    }
    return block;
}

function createClock(block)
{
    if (isClock()) {
        clocks++;
        block.key = Config.clock.key;
        block.moveable = Config.clock.moveable;
        block.matchable = Config.clock.matchable;
    }
    return block;
}

function createPack(block)
{
    if (isPack()) {
        packs++;
        block.isElement = false;
        block.key = Config.pack.key;
        block.moveable = Config.pack.moveable;
        block.matchable = Config.pack.matchable;
    }
    return block;
}

function createBug(block)
{
    if (isBug()) {
        bugs++;
        block.key = Config.bug.key;
        block.moveable = Config.bug.moveable;
        block.matchable = Config.bug.matchable;
    }
    return block;
}

function createVirus(block)
{
    if (isVirus()) {
        virus++;
        block.key = Config.virus.key;
        block.moveable = Config.virus.moveable;
        block.matchable = Config.virus.matchable;
    }
    return block;
}

function isTux(index)
{
    var isLeftBorder = (index % Config.matchSize) === 0;
    var isRightBorder = (index+1 % Config.matchSize) === 0;

    if (isLeftBorder || isRightBorder) {
        return false;
    }
    return (isGoalReached(stage) && tuxs < Config.tux.max && random(Config.tux.rate));
}

function isClock() {
    return (clocks < Config.clock.max && random(Config.clock.rate));
}

function isPack() {
    return (packs < Config.pack.max && random(Config.pack.rate));
}

function isBug() {
    return (bugs < Config.bug.max && random(Config.bug.rate));
}

function isVirus() {
    return (virus < Config.virus.max && random(Config.virus.rate));
}


function isGoalReached()
{
    var tuxGoal = Math.floor(stage.maxScores / Config.tux.max);
    var goalScores = tuxGoal + (tuxs * tuxGoal);
    return (stage.scores >= goalScores);
}

function random(rate) {
    return (Math.random() < rate);
}



function realImage(block) {
    block.img = imgPath + block.key + imgExt;
}

function virusImage(block) {
    block.img = imgPath + block.key + virusExt;
}
