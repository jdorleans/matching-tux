.import "StageConfiguration.js" as Config


function findAllBlocksByKey(key, gModel)
{
    var blocks = [];

    for (var i=0; i<Config.stageSize*Config.stageSize; i++)
    {
        var block = gModel.get(i);

        if (block.key === key) {
            blocks.push(block);
            console.debug("Found by Key: "+ block.key +" - "+ block.index);
        }
    }
    return blocks;
}

function findBlocks(indexs, gModel)
{
    var blocks = [indexs.length];

    for (var i=0; i<indexs.length; i++) {
        blocks.push(gModel.get(indexs[i]));
    }
    return blocks;
}

function findBlocksByKey(indexs, key, gModel)
{
    var blocks = [];

    for (var i=0; i<indexs.length; i++)
    {
        var block = gModel.get(indexs[i]);

        if (block.key === key) {
            blocks.push(block);
            console.debug("Found by Key: "+ block.key +" - "+ block.index);
        }
    }
    return blocks;
}

function findNearBlocks(index, gModel)
{
    var indexs = findNearIndexs(index);
    return findBlocks(indexs, gModel);
}

function findNearBlocksByKey(index, key, gModel)
{
    var indexs = findNearIndexs(index);
    return findBlocksByKey(indexs, key, gModel);
}

function findNearIndexs(index)
{
    var stageSize = Config.stageSize;
    var left = index - 1;
    var right = index + 1;
    var up = index - stageSize;
    var down = index + stageSize;
    var indexs = [];

    if (index % stageSize !== 0) {
        indexs.push(left);
    }

    if (index % stageSize !== stageSize - 1) {
        indexs.push(right);
    }

    if (index >= stageSize) {
        indexs.push(up);
    }

    if (index + stageSize < stageSize * stageSize) {
        indexs.push(down);
    }
    return indexs;
}


function randomInt(value) {
  return Math.floor(Math.random() * value);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function intersect(array1, array2) {
    return unique(array1.concat(array2));
}

function unique(array)
{
    var arr = [];

    for (var i=0; i<array.length; i++) {
        if (arr.indexOf(array[i]) === -1) {
            arr.push(array[i]);
        }
    }
    return arr;
}
