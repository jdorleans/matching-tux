.import "StageConfiguration.js" as Config
.import "BlockCreator.js" as Creator
.import "StageUtils.js" as Utils

var goalPos = 0;
var stageSize = 0;
var matchSize = 0;
var tuxsOnStage = 0;
var hasStarted = false;
var bugEffect = {"amount": 0, "endTime": 100};
var virusEffect = {"amount": 0, "element": null, "moves": 0, "endTime": 100};


function init()
{
    tuxsOnStage = 0;
    hasStarted = false;
    stageSize = Config.stageSize;
    matchSize = Config.matchSize;
    goalPos = (stageSize*stageSize)-Math.ceil(stageSize/2);
    bugEffect = {"amount": 0, "endTime": timeBar.maximumValue};
    virusEffect = {"amount": 0, "element": null, "moves": 0, "endTime": timeBar.maximumValue};

    stage.tuxs = 0;
    stage.scores = 0;
    gModel.clear();
    grid.currentIndex = -1;
    timeBar.value = timeBar.maximumValue;

    Config.configure(stage);
    Creator.init(stage);
    updateCounts();
}

// Called from Stage Button
function startGame()
{
    init();

    for (var i = 0; i < stageSize*stageSize; i++) {
        gModel.append(Creator.createBlock(i));
    }
    update();
    hasStarted = true;
    Creator.hasStarted = true;
}

function updateCounts()
{
    goalGrid.columns = Config.tux.max - Creator.tuxs;
    updateTuxCount();
    updateBugCount();
    updateVirusCount();
    updateMovesCount();
}

function updateTuxCount()
{
    var tuxs = Config.tux.max - stage.tuxs;

    if (tuxs < 10) {
        statusCountTux.text = "0"+ tuxs;
    } else {
        statusCountTux.text = tuxs;
    }
}

function updateBugCount()
{
    if (bugEffect.amount < 10) {
        statusCountBug.text = "0"+ bugEffect.amount;
    } else {
        statusCountBug.text = bugEffect.amount;
    }
}

function updateVirusCount()
{
    if (virusEffect.amount < 10) {
        statusCountVirus.text = "0"+ virusEffect.amount;
    } else {
        statusCountVirus.text = virusEffect.amount;
    }
}

function updateMovesCount()
{
    if (virusEffect.moves < 10) {
        statusCountMoves.text = "0"+ virusEffect.moves;
    } else {
        statusCountMoves.text = virusEffect.moves;
    }
}


function select(index)
{
    var block = gModel.get(index);
    console.debug("Selected: "+ index +" - "+ block.key);

    if (stage.isStarted() && isMoveable(block))
    {
        if (grid.currentIndex === index) {
            grid.currentIndex = -1; // deselect
        }
        else if (grid.currentIndex === -1 || !isNeighbour(grid.currentIndex, index)) {
            grid.currentIndex = index; // new select
        }
        else
        {
            console.debug("Second Select - Swap: "+ grid.currentIndex +" - "+ index);

            if (hasBug()) {
                index = bugPosition(grid.currentIndex, index);
                console.debug("Second Select - BUGGED: "+ gModel.get(index).key +" - "+ index);
            }

            // index can be equals bugged
            if (index !== grid.currentIndex)
            {
                var prevfirst = gModel.get(grid.currentIndex).key;
                var prevsecond = block.key;

                // swap first and second
                swap(grid.currentIndex, index);

                var hasMatched = update();
                console.debug("Update - Matched: "+ hasMatched);

                if (hasMatched)
                {
                    updateVirusMoves(prevfirst, prevsecond);
                    updateCounts();
                    grid.currentIndex = -1; // deselect

                    endGame();
                }
                else {
                    console.debug("Second Select - Swap Back: "+ index +" - "+ grid.currentIndex);
                    swap(index, grid.currentIndex); // swap back
                    grid.currentIndex = index; // change select
                }
            }
        }
    }
}

function isMoveable(block)
{
    var isMoveable = false;

    if (hasStarted)
    {
        // can move anything (mint power)
        if (virusEffect.moves > 0) {
            isMoveable = true;
        }
        // if bug exist, allows to select the second infected position (it will be deselected)
        else if (hasBug() && grid.currentIndex !== -1 && grid.currentIndex !== block.index) {
            isMoveable = true;
        }
        else {
            isMoveable = (block.moveable && block.key !== virusEffect.element)
        }
    }
    return isMoveable;
}

function isNeighbour(first, second)
{
    var left = first - 1;
    var right = first + 1;
    var up = first - stageSize;
    var down = first + stageSize;
    return (second === left || second === right || second === up || second === down);
}


// it reduces twice when virus swaps with an infected element
function updateVirusMoves(first, second)
{
    if (first === Config.virus.key || first === virusEffect.element) {
        virusEffect.moves--;
    }

    if (second === Config.virus.key || second === virusEffect.element) {
        virusEffect.moves--;
    }

    if (virusEffect.moves < 0) {
        virusEffect.moves = 0;
    }
}


// Called from Stage TimeBar
function updateTroubleTime()
{
    if (bugEffect.endTime >= timeBar.value)
    {
        removeBugEffect();
        updateBugCount();

        if (hasBug()) {
            updateBugTime();
        }
    }

    if (virusEffect.endTime >= timeBar.value)
    {
        removeVirusEffect();
        updateVirusCount();

        if (hasVirus()) {
            updateVirusTime();
        }
    }
}



function touchPack() {
    return findTuxsNearBlock(Config.pack.key);
}

function touchClock()
{
    var clocks = findTuxsNearBlock(Config.clock.key);

    if (hasStarted && clocks.length > 0) {
        increaseTime(clocks.length * Config.clock.duration);
    }
    return clocks;
}

function bugTrouble()
{
    var bugs = findTuxsNearBlock(Config.bug.key);

    if (hasStarted && bugs.length > 0) {
        bugEffect.amount++;
        updateBugTime();
    }
    return bugs;
}

function updateBugTime()
{
    bugEffect.endTime = timeBar.value - Config.bug.duration;

    if (bugEffect.endTime < timeBar.minimumValue) {
        bugEffect.endTime = timeBar.minimumValue;
    }
}

function virusTrouble()
{
    var virus = findTuxsNearBlock(Config.virus.key);

    if (hasStarted && virus.length > 0)
    {
        var idx = Utils.randomInt(Config.elementKeys.length);

        if (virusEffect.element !== null) {
            virusElement(virusEffect.element, false);
        }
        virusEffect.element = Config.elementKeys[idx];
        virusElement(virusEffect.element, true);
        virusEffect.amount++;
        updateVirusTime();
    }
    return virus;
}

function virusElement(key, enable)
{
    for (var i=0; i<stageSize*stageSize; i++)
    {
        var block = gModel.get(i);

        if (block.key === key)
        {
            if (enable) {
                Creator.virusImage(block);
            } else {
                Creator.realImage(block);
            }
        }
    }
}

function updateVirusTime()
{
    virusEffect.endTime = timeBar.value - Config.virus.duration;

    if (virusEffect.endTime < timeBar.minimumValue) {
        virusEffect.endTime = timeBar.minimumValue;
    }
}

function findTuxsNearBlock(key)
{
    var blocks = [];

    if (tuxsOnStage > 0)
    {
        var tuxs = Utils.findAllBlocksByKey(Config.tux.key, gModel);

        for (var i=0; i<tuxsOnStage; i++) {
            var neighbours = Utils.findNearBlocksByKey(tuxs[i].index, key, gModel);
            blocks = Utils.intersect(blocks, neighbours);
        }
    }
    return blocks;
}

function bugPosition(first, second)
{
    var indexs = Utils.findNearIndexs(first);
    var idx = indexs.indexOf(second);

    if (idx > -1) {
        indexs.splice(idx, 1);
    }
    var i = 0;

    while (i < indexs.length)
    {
        var key = gModel.get(indexs[i]).key;
        var isVirus = (key === Config.virus.key);
        var hasVirus = (key === virusEffect.element);

        // does not suggest virus or infected element if moves = 0
        if ((hasVirus || isVirus) && virusEffect.moves === 0) {
            indexs.splice(i, 1);
        } else {
            i++;
        }
    }

    // returns at least one valid position
    if (indexs.length === 0) {
        indexs.push(first);
    }
    idx = Utils.randomInt(indexs.length);
    console.log("BUG POSITIONS: "+ indexs);

    return indexs[idx];
}


function swap(from, to)
{
//    console.debug("swap: "+ from +"<-->"+ to);
    var min = Math.min(from, to);
    var max = Math.max(from, to);

    // do not swap from border to border
    if (max % stageSize !== 0 || min !== max-1)
    {
        var distance = max-min;

        if (distance === 1 || distance === stageSize)
        {
            gModel.setProperty(from, "index", to);
            gModel.setProperty(to, "index", from);

            gModel.move(min, max, 1);
            gModel.move(max-1, min, 1);
        }
    }
}

function removeBlocks(blocks)
{
    if (hasStarted)
    {
        var matches = {
            "tux": 0,
            "debian": 0,
            "ubuntu": 0,
            "arch": [],
            "mint": 0,
            "bug": 0,
            "virus": 0,
            "scores": 0
        };

        for (var i = 0; i < blocks.length; i++) {
            matches = updateMatches(blocks[i], matches);
        }
        updateTuxGoal(matches.tux);

        var removes = powerDebian(matches.debian);
        blocks = Utils.intersect(blocks, removes);

        removes = powerUbuntu(matches.ubuntu);
        blocks = Utils.intersect(blocks, removes);

        removes = powerArch(matches.arch);
        blocks = Utils.intersect(blocks, removes);

        powerMint(matches.mint);
        matches.scores = blocks.length;
        updateScore(matches);

        if (blocks.length >= matchSize*4) {
            virusEffect.moves++;
        }
        if (matches.bug > matchSize) {
            removeBugEffect();
        }
        if (matches.virus > matchSize) {
            removeVirusEffect();
        }
    }

    for (i = 0; i < blocks.length; i++) {
        removeBlock(blocks[i]);
    }
}

function updateMatches(block, matches)
{
    var key = block.key;

    if (key === "tux") {
        matches.tux++;
    } else if (key === "debian") {
        matches.debian++;
    } else if (key === "ubuntu") {
        matches.ubuntu++;
    } else if (key === "arch") {
        matches.arch.push(block.index);
    } else if (key === "mint") {
        matches.mint++;
    } else if (key === "bug") {
        matches.bug++;
    } else if (key === "virus") {
        matches.virus++;
    }
    return matches;
}

function createBlock(idx)
{
    var block = Creator.createBlock(idx, virusEffect.element);

    if (block.key === Config.tux.key) {
        tuxsOnStage++;
    }
    return block;
}

function removeBlock(block)
{
    var idx = block.index;

    if (block.key === Config.pack.key) {
        gModel.set(idx, Creator.createFromPack(idx, block.isElement, virusEffect.element));
    }
    else {
        gModel.remove(idx, 1);
        gModel.insert(idx, createBlock(idx));
        idx = moveToTop(idx);
    }
}

function moveToTop(idx)
{
    while (idx >= stageSize) {
        var upperIdx = idx-stageSize;
        swap(idx, upperIdx);
        idx = upperIdx;
    }
    return idx;
}

function updateTuxGoal(value)
{
    if (value > 0) {
        tuxsOnStage -= value;
        stage.tuxs += value;
        increaseTime(value*3);
        updateTuxCount();
    }
}

function updateScore(matches)
{
    if (matches.scores > 0)
    {
        var scores = matches.scores;
        var combo = Math.floor(scores / matchSize);

        if (matches.bug > 0) {
            scores *= matches.bug;
        }
        if (matches.virus > 0) {
            scores *= matches.virus*matches.virus;
        }
        stage.scores += Config.scoresGain * scores * combo;
    }
}

// time and package
function powerDebian(value)
{
    var blocks = [];

    if (value > matchSize)
    {
        var packs = Math.floor(value/2)+1;
        var matrix = stageSize*stageSize;

        if (value > matchSize+1) {
            packs = value;
            value *= 2;
        }

        for (var idx = 0; idx<matrix; idx++)
        {
            var block = gModel.get(idx);

            if (block.key === Config.pack.key) {
                block.isElement = true;
                blocks.push(block);
            }
        }

        if (blocks.length > packs)
        {
            var removes = blocks.length - packs;

            for (var i = 0; i<removes; i++) {
                var pos = Utils.randomInt(blocks.length);
                blocks.splice(pos, 1);
            }
        }
        increaseTime(value);
    }
    return blocks;
}

// burn bug and virus
function powerUbuntu(value)
{
    var blocks = [];

    if (value > matchSize)
    {
        var fixs = Math.floor(value/2)+1;
        var matrix = stageSize*stageSize;

        if (value > matchSize+1) {
            fixs = value+2;
        }

        for (var idx = 0; idx<matrix; idx++)
        {
            var block = gModel.get(idx);

            if (block.key === Config.bug.key || block.key === Config.virus.key) {
                blocks.push(block);
            }
        }

        if (blocks.length > fixs)
        {
            var removes = blocks.length - fixs;

            for (var i = 0; i<removes; i++) {
                var pos = Utils.randomInt(blocks.length);
                blocks.splice(pos, 1);
            }
        }
    }
    return blocks;
}

// lightning all blocks row x column
function powerArch(indexs)
{
    var blocks = [];

    if (indexs.length > matchSize)
    {
        var cols = [];
        var rows = [];
        var rmCol = null;
        var rmRow = null;

        for (var i = 0; i<indexs.length; i++)
        {
            var col = indexs[i] % stageSize;
            var row = Math.floor(indexs[i] / stageSize);

            if (rmCol === null && cols.indexOf(col) > -1) {
                rmCol = col;
            }
            if (rmRow === null && rows.indexOf(row) > -1) {
                rmRow = row;
            }
            cols.push(col);
            rows.push(row);
        }

        // blocks from col avoiding duplication and tux
        if (rmCol !== null)
        {
            for (var c = 0; c<stageSize; c++)
            {
                var cidx = rmCol + (c * stageSize);
                var cblock = gModel.get(cidx);

                if (indexs.indexOf(cidx) === -1 && cblock.key !== Config.tux.key) {
                    console.debug("Arch Removes Col: "+ cidx);
                    blocks.push(cblock);
                }
            }
        }

        // blocks from row avoiding duplication and tux
        if (rmRow !== null)
        {
            for (var r = 0; r<stageSize; r++)
            {
                var ridx = r + (row * stageSize);
                var rblock = gModel.get(ridx);

                if (indexs.indexOf(ridx) === -1 && blocks.indexOf(rblock) === -1 && rblock.key !== Config.tux.key) {
                    console.debug("Arch Removes Row: "+ ridx);
                    blocks.push(rblock);
                }
            }
        }
    }
    return blocks;
}

// reduce bug and virus count and add moves
function powerMint(value)
{
    if (value > matchSize)
    {
        removeBugEffect();
        removeVirusEffect();

        if (value > matchSize+1) {
            removeBugEffect();
            removeVirusEffect();
        }
    }
}

// remove bugs
function removeBugEffect()
{
    if (hasBug()) {
        bugEffect.amount--;
    }

    if (!hasBug()) {
        bugEffect.endTime = timeBar.maximumValue;
    }
}

// remove virus
function removeVirusEffect()
{
    if (hasVirus()) {
        virusEffect.amount--;
    }

    if (!hasVirus()) {
        virusElement(virusEffect.element, false);
        virusEffect.element = null;
        virusEffect.endTime = timeBar.maximumValue;
    }
}

function hasBug() {
    return (bugEffect.amount > 0);
}

function hasVirus() {
    return (virusEffect.amount > 0);
}

function endGame()
{
    if (stage.tuxs === Config.tux.max) {
        stage.complete();
        console.debug("END GAME!");
    }
}


function tuxReachesGoal(blocks)
{
    var block = gModel.get(goalPos);

    if (block.key === Config.tux.key) {
        blocks.push(block);
    }
}

function increaseTime(value)
{
    bugEffect.endTime += value;
    virusEffect.endTime += value;
    bugEffect.endTime = Math.min(virusEffect.endTime, timeBar.maximumValue);
    virusEffect.endTime = Math.min(virusEffect.endTime, timeBar.maximumValue);

    value += timeBar.value;
    value = Math.min(value, timeBar.maximumValue);

    timer.stop();
    timeBar.value = value;
    timer.start();
}


function update()
{
    var hasMatched = false;
    var blocks = matchBlocks();

    while (blocks.length > 0) {
        hasMatched = true;
        removeBlocks(blocks);
        blocks = matchBlocks();
    }
    return hasMatched;
}

function matchBlocks()
{
    var blocks = [];

    for (var matrix = 0; matrix < stageSize; matrix++)
    {
        var rows = findBlocks(true, matrix); // rows
        blocks = Utils.intersect(blocks, rows);

        var cols = findBlocks(false, matrix); // columns
        blocks = Utils.intersect(blocks, cols);

        if (blocks.length > 0)
        {
            console.debug("\ntotal: "+ matrix);
            for (var p = 0; p < blocks.length; p++) {
                console.debug("block: "+ blocks[p].index +" - "+ blocks[p].key);
            }
        }
    }
    tuxReachesGoal(blocks);

    // Trouble is launched only after all possibles matches
    if (blocks.length === 0) {
//        blocks = Utils.intersect(blocks, touchPack());
        blocks = Utils.intersect(blocks, touchClock());
        blocks = Utils.intersect(blocks, bugTrouble());
        blocks = Utils.intersect(blocks, virusTrouble());
    }
    return blocks;
}

function findBlocks(isRow, matrix)
{
    var founds = [];
    var min, max, move;

    if (isRow) {
        move = 1;
        min = matrix*stageSize;
        max = min+stageSize-move;
    }
    else {
        move = stageSize;
        min = matrix;
        max = stageSize*stageSize-(stageSize-matrix);
    }

    for (var i = min; i < max-move; i+=move)
    {
        var block = gModel.get(i);

        if (block.matchable)
        {
            var blocks = [block];

            for (var j = i+move; j <= max; j+=move)
            {
                var nextBlock = gModel.get(j);

                if (nextBlock.key === block.key) {
                    blocks.push(nextBlock);
                } else {
                    break;
                }
            }

            if (blocks.length >= matchSize) {
                founds = Utils.intersect(founds, blocks);
                i += blocks.length - move; // jump found blocks
            }
        }
    }

    // Debug
    if (founds.length > 0)
    {
        if (isRow) {
            console.debug("\nrow: "+ matrix);
        } else {
            console.debug("\ncol: "+ matrix);
        }
        for (var p = 0; p < founds.length; p++) {
            console.debug("block: "+ founds[p].index +" - "+ founds[p].key);
        }
    }
    return founds;
}

