var gridMatrix = [
    ["_","_","_"],
    ["_","_","_"],
    ["_","_","_"]
];

var opponentMap = {
    X : 'O',
    O : 'X'
};

var movesMade = 0;

function setLetter(row,col,letter) {
    if(document.getElementById(row + '_' + col).innerHTML == '_') {
        movesMade++;
        console.log(letter + " r: " + row + ", c: " + col);
        console.log("Moves made: " + movesMade);
        document.getElementById(row + '_' + col).innerHTML = gridMatrix[row][col] = letter;
        return true;
    }
    return false;
}

function checkPotentialWin(letter) {
    var row = null;
    var col = null;
    var count = 0;

    (gridMatrix[0][0] == letter) ? count++ : (gridMatrix[0][0] == '_') ? (col = row = 0) : null/*next*/;
    (gridMatrix[1][1] == letter) ? count++ : (gridMatrix[1][1] == '_') ? (col = row = 1) : null/*next*/;
    (gridMatrix[2][2] == letter) ? count++ : (gridMatrix[2][2] == '_') ? (col = row = 2) : null/*next*/;
    if(count == 2 && row != null && col != null && gridMatrix[row][col] == '_') { //return pos;
        return {"row": row, "col": col};
    }

    count = 0; row = col = null;
    gridMatrix[0][2] == letter ? count++ : gridMatrix[0][2] == '_' ? (row = 0, col = 2) : null/*next*/;
    gridMatrix[1][1] == letter ? count++ : gridMatrix[1][1] == '_' ? col = row = 1 : null/*next*/;
    gridMatrix[2][0] == letter ? count++ : gridMatrix[2][0] == '_' ? (row = 2, col = 0) : null/*next*/;
    if(count == 2 && row != null && col != null && gridMatrix[row][col] == '_') {//return pos;
        return {"row": row, "col": col};
    }

    count = 0; row = col = null;
    for(row in gridMatrix) {
        (gridMatrix[row][0] == letter) ? count++ : (gridMatrix[row][0] == '_') ? (col = 0) : null/*next*/;
        (gridMatrix[row][1] == letter) ? count++ : (gridMatrix[row][1] == '_') ? (col = 1) : null/*next*/;
        (gridMatrix[row][2] == letter) ? count++ : (gridMatrix[row][2] == '_') ? (col = 2) : null/*next*/;
        if(count == 2 && row != null && col != null && gridMatrix[row][col] == '_') {//return pos;
            return {"row": row, "col": col};
        }
        count = 0; row = col = null;
    }

    for(col in gridMatrix) {
        (gridMatrix[0][col] == letter) ? count++ : (gridMatrix[0][col] == '_') ? (row = 0) : null/*next*/;
        (gridMatrix[1][col] == letter) ? count++ : (gridMatrix[1][col] == '_') ? (row = 1) : null/*next*/;
        (gridMatrix[2][col] == letter) ? count++ : (gridMatrix[2][col] == '_') ? (row = 2) : null/*next*/;
        if(count == 2 && row != null && col != null && gridMatrix[row][col] == '_') {//return pos;
            return {"row": row, "col": col};
        }
        count = 0; row = col = null;
    }
    return null;
}

function getFork(letter) {
    var firstLetter = null;
    var secondLetter = null;
    for(row in gridMatrix){
        for(col in gridMatrix[row]) {
            if(gridMatrix[row][col] == letter) {
                firstLetter = {"row": row, "col": col};
                break;
            }
        }
        if(firstLetter != null) {
            break;
        }
    }

    if(firstLetter == null) return null;

    for(row in gridMatrix){
        for(col in gridMatrix[row]) {
            if(row == firstLetter.row && col == firstLetter.col)
                continue;
            if(gridMatrix[row][col] == letter) {
                secondLetter = {"row": row, "col": col};
                break;
            }
        }
        if(secondLetter != null) {
            break;
        }
    }

    if(secondLetter == null) return null;

    if(gridMatrix[firstLetter.row][secondLetter.col] == '_')
        return {"row": firstLetter.row, "col": secondLetter.col};
    if(gridMatrix[secondLetter.row][firstLetter.col] == '_')
        return {"row": secondLetter.row, "col": firstLetter.col};

    return null;
}

function counterFork(letter) {
    var opponent = opponentMap[letter];
    var firstPlay = null;
    var potentialOpponentPlay = null;

    for(row in gridMatrix){
        for(col in gridMatrix[row]) {
            if(gridMatrix[row][col] == letter) {
                firstPlay = {"row": row, "col": col};
                break;
            }
        }
        if(firstPlay != null) {
            break;
        }
    }

    if(firstPlay == null) return null;

    potentialOpponentPlay = getFork(opponent);

    if(potentialOpponentPlay == null) return null;

    // If player fork is on a side play corner
    if(Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 1)
        return playCorner();

    // If player fork is on a corner play side
    if(Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 0 ||
        Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 2)
        return playSide();

    return null;
}

function playCenter() {
    if(movesMade != 0 && gridMatrix[1][1] == '_') {
        return {"row": 1, "col": 1};
    }

    return null;
}

function playOppositeCorner(opponent) {
    if(gridMatrix[0][0] == opponent && gridMatrix[2][2] == '_') {
        return {"row": 2, "col": 2};
    }
    if(gridMatrix[2][2] == opponent && gridMatrix[0][0] == '_') {
        return {"row": 0, "col": 0};
    }
    if(gridMatrix[0][2] == opponent && gridMatrix[2][0] == '_') {
        return {"row": 2, "col": 0};
    }
    if(gridMatrix[2][0] == opponent && gridMatrix[0][2] == '_') {
        return {"row": 0, "col": 2};
    }

    return null;
}

function playCorner() {
    if(gridMatrix[0][0] == '_') {
        return {"row": 0, "col": 0};
    }
    if(gridMatrix[2][2] == '_') {
        return {"row": 2, "col": 2};
    }
    if(gridMatrix[0][2] == '_') {
        return {"row": 0, "col": 2};
    }
    if(gridMatrix[2][0] == '_') {
        return {"row": 2, "col": 0};
    }

    return null;
}

function playSide() {
    if(gridMatrix[0][1] == '_') {
        return {"row": 0, "col": 1};
    }
    if(gridMatrix[2][1] == '_') {
        return {"row": 2, "col": 1};
    }
    if(gridMatrix[1][2] == '_') {
        return {"row": 1, "col": 2};
    }
    if(gridMatrix[1][0] == '_') {
        return {"row": 1, "col": 0};
    }

    return null;
}

var tttAI = function(letter, order) {

    this.letter = letter;
    this.order = order;

    this.funcList = [
    // 1. Check for possible win
        function(){ return checkPotentialWin(letter);},

    // 2. Check for block
        function(){ return checkPotentialWin(opponentMap[letter]);},

    // 3. Make a fork
        function(){ return getFork(letter);},

    // 4. Block a fork
        function(){ return counterFork(letter);},

    // 5. Play the Center
        function(){ return playCenter();},

    // 6. Play opposite corner
        function(){ return playOppositeCorner(opponentMap[letter]);},

    // 7. Play empty corner
        function(){ return playCorner();},

    // 8. Play empty side
        function(){ return playSide();}
    ];

    this.move = function() {
        var pos = null;
        for (var i=0; i < this.funcList.length; i++) {
            pos = this.funcList[i]();

            if(pos != null) {
                setLetter(pos.row,pos.col, this.letter);
                break;
            }
        }
    };
}

function checkWin(winner) {
    if(gridMatrix[0][0] == winner &&
        gridMatrix[0][0] == gridMatrix[1][1] &&
        gridMatrix[1][1] == gridMatrix[2][2]) {
            return true;
        }

    if(gridMatrix[0][2] == winner &&
        gridMatrix[0][2] == gridMatrix[1][1] &&
        gridMatrix[1][1] == gridMatrix[2][0]) {
            return true;
        }

    for(row in gridMatrix) {
        if(gridMatrix[row][0] == winner &&
            gridMatrix[row][0] == gridMatrix[row][1] &&
            gridMatrix[row][1] == gridMatrix[row][2]) {
                return true;
        }
    }

    for(col in gridMatrix) {
        if(gridMatrix[0][col] == winner &&
            gridMatrix[0][col] == gridMatrix[1][col] &&
            gridMatrix[1][col] == gridMatrix[2][col]) {
                return true;
        }
    }

    return false;
}

var ai;

var setup = function() {

    ai = new tttAI('O');

    var str = "";
    for (row in gridMatrix) {
        for (col in gridMatrix[row]) {
            str +='<span id="'+ row + '_' + col + '">'+gridMatrix[row][col]+'</span> ';
        }
        str += "<br />"
    }

    document.getElementById('main').innerHTML = str;

    for (row in gridMatrix) {
        for (col in gridMatrix[row]) {
            document.getElementById(row + '_' + col).addEventListener('click', (function(r,c) {
                return function() {
                    var set = setLetter.call(this,r,c,'X');
                    if(set) {
                        if(checkWin('X')) {
                            alert("X wins!");
                            console.log("alert clicked!");
                        } else {
                            ai.move();
                        }
                    }
                }
            })(row,col)
            );
        }
    }
};

var startGame = function() {
    setup();
}

if(document.addEventListener){
    document.addEventListener('DOMContentLoaded', startGame, false);
}else{
    window.onload = startGame;
}
