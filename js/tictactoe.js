// Game properties
var tttGame = function () {

    // Data structure to keep track of letters in columns
    this.gridMatrix = [
        ["_","_","_"],
        ["_","_","_"],
        ["_","_","_"]
    ];

    this.movesMade = 0;

    this.opponentMap = {
        X : 'O',
        O : 'X'
    };
};

// Game function definitions

// Set a letter at a specific row or column
tttGame.prototype.setLetter = function(row,col,letter) {
    if(document.getElementById(row + '_' + col).innerHTML == '_') {
        this.movesMade++;
        console.log(letter + " at r: " + row + ", c: " + col);
        console.log("Moves made: " + this.movesMade);
        document.getElementById(row + '_' + col).innerHTML = this.gridMatrix[row][col] = letter;
        return true;
    }
    return false;
}

// All the position checking functions return a position object with a row and column member
// or null

// Check if placing letter can win the game
tttGame.prototype.checkPotentialWin = function(letter) {
    var row = null;
    var col = null;
    var count = 0;

    (this.gridMatrix[0][0] == letter) ? count++ : (this.gridMatrix[0][0] == '_') ? (col = row = 0) : null/*next*/;
    (this.gridMatrix[1][1] == letter) ? count++ : (this.gridMatrix[1][1] == '_') ? (col = row = 1) : null/*next*/;
    (this.gridMatrix[2][2] == letter) ? count++ : (this.gridMatrix[2][2] == '_') ? (col = row = 2) : null/*next*/;
    if(count == 2 && row != null && col != null && this.gridMatrix[row][col] == '_') { //return pos;
        return {"row": row, "col": col};
    }

    count = 0; row = col = null;
    this.gridMatrix[0][2] == letter ? count++ : this.gridMatrix[0][2] == '_' ? (row = 0, col = 2) : null/*next*/;
    this.gridMatrix[1][1] == letter ? count++ : this.gridMatrix[1][1] == '_' ? col = row = 1 : null/*next*/;
    this.gridMatrix[2][0] == letter ? count++ : this.gridMatrix[2][0] == '_' ? (row = 2, col = 0) : null/*next*/;
    if(count == 2 && row != null && col != null && this.gridMatrix[row][col] == '_') {//return pos;
        return {"row": row, "col": col};
    }

    count = 0; row = col = null;
    for(row in this.gridMatrix) {
        (this.gridMatrix[row][0] == letter) ? count++ : (this.gridMatrix[row][0] == '_') ? (col = 0) : null/*next*/;
        (this.gridMatrix[row][1] == letter) ? count++ : (this.gridMatrix[row][1] == '_') ? (col = 1) : null/*next*/;
        (this.gridMatrix[row][2] == letter) ? count++ : (this.gridMatrix[row][2] == '_') ? (col = 2) : null/*next*/;
        if(count == 2 && row != null && col != null && this.gridMatrix[row][col] == '_') {//return pos;
            return {"row": row, "col": col};
        }
        count = 0; row = col = null;
    }

    for(col in this.gridMatrix) {
        (this.gridMatrix[0][col] == letter) ? count++ : (this.gridMatrix[0][col] == '_') ? (row = 0) : null/*next*/;
        (this.gridMatrix[1][col] == letter) ? count++ : (this.gridMatrix[1][col] == '_') ? (row = 1) : null/*next*/;
        (this.gridMatrix[2][col] == letter) ? count++ : (this.gridMatrix[2][col] == '_') ? (row = 2) : null/*next*/;
        if(count == 2 && row != null && col != null && this.gridMatrix[row][col] == '_') {//return pos;
            return {"row": row, "col": col};
        }
        count = 0; row = col = null;
    }
    return null;
}

// Find place where the letter can create a potential win (two of the same letter in a row, column or diagonal)
tttGame.prototype.getFork = function(letter) {
    var firstLetter = null;
    var secondLetter = null;
    for(row in this.gridMatrix){
        for(col in this.gridMatrix[row]) {
            if(this.gridMatrix[row][col] == letter) {
                firstLetter = {"row": row, "col": col};
                break;
            }
        }
        if(firstLetter != null) {
            break;
        }
    }

    if(firstLetter == null) return null;

    for(row in this.gridMatrix){
        for(col in this.gridMatrix[row]) {
            if(row == firstLetter.row && col == firstLetter.col)
                continue;
            if(this.gridMatrix[row][col] == letter) {
                secondLetter = {"row": row, "col": col};
                break;
            }
        }
        if(secondLetter != null) {
            break;
        }
    }

    if(secondLetter == null) return null;

    if(this.gridMatrix[firstLetter.row][secondLetter.col] == '_')
        return {"row": firstLetter.row, "col": secondLetter.col};
    if(this.gridMatrix[secondLetter.row][firstLetter.col] == '_')
        return {"row": secondLetter.row, "col": firstLetter.col};

    return null;
}

// block opponent's potential fork
tttGame.prototype.counterFork = function(letter) {
    var opponent = this.opponentMap[letter];
    var firstPlay = null;
    var potentialOpponentPlay = null;

    for(row in this.gridMatrix){
        for(col in this.gridMatrix[row]) {
            if(this.gridMatrix[row][col] == letter) {
                firstPlay = {"row": row, "col": col};
                break;
            }
        }
        if(firstPlay != null) {
            break;
        }
    }

    if(firstPlay == null) return null;

    potentialOpponentPlay = this.getFork(opponent);

    if(potentialOpponentPlay == null) return null;

    // If player fork is on a side play opposite corner or
    // override playSide behaviour in counterFork to force corner in case of second fork.
    if(Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 1 || this.movesMade > 4)
        return this.playOppositeCorner(opponent);

    // If player fork is on a corner play side
    if(Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 0 ||
        Math.abs(potentialOpponentPlay.row - potentialOpponentPlay.col) == 2)
        return this.playSide();

    return null;
}

tttGame.prototype.playCenter = function() {
    if(this.movesMade != 0 && this.gridMatrix[1][1] == '_') {
        return {"row": 1, "col": 1};
    }

    return null;
}

tttGame.prototype.playOppositeCorner = function(opponent) {
    if(this.gridMatrix[0][0] == opponent && this.gridMatrix[2][2] == '_') {
        return {"row": 2, "col": 2};
    }
    if(this.gridMatrix[2][2] == opponent && this.gridMatrix[0][0] == '_') {
        return {"row": 0, "col": 0};
    }
    if(this.gridMatrix[0][2] == opponent && this.gridMatrix[2][0] == '_') {
        return {"row": 2, "col": 0};
    }
    if(this.gridMatrix[2][0] == opponent && this.gridMatrix[0][2] == '_') {
        return {"row": 0, "col": 2};
    }

    return null;
}

tttGame.prototype.playCorner = function() {
    if(this.gridMatrix[0][0] == '_') {
        return {"row": 0, "col": 0};
    }
    if(this.gridMatrix[2][2] == '_') {
        return {"row": 2, "col": 2};
    }
    if(this.gridMatrix[0][2] == '_') {
        return {"row": 0, "col": 2};
    }
    if(this.gridMatrix[2][0] == '_') {
        return {"row": 2, "col": 0};
    }

    return null;
}

tttGame.prototype.playSide = function() {
    if(this.gridMatrix[0][1] == '_') {
        return {"row": 0, "col": 1};
    }
    if(this.gridMatrix[2][1] == '_') {
        return {"row": 2, "col": 1};
    }
    if(this.gridMatrix[1][2] == '_') {
        return {"row": 1, "col": 2};
    }
    if(this.gridMatrix[1][0] == '_') {
        return {"row": 1, "col": 0};
    }

    return null;
}

// Check if game is won
tttGame.prototype.checkWin = function(letter) {
    if(this.gridMatrix[0][0] == letter &&
        this.gridMatrix[0][0] == this.gridMatrix[1][1] &&
        this.gridMatrix[1][1] == this.gridMatrix[2][2]) {
            return true;
        }

    if(this.gridMatrix[0][2] == letter &&
        this.gridMatrix[0][2] == this.gridMatrix[1][1] &&
        this.gridMatrix[1][1] == this.gridMatrix[2][0]) {
            return true;
        }

    for(row in this.gridMatrix) {
        if(this.gridMatrix[row][0] == letter &&
            this.gridMatrix[row][0] == this.gridMatrix[row][1] &&
            this.gridMatrix[row][1] == this.gridMatrix[row][2]) {
                return true;
        }
    }

    for(col in this.gridMatrix) {
        if(this.gridMatrix[0][col] == letter &&
            this.gridMatrix[0][col] == this.gridMatrix[1][col] &&
            this.gridMatrix[1][col] == this.gridMatrix[2][col]) {
                return true;
        }
    }

    return false;
}

tttGame.prototype.checkGameOver = function() {
    if(this.checkWin('X'))
        return 'X';

    if(this.checkWin('O'))
        return 'O';

    if(this.movesMade == 9)
        return 'T';
}
// End game function definitions

// AI definition
var tttAI = function(game,letter, order) {

    this.letter = letter;

    // This would be used to make AIs play against each other
    this.order = order;

    this.funcList = [
    // 1. Check for possible win
        function(){ return game.checkPotentialWin(letter);},

    // 2. Check for block
        function(){ return game.checkPotentialWin(game.opponentMap[letter]);},

    // 3. Make a fork
        function(){ return game.getFork(letter);},

    // 4. Block a fork
        function(){ return game.counterFork(letter);},

    // 5. Play the Center
        function(){ return game.playCenter();},

    // 6. Play opposite corner
        function(){ return game.playOppositeCorner(game.opponentMap[letter]);},

    // 7. Play empty corner
        function(){ return game.playCorner();},

    // 8. Play empty side
        function(){ return game.playSide();}
    ];

    // Go through the function list to check for next possible move.
    this.move = function() {
        var pos = null;
        for (var i=0; i < this.funcList.length; i++) {
            pos = this.funcList[i]();

            if(pos != null) {
                game.setLetter(pos.row,pos.col, this.letter);
                break;
            }
        }
    };
}

var ai;
var game;

var setup = function() {

    game = new tttGame();
    ai = new tttAI(game, 'O');

    var str = "";
    for (row in game.gridMatrix) {
        for (col in game.gridMatrix[row]) {
            str +='<span id="'+ row + '_' + col + '">'+game.gridMatrix[row][col]+'</span> ';
        }
        str += "<br />"
    }

    document.getElementById('main').innerHTML = str;

    // Attach event to each cell
    for (row in game.gridMatrix) {
        for (col in game.gridMatrix[row]) {
            document.getElementById(row + '_' + col).addEventListener('click', (function(r,c) {
                return function() {
                    var set = game.setLetter(r,c,'X');
                    if(set) {
                        ai.move();
                        switch(game.checkGameOver()) {
                            case 'X':
                                alert("X wins!");
                                setup();
                                break;
                            case 'O':
                                alert("O wins!");
                                setup();
                                break;
                            case 'T':
                                alert("It's a tie!");
                                setup();
                                break;
                        }
                    }
                }
            })(row,col)
            );
        }
    }
};
