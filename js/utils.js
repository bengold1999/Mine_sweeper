'use strict'

// Fills numbers array from 1 to given Max
function fillNums(max) {
    const nums = [];
    for (var i = 0; i < max; i++) {
        nums.push(i + 1);
    }
    return nums;
}

//Get a random number without the Max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// Get a random number including the Max
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/*function randomly removes and returns an 
element from the gNums array in one line of code.*/
function drawNum() {
    const idx = getRandomInt(0, gNums.length)
    const num = gNums[idx]
    gNums.splice(idx, 1)
    return num
}

// Shuffle items in array
function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

// Padding '0' to a lonely digit.
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

// Convers milliseconds to a readable String
function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}:${(
        milliseconds % 1000
    )
        .toString()
        .substring(0, 3)}`;
}

// Create random ID
function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

// Get a random color code
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// Get all empty positions in board
function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell !== currCell.isMine) {
                emptyPoss.push({ i, j })

            }
        }
    }

    const randIdx = getRandomIntInclusive(0, emptyPoss.length)
    return emptyPoss[randIdx]
}

// Count empty positions around object
function countEmptyPosAround(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }

    return count
}

// Highlight empty positions around object
function shownCells(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const cell = board[i][j]
                const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.classList.add('show')
            }
        }
    setTimeout(() => {
        removeShow(gBoard)  
              
    }, 1000);
    }


// Remove highlight from empty positions around object
function removeShow(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.classList.remove('show')
        }

    }

}

function resetNums() {
    gNums = []
    for (var i = 1; i <= glevel ** 2; i++) {
        gNums.push(i)
    }
    return gNums
}

function copyMat(mat) {
    const newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}

function showAllMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++){
            const cell = gBoard[i][j]
        if (cell.isMine) {
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.classList.add('show')
            
            


        }
    }
}
}