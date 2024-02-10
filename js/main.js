'use strict'
var gIsMine
var gBoard
const MINE = '☼'
var MARK = '🚩'
var gNumberOfMark
var gnumLives = 3
var timeCount
var gintervalTime
var isHint = false
var intervalHint


var gGame = {
    isOn: true,
    isOver: false,
    shownCount: 0,
    markedCount: 0
}


var gLevel = {
    SIZE: 4,
    MINES: 2
}
function sizeLevel(level, mines) {
    gLevel.SIZE = level
    gLevel.MINES = mines
    onInit()
}
function onPlay() {
    if (gGame.isOver)
        return

    gBoard = copyMat(gBoard)
    renderBoard(gBoard)


    if (!gGame.isOn) {
        gGame.isOn = true
        var modal = document.querySelector('.gameover')
        modal.style.display = 'none'
    }

    var smiley = document.querySelector('.smile')
    smiley.innerText = '😀'
    var modal2 = document.querySelector('.try')
    modal2.style.display = 'none'

}

function onInit() {
    gGame.isOver = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    timeCount = -1
    clearInterval(gintervalTime)
    gintervalTime = setInterval(timerRender, 1000)
    gnumLives = 3
    gBoard = buildBoard()
    renderBoard(gBoard)

    var modal2 = document.querySelector('.try')
    modal2.style.display = 'none'
    if (modal2.style.display === 'none') {
        gnumLives = 3
        onPlay()
        gNumberOfMark = 0
    }


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
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].innerText = ''
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
            var className = '';



            if (cell.isMine === true) {
                cell.minesAroundCount = MINE
                cell.isShown = false
                className = 'mine '
            }

            className += cell.isShown ? 'show' : ''

            strHTML += `<td data-i=${i} data-j=${j} onClick = "onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,this,${i},${j})" class="${className}">${cell.minesAroundCount === 0 ? '' : cell.minesAroundCount}</td> `

        }
        strHTML += '</tr>'

    }

    const elBoard = document.querySelector('.board')

    elBoard.innerHTML = strHTML
    var livesLeft = document.querySelector('h2 span')
    livesLeft.innerText = gnumLives


}


function onCellClicked(elCell, i, j) {
    if (elCell.classList.contains('marked')) return
    if (!gGame.isOn) return
    const cell = gBoard[i][j]

    if (cell.isMine && gGame.shownCount === 0) {
        gBoard = buildBoard()
        renderBoard(gBoard)
        elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        return onCellClicked(elCell, i, j)
    }


    // var cellsMines = cell.isMine
    if (cell.isShown) return
    if (cell.isMarked) return

    cell.isShown = true
    if (!cell.isMine)
        gGame.shownCount++
    elCell.classList.add('show')

    if (cell.isMine) {
        showAllMines()
        gnumLives--
        gGame.isOn = false
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

    event.preventDefault()

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
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
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
    var modal2 = document.querySelector('.try')
    var smiley = document.querySelector('.smile')
    console.log(gGame.shownCount)
    if (!gGame.isOn) {
        smiley.innerText = '🤯'

        modal2.style.display = 'block'
    }
    if (gnumLives === 0) {
        gameover(false)
    }
    else if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        gameover(true)
    }


}


function gameover(win) {

    clearInterval(gintervalTime)
    var modal = document.querySelector('.gameover')
    var modal2 = document.querySelector('.try')
    var smiley = document.querySelector('.smile')



    if (win) {

        gGame.isOn = false
        gGame.isOver = true
        modal.style.display = 'block'
        smiley.innerText = '😎'
        var mineElements = document.querySelectorAll('.mine')
        modal.innerText = 'WINNER!'
        modal.style.backgroundColor = 'green'
        for (var i = 0; mineElements.length > i; i++) {
            mineElements[i].classList.add('marked')
            mineElements[i].innerHTML = MARK

        }

    } else {

        gGame.isOn = false
        gGame.isOver = true
        modal.style.display = 'block'
        modal2.style.display = 'none'
        modal.style.backgroundColor = 'red'
        modal.innerText = 'LOSER!'
        smiley.innerText = '🤯'

    }
}

function timerRender() {
    var elTimer = document.querySelector('.timer h3')
    timeCount++
    elTimer.innerHTML = `TIME:${timeCount}`

}


