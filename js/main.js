'use strict'
var gIsMine
var gBoard
const MINE = '☼'
var gElselected
var MARK = '🚩'
var gNumberOfMark
var gnumLives =3
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    mineCounts: 0
}


var gLevel = {
    SIZE: 4,
    MINES: 3
}
function sizeLevel(level, mines) {
    gLevel.SIZE = level
    gLevel.MINES = mines
    onInit()
}
function onPlay() {
    
    gBoard = copyMat(gBoard)
    renderBoard(gBoard)

    // if()
    if(gnumLives===0){
        onInit()
        gnumLives=3
    }


    
    
    
    if (!gGame.isOn) {
        // copyMat(gBoard)
        // renderBoard(gBoard)
        gGame.isOn = true
        var modal = document.querySelector('.gameover')
        modal.style.display = 'none'
    }
    gGame.mineCounts = 0
    gGame.shownCount = 0
    gNumberOfMark = 0
    var smiley = document.querySelector('.smile')
    smiley.innerText = '😀'
    var modal2 = document.querySelector('.try')
    modal2.style.display = 'none'


   
   
    //    if(gnumLives===0)gnumLives=3
             
    

    

}

function onInit() {
    // onPlay()
    gBoard = buildBoard()
    renderBoard(gBoard)
    gnumLives=3


}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false

            }

        }
    }

    // board[0][3].isMine = true
    // board[1][3].isMine = true
    randomMine(board, gLevel.MINES)

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
            if(board[i][j].minesAroundCount===0){
                board[i][j].innerText=''
            }
        }

    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = cell.isShown ? 'show' : ''

            if (cell.isMine === true) {
                cell.minesAroundCount = MINE

            }
            strHTML += `<td data-i=${i} data-j=${j} onClick = "onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,this,${i},${j})" class="${className}">${cell.minesAroundCount}</td> `
            // if(board[i][j].minesAroundCount===0){
            //     board[i][j].innerText=''
            // }
        }
        strHTML += '</tr>'
    }

    console.log(strHTML)

    const elBoard = document.querySelector('.board')

    elBoard.innerHTML = strHTML
    var livesLeft = document.querySelector('h2 span')
    livesLeft.innerText = gnumLives
   

}


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    console.log(elCell)
    const cell = gBoard[i][j]

    // var cellsMines = cell.isMine
    if (cell.isShown) return
    if (cell.isMarked) return

    cell.isShown = true
    gGame.shownCount++
    elCell.classList.add('show')

    if (cell.isMine) {
        showAllMines()  
        gGame.mineCounts++
        gnumLives--
        gGame.isOn=false
        checkGameOver()
    

        var livesLeft = document.querySelector('h2 span')
        livesLeft.innerText = gnumLives



    } else if (cell.minesAroundCount === 0) {
        expandShown(i, j)
    }


    checkGameOver()

}
function onCellMarked(event, elCell, i, j) {
    gNumberOfMark++

    event.preventDefault();

    var isMarked = elCell.classList.contains('marked')
    var isShown = elCell.classList.contains('show')

    if (isMarked) {
        elCell.classList.remove('marked')
        var cell = gBoard[i][j]
        elCell.innerHTML = cell.minesAroundCount
    } else if (!isShown) {
        elCell.classList.add('marked')
        elCell.innerHTML = MARK
    }
    checkGameOver()
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            // console.log(i,j)
            // console.log(currCell)
            if (currCell.isMine === true) count++
        }
    }

    return count
}

function expandShown(i, j) {
    for (var index = -1; 1 >= index; index++) {
        for (var jindex = -1; 1 >= jindex; jindex++) {
            var row = i - index
            var col = j - jindex

            if (row < 0 || row >= gLevel.SIZE) continue
            if (col < 0 || col >= gLevel.SIZE) continue


            var cell = gBoard[row][col]
            if (cell && !cell.isMine && !cell.isShown) {
                var data = document.querySelector(`[data-i="${row}"][data-j="${col}"]`)
                cell.isShown = true
                gGame.shownCount++
                data.classList.add('show')

                if (cell.minesAroundCount === 0) {
                    expandShown(row, col)
                }
            }
        }
    }
}


function randomMine(board, numsMines) {
    var mines = 0
    while (mines < numsMines) {
        var randIdx = Math.floor(Math.random() * gLevel.SIZE)
        var randJdx = Math.floor(Math.random() * gLevel.SIZE)
        if (!board[randIdx][randJdx].isMine) {
            board[randIdx][randJdx].isMine = true
            mines++

        }

    }


}


function checkGameOver() {
    var modal = document.querySelector('.gameover')
    var modal2 = document.querySelector('.try')
    var smiley = document.querySelector('.smile')
    if(!gGame.isOn){
        smiley.innerText = '🤯'
        
        modal2.style.display = 'block'
    }
    if  (gGame.mineCounts === gLevel.MINES || gnumLives === 0) {

        gGame.isOn = false

        modal.style.display = 'block'
        modal2.style.display = 'none'

        
        smiley.innerText = '🤯'
        


    }
    else if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES + gGame.mineCounts) && gNumberOfMark === gLevel.MINES) {
        gGame.isOn = false
        modal.style.display = 'block'
        var smiley = document.querySelector('.smile')
        smiley.innerText = '😎'

    }
    // console.log(gGame.isOn)

}

