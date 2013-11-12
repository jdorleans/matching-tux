// Stage Configuration

var tux;
var pack;
var bug;
var clock;
var virus;

var elements = 4;

var scores = 1900;
var scoresJump = 100;
var scoresGain = 10;

var level = 0;
var maxLevel = 50;
var levelRate = 0.0075;
var levelJump = 5;

var time = 200000;

var stageSize = 7;
var matchSize = 3;

var elementKeys = ["ubuntu", "debian", "arch", "mint"];
var blockKeys = ["tux", "clock", "pack", "bug", "virus"].concat(elementKeys);


function configure(stage)
{
    level = stage.level;
    stage.time = time
    stage.maxScores = scores + (level * scoresJump);

    configureTux();
    configurePack();
    configureBug();
    configureClock();
    configureVirus();
}

function configureTux()
{
    var max = Math.floor(level/levelJump);

    if (level !== maxLevel) {
        max++;
    }
    var rate = 1;
    tux = {"key": "tux", "moveable": true, "matchable": false};
    tux.max = max;
    tux.rate = rate;
}

function configurePack()
{
    var max = level * matchSize * 100;
    var rate = levelRate*Math.ceil(level/2);
    pack = {"key": "pack", "moveable": true, "matchable": true};
    pack.max = max;
    pack.rate = rate;
}

function configureClock()
{
    var max = Math.floor(level/levelJump) * matchSize;
    var rate = levelRate*2;
    var duration = 3;
    clock = {"key": "clock", "moveable": true, "matchable": true};
    clock.max = max;
    clock.rate = rate;
    clock.duration = duration;
}

function configureBug()
{
    var max = level;
    var rate = levelRate*(level+10);
    var moves = level;
    var duration = 5;
    bug = {"key": "bug", "moveable": true, "matchable": true};
    bug.max = max;
    bug.rate = rate;
    bug.moves = moves;
    bug.duration = duration;
}

function configureVirus()
{
    var max = level;
    var rate = levelRate*(level+5);
    var moves = level;
    var duration = 3;
    virus = {"key": "virus", "moveable": false, "matchable": true};
    virus.max = max;
    virus.rate = rate;
    virus.moves = moves;
    virus.duration = duration;
}
