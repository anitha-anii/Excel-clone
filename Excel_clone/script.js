let theadRow = document.getElementById('table-heading-row');
let tbody = document.getElementById('table_body');
let id_cell = document.getElementById('cell_id');
let uploadJsonFile = document.getElementById('jsonFile');
let columns = 26;
let rows = 100;
let currentCell;
// let matrix = [];

// Add sheet button
const addSheetButton = document.getElementById('add-sheet-btn');
const sheetNumHeading = document.getElementById('sheet-num');


// forming OuterArray
let matrix = new Array(rows);
for (let row = 0; row < rows; row++) {
  // adding innerArrays
  matrix[row] = new Array(columns);
  for (col = 0; col < columns; col++) {
       matrix[row][col] = {};
  }
}

let numSheets = 1; // number of sheets
let currSheetNum = 1; // currentSheet


// Forming the matrix
for (let row = 0; row < rows; row++) {
  let rowData = [];
  for (let col = 0; col < columns; col++) {
    rowData.push({});
  }
  matrix.push(rowData);
}

for (let col = 0; col < columns; col++) {
  let th = document.createElement('th');
  th.innerText = String.fromCharCode(col + 65);
  theadRow.appendChild(th);
}

for (let row = 1; row <= rows; row++) {
  let tr = document.createElement('tr');
  let th = document.createElement('th');
  th.innerText = row;
  tr.appendChild(th);

  for (let col = 0; col < columns; col++) {
    let td = document.createElement('td');
    td.setAttribute('contenteditable', 'true');
    td.setAttribute('id', `${String.fromCharCode(col + 65)}${row}`);
    td.addEventListener('input', (event) => onInputFn(event));
    td.addEventListener('focus', (event) => onFocusCellId(event));
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

function onFocusCellId(event) {
  currentCell = event.target;
  id_cell.innerText = currentCell.id;
}

function updateMatrix(currentCell) {
  let obj = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
    id: currentCell.id,
  };
  let id = currentCell.id.split('');
  let i = id[1] - 1;
  let j = id[0].charCodeAt(0) - 65;
  matrix[i][j] = obj;
}

function onInputFn(event) {
  updateMatrix(event.target);
 }
 
//paste/copy/cut
let copy = document.getElementById('copy');
copy.addEventListener('click', () => {
  navigator.clipboard.writeText(currentCell.innerText);
  updateMatrix(currentCell);
});

let cut = document.getElementById('cut');
let cutValue;
cut.addEventListener('click', () => {
  cutValue = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
  };
  currentCell.style.cssText = null;
  currentCell.innerText = '';
  updateMatrix(currentCell);
});

let paste = document.getElementById('paste');
paste.addEventListener('click', () => {
  if (cutValue) {
    currentCell.style.cssText = cutValue.style;
    currentCell.innerText = cutValue.text;
  }
  updateMatrix(currentCell);
});

//text styles
let bold = document.getElementById('bold');
bold.addEventListener('click', () => {
  if (currentCell.style.fontWeight === 'bold') {
    currentCell.style.fontWeight = 'normal';
  } else {
    currentCell.style.fontWeight = 'bold';
  }
  updateMatrix(currentCell);
});

let italic = document.getElementById('italic');
italic.addEventListener('click', () => {
  if (currentCell.style.fontStyle === 'italic') {
    currentCell.style.fontStyle = 'normal';
  } else {
    currentCell.style.fontStyle = 'italic';
  }
  updateMatrix(currentCell);
});

let underline = document.getElementById('underline');
underline.addEventListener('click', () => {
  if (currentCell.style.textDecoration === 'underline') {
    currentCell.style.textDecoration = 'none';
  } else {
    currentCell.style.textDecoration = 'underline';
  }
  updateMatrix(currentCell);
});

//text position
let center = document.getElementById('center');
center.addEventListener('click', () => {
  currentCell.style.textAlign = 'center';
  updateMatrix(currentCell);
});

let left = document.getElementById('left');
left.addEventListener('click', () => {
  currentCell.style.textAlign = 'left';
  updateMatrix(currentCell);
});

let right = document.getElementById('right');
right.addEventListener('click', () => {
  currentCell.style.textAlign = 'right';
  updateMatrix(currentCell);
});

//font size
let size = document.getElementById('size-dropdown');
size.addEventListener('change', () => {
  currentCell.style.fontSize = size.value;
  updateMatrix(currentCell);
});

//style
let font = document.getElementById('fonts-dropdown');
font.addEventListener('change', () => {
  currentCell.style.fontFamily = font.value;
  updateMatrix(currentCell);
});

//color
let Bcolor = document.getElementById('bgcolor');
Bcolor.addEventListener('input', () => {
  currentCell.style.backgroundColor = Bcolor.value;
  updateMatrix(currentCell);
});

let Tcolor = document.getElementById('tcolor');
Tcolor.addEventListener('input', () => {
  currentCell.style.color = Tcolor.value;
  updateMatrix(currentCell);
});


let cutCell = {};

function downloadJson() {
  const matrixString = JSON.stringify(matrix);
  const blob = new Blob([matrixString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'table.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

uploadJsonFile.addEventListener('change', readJSONfileFn);

function readJSONfileFn(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      const fileContent = e.target.result;
      try {
        const fileContentJSON = JSON.parse(fileContent);
        matrix = fileContentJSON;
        fileContentJSON.forEach((row) => {
          row.forEach((cell) => {
            if (cell.id) {
              var currentCell = document.getElementById(cell.id);
              currentCell.innerText = cell.text;
              currentCell.style.cssText = cell.style;
            }
          });
        });
      } catch (err) {
        console.log('Error in reading JSON file', err);
      }
    };
  }
}


addSheetButton.addEventListener('click',()=>{
  // 
  // we clearing we are saving
  if(numSheets===1){
    var tempArr = [matrix]; // virtual memory of my matrix
    localStorage.setItem('arrMatrix',JSON.stringify(tempArr));
  } else{
    var previousSheetArr = JSON.parse(localStorage.getItem('arrMatrix'));
    var updatedArr = [...previousSheetArr,matrix];
    localStorage.setItem('arrMatrix',JSON.stringify(updatedArr));
  }
  // update variable related to my sheet
  numSheets++;
  currSheetNum=numSheets;

  // cleanup my virtual memory
  for(let row=0;row<rows;row++){
    matrix[row]=new Array(columns);
    for(let col=0;col<columns;col++){
      matrix[row][col]={};
    }
  }

// table body will be none for my new sheet;
  tbody.innerHTML=``;
  for(let row=1;row<=rows;row++){
    let tr = document.createElement('tr');
    let th=document.createElement('th');
    th.innerText=row;
    tr.append(th);
    // looping from A to Z
    for (let col = 0; col < columns; col++) {
      let td=document.createElement('td');
      td.setAttribute("contenteditable", "true");
      td.setAttribute('id',`${String.fromCharCode(col+65)}${row}`);
      td.addEventListener('focus',(event)=>onFocusFn(event));
      td.addEventListener('input',(event)=>onInputFn(event));
      tr.append(td);
    }
    tbody.append(tr);
  }
  sheetNumHeading.innerText="Sheet No. " + currSheetNum;
})


document.getElementById("sheet-1").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[0]; // matrix;
  currSheetNum = 1;
  matrix = tableData; // my matrix maintain currentTableData
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});

document.getElementById("sheet-2").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[1]; // matrix;
  matrix = tableData; // my matrix maintain currentTableData
  currSheetNum = 2;
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});

document.getElementById("sheet-3").addEventListener("click", () => {
  var myArr = JSON.parse(localStorage.getItem("arrMatrix"));
  let tableData = myArr[2]; // matrix;
  currSheetNum = 3;
  matrix = tableData; // my matrix maintain currentTableData
  tableData.forEach((row) => {
    row.forEach((cell) => {
      if (cell.id) {
        var mycell = document.getElementById(cell.id);
        mycell.innerText = cell.text;
        mycell.style.cssText = cell.style;
      }
    });
  });
  sheetNumHeading.innerText="Sheet No. "+currSheetNum;
});
