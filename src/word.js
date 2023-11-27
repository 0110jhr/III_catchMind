const words = [
  "질투",
  "전투",
  "영자",
  "공원",
  "투수",
  "전집",
  "해부",
  "평발",
  "덧신",
  "가락",
  "루루",
  "방울",
  "진급",
  "일출",
  "일벌",
  "물소",
  "모빌",
  "달걀",
  "가루",
  "온수",
  "수면",
  "감방",
  "독감",
  "번개",
  "가요",
  "바늘",
  "치질",
  "타액",
  "이병",
  "노인",
  "문패",
  "전투",
  "방석",
  "영자",
  "투수",
  "해부",
  "평발",
  "다락",
  "바지",
  "백발",
  "덧신",
  "웅변",
  "진급",
  "구보",
  "일출",
  "일벌",
  "물소",
  "모빌",
  "달걀",
  "가루",
  "온수",
  "수면",
  "독감",
  "가요",
  "토지",
  "바늘",
  "치질",
  "이병",
  "대문",
  "출입",
  "특색",
  "철쭉",
  "소라",
  "가위",
  "다방",
  "마법",
  "통닭",
  "연지",
  "신상",
  "정식",
  "축배",
  "예물",
  "점심",
  "증발",
  "거름",
  "캐디",
  "신장",
  "수통",
  "모글",
  "질식",
  "입석",
  "토시",
  "튀김",
  "역사",
  "특허",
  "중략",
  "말굽",
  "간첩",
  "연어",
  "쾌락",
  "요금",
  "주문",
  "개인",
  "박스",
  "잡종",
  "여비",
  "톱날",
  "선장",
  "호우",
  "야채",
  "철야",
  "식빵",
  "헤딩",
  "이루",
  "쥐치",
  "운전",
  "듀스",
  "찜통",
  "생식",
  "유럽",
  "방패",
  "급류",
  "투시",
  "향료",
  "문패",
  "햅쌀",
  "연극",
  "쿠키",
  "샴푸",
  "창구",
  "위조",
  "효과",
  "자녀",
  "엽전",
  "들깨",
  "깡패",
  "재연",
  "주류",
];

const wordDisplay = document.getElementById("word-display");
const nextWordBtn = document.getElementById("next-word-btn");
const wordCountInput = document.getElementById("word-count");
let displayedCount = 0;
let totalWordCount = 0;

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function displayRandomWord() {
  const randomWord = getRandomWord();
  wordDisplay.textContent = randomWord;
}
//사용자 입력만큼
function displayRandomWord() {
  const randomWord = getRandomWord();
  wordDisplay.textContent = randomWord;
  displayedCount++;

  if (displayedCount === totalWordCount) {
    nextWordBtn.disabled = true;
    alert("수고 하셨습니다. 확인을 누르면 다음 페이지로 이동합니다. ");
    window.location.href = "loading2End.html";
  }
}
document
  .getElementById("generate-words-btn")
  .addEventListener("click", function () {
    totalWordCount = parseInt(wordCountInput.value, 10) || 1; // 입력된 값이 없으면 기본값 1
    displayedCount = 0;
    nextWordBtn.disabled = false;
    displayRandomWord();
  });

//다음 단어 클릭시 페인트 초기와 & 랜덤 출력 & 카운트 초기화
document.getElementById("next-word-btn").onclick = function () {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  nextWordBtn.addEventListener("click", displayRandomWord);
  nextWordBtn.addEventListener("click", startTimer(30));
};

// 초기 단어 표시
displayRandomWord();

// "다음 단어" 버튼 클릭 시 새로운 단어 표시
nextWordBtn.addEventListener("click", displayRandomWord);
