'use strict'
var gIsMine
var gBoard
const MINE = 'x'
var gElselected
var gGame = { 
    isOn: false, 
    shownCount: 0, 
    markedCount: 0, 
    secsPassed: 0 
} 

 

var gLevel = { 
    SIZE: 4, 
    MINES: 2 
} 

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)

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
    board[0][3].isMine = true
    board[1][3].isMine = true
    // randomMine(board)
    
        for (var i = 0; i < gLevel.SIZE; i++){
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board,i,j)
            
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
            const className= cell.isShown ? 'show': ''
            
            if(cell.isMine===true){
            cell.minesAroundCount=MINE
            
            }
            strHTML += `<td data=${i} data-j=${j} onClick = "onCellClicked(this,${i},${j})" class="${className}">${cell.minesAroundCount}</td> `
        }
        strHTML += '</tr>'
    }
        
    console.log(strHTML)

    const elBoard = document.querySelector('.board')
    
    elBoard.innerHTML = strHTML
 }

function onCellClicked(elCell, i, j) {
    console.log(elCell)
    const cell = gBoard[i][j]
    if(cell.isShown)return
    if(cell.isMarked)return
    
    cell.isShown = true
    
    
    if(cell.isMine){
        cell.innerHTML=MINE
    }
    elCell.classList.add('show')

}
// function onCellMarked(elCell) {
    
// }

function setMinesNegsCount(board,rowIdx,colIdx){
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            // console.log(i,j)
            // console.log(currCell)
            if (currCell.isMine===true) count++
        }
    }

    return count
}

function randomMine(board){
    const emptyPos = getEmptyPos()

    for(var i =1;i<gLevel.MINES;i++){

    }
}