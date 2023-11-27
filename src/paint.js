const canvas = document.getElementById("jsCanvas"); // Canvas 요소 가져오기
const ctx = canvas.getContext("2d"); // 2D 컨텍스트 생성
const colors = document.getElementsByClassName("jsColor"); // 색상 선택
const range = document.getElementById("jsRange"); // 선 굵기 설정
const mode = document.getElementById("jsMode"); // 그리기 모드 설정
const saveBtn = document.getElementById("jsSave"); // 저장 버튼
const clean = document.getElementById("jsClean"); // 지우기 버튼
const eraser = document.getElementById("jsEraser"); // 지우개 버튼
const customColor = document.querySelector("#jsColorCustom"); // 컬러 픽커
const canvasContainer = document.querySelector(".canvas-container");
const cursor = document.querySelector(".cursor"); // 커서
const cursorRange = document.querySelector(".cursor_range"); // 커서 2

const INITIAL_COLOR = "#2c2c2c"; // 초기 선 색상
const CANVAS_SIZE = 900; // Canvas 크기 설정

ctx.strokeStyle = "#2c2c2c"; // 선 색상 초기 설정

canvas.width = CANVAS_SIZE; // Canvas 가로 크기 설정
canvas.height = CANVAS_SIZE; // Canvas 세로 크기 설정

ctx.fillStyle = "white"; // Canvas 배경색 초기 설정
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // Canvas 전체를 배경색으로 채우기

ctx.strokeStyle = INITIAL_COLOR; // 선 색상 초기 설정
ctx.fillStyle = INITIAL_COLOR; // 도형 내부 색상 초기 설정
ctx.lineWidth = 2.5; // 선 굵기 초기 설정

let painting = false; // 그리기 상태 여부
let filling = false; // 채우기 상태 여부

let undoHistory = []; // 상태 저장 배열
let undoIndex = -1; // 현재 상태의 인덱스

const undoBtn = document.getElementById("jsUndo"); // Undo 버튼 요소 가져오기
undoBtn.addEventListener("click", handleUndoClick); // Undo 버튼 클릭 시 함수 호출

const redoBtn = document.getElementById("jsRedo"); // Redo 버튼 요소 가져오기
redoBtn.addEventListener("click", handleRedoClick); // Redo 버튼 클릭 시 함수 호출

// 그리기 중지
function stopPainting() {
  painting = false;
}

// 그리기 시작
function startPainting() {
  painting = true;
  saveState(); // 현재 상태 저장
}

function onMouseMove(event) {
  //마우스가 Canvas 상에서 움직일 때 canvas 크기에 따른 좌표 지정
  const x = event.offsetX * (CANVAS_SIZE / canvas.offsetWidth);
  const y = event.offsetY * (CANVAS_SIZE / canvas.offsetHeight);

  // 그리기 X 경우,
  if (!painting) {
    ctx.beginPath(); // 새로운 경로 시작
    ctx.moveTo(x, y); // 마우스의 현재 위치로 이동
  } else {
    ctx.lineTo(x, y); // 현재 위치까지 선을 그림
    ctx.stroke(); // 화면에 출력
  }
}

// 컬러를 클릭했을 때 호출되는 함수
function handleColorClick(event) {
  const color = event.target.style.backgroundColor; // 클릭한 컬러 버튼의 배경색을 가져옴
  ctx.strokeStyle = color; // 선의 색상을 설정
  ctx.fillStyle = color; // 채우기 영역의 색상을 설정
}

// 컬러가 변경되었을 때, 함수 호출
for (const color of colors) {
  color.addEventListener("click", handleColorClick);
}

// 선 굵기 조절 이벤트에 대응하는 함수 >> 호출 부분이 없다
function handleRangeChange(event) {
  const size = event.target.value; // 이벤트에서 굵기를 가져옴
  ctx.lineWidth = size; // 선의 굵기를 설정
}

// range 요소에 대한 이벤트 리스너 추가
if (range) {
  range.addEventListener("input", handleRangeChange);
}

// 그리기/채우기 모드 전환 함수
function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

// Canvas를 클릭했을 때 호출되는 함수
function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // 채우기 모드일 때 Canvas 전체를 채움
  }
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

/*============================================*/

// 컬러 픽커의 색상이 변경될 때 호출되는 함수
function handleColorPickerChange(event) {
  const selectedColor = event.target.value; // 컬러 픽커에서 선택한 색상을 가져옴
  ctx.strokeStyle = selectedColor; // 선의 색상을 설정
  ctx.fillStyle = selectedColor; // 채우기 영역의 색상을 설정
}

const colorPicker = document.getElementById("jsColorCustom");
colorPicker.value = "#FF4D79"; // 초기 색상 설정
if (colorPicker) {
  colorPicker.addEventListener("input", handleColorPickerChange);
  // 컬러 픽커의 입력 값이 변경되면 호출
}

/*============================================*/

canvasContainer.addEventListener("mousemove", onMouseMove);
canvasContainer.addEventListener("mousedown", startPainting);
canvasContainer.addEventListener("mouseup", stopPainting);
canvasContainer.addEventListener("mouseleave", stopPainting);
canvasContainer.addEventListener("click", handleCanvasClick);
canvasContainer.addEventListener("mousedown", startPainting);

// 상태 저장
canvasContainer.addEventListener("mouseup", () => {
  saveState();
  stopPainting();
});

// mousemove
canvasContainer.addEventListener("mousemove", (e) => {
  // 마우스 움직임에 따라 커서 위치 업데이트 (마우스 클릭의 캔버스 내 좌표 계산)
  const x = e.clientX - canvasContainer.getBoundingClientRect().left;
  const y = e.clientY - canvasContainer.getBoundingClientRect().top;

  // 커서 표시
  cursor.style.display = "block";
  cursorRange.style.display = "block";

  //요소들의 CSS 속성을 업데이트하여 커서의 위치를 조정
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;

  cursorRange.style.left = `${x}px`;
  cursorRange.style.top = `${y}px`;
});

// 마우스가 canvasContainer를 떠나면
canvasContainer.addEventListener("mouseleave", () => {
  cursor.style.display = "none"; // 커서를 화면에서 안보이게
  cursorRange.style.display = "none"; // 커서의 범위를 화면에서 안보이게
});

// 지우기 기능
if (clean) {
  clean.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas를 지움
  });
}

// 지우기 버튼 클릭 시에도 상태 저장
if (eraser) {
  eraser.addEventListener("click", () => {
    ctx.strokeStyle = "white"; // 지우개 모드로 선의 색상을 흰색으로 설정
  });
}

// 이미지 저장 기능
function handleSaveClick() {
  const image = canvas.toDataURL("image/png"); // Canvas의 내용을 이미지로 변환
  const link = document.createElement("a"); //  <a> 요소를 동적으로 생성
  link.href = image; // <a> 요소의 href 속성에 이미지 URL을 설정
  link.download = "PaintJS[EXPORT]"; // <a> 요소의 download 속성에 파일의 이름 설정.
  link.click(); // <a> 요소를 가상으로 클릭, 이미지를 다운로드
}

// 저장 버튼 클릭시 함수 호출
if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

// 추가: Undo 버튼 클릭 시에 이전 상태로 복원
function handleUndoClick() {
  if (undoIndex > 0) {
    // 값이 0보다 클 때만 undo
    undoIndex--; // 현재 이미지 상태 반영
    const state = undoHistory[undoIndex]; // 해당하는 상태의 그림 가져오기
    restoreState(state); // Canvas에 보여주기
  }
}

// 추가: Redo 버튼 클릭 시에 이전 상태로 복원
function handleRedoClick() {
  // undoIndex가 배열보다 작을 때에만 redo => 그리지 않은 그림은 (ctrl+y) 복원 불가
  if (undoIndex < undoHistory.length - 1) {
    undoIndex++; // 현재 이미지 상태 반영
    const state = undoHistory[undoIndex]; // 해당하는 상태의 그림 가져오기
    restoreState(state); // Canvas에 보여주기
  }
}

// 추가: 상태 저장 함수
function saveState() {
  // 현재 Canvas의 이미지 데이터를 가져와 상태로 저장
  const state = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Undo 기록을 관리하기 위해 배열에 상태를 추가
  // 현재 인덱스 이후의 기록은 삭제하고 새로운 상태를 추가
  undoHistory = undoHistory.slice(0, undoIndex + 1);
  undoHistory.push(state);
  // 현재 상태 인덱스를 증가
  undoIndex++;
}

// 추가: 상태 복원 함수
function restoreState(state) {
  // 주어진 이미지 데이터를 Canvas에 복원
  ctx.putImageData(state, 0, 0);
}
