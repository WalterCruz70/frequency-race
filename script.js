\
/* Frequency Race — script.js
   Editable questions: the 'questions' array below contains sentence templates
   with a correct adverb and three distractors. */

// 25 adverbs of frequency (and variants) are used across questions.
const questions = [
  { sentence: "I _____ forget my homework.", answer: "sometimes", choices: ["always","sometimes","never","rarely"] },
  { sentence: "She _____ drinks coffee in the morning.", answer: "usually", choices: ["rarely","usually","never","hardly ever"] },
  { sentence: "They _____ go to the cinema on Fridays.", answer: "often", choices: ["often","never","occasionally","constantly"] },
  { sentence: "He _____ eats vegetables — he loves them.", answer: "always", choices: ["seldom","rarely","always","sometimes"] },
  { sentence: "We _____ visit my grandparents on Sundays.", answer: "usually", choices: ["usually","never","hardly ever","rarely"] },
  { sentence: "The bus is _____ late during rush hour.", answer: "frequently", choices: ["never","frequently","once","occasionally"] },
  { sentence: "I _____ watch TV after dinner.", answer: "sometimes", choices: ["constantly","sometimes","always","rarely"] },
  { sentence: "She _____ goes running — almost every day.", answer: "regularly", choices: ["regularly","never","seldom","occasionally"] },
  { sentence: "He _____ forgets names at parties.", answer: "often", choices: ["never","often","rarely","hardly ever"] },
  { sentence: "They _____ have meetings on Monday mornings.", answer: "usually", choices: ["usually","always","never","occasionally"] },
  { sentence: "I _____ eat dessert — only on special days.", answer: "rarely", choices: ["rarely","always","often","sometimes"] },
  { sentence: "We _____ check our email several times a day.", answer: "frequently", choices: ["sometimes","frequently","once","never"] },
  { sentence: "She _____ speaks Spanish at home.", answer: "occasionally", choices: ["occasionally","always","never","hardly ever"] },
  { sentence: "He is _____ on time — he hates being late.", answer: "rarely", choices: ["rarely","often","always","sometimes"] },
  { sentence: "I _____ go to bed early during exam week.", answer: "sometimes", choices: ["always","sometimes","never","frequently"] },
  { sentence: "They _____ practice the piano after school.", answer: "regularly", choices: ["seldom","regularly","never","occasionally"] },
  { sentence: "She _____ drinks tea instead of coffee.", answer: "often", choices: ["often","never","hardly ever","always"] },
  { sentence: "We _____ travel abroad for holidays.", answer: "sometimes", choices: ["always","sometimes","frequently","never"] },
  { sentence: "He _____ calls his mother every day.", answer: "constantly", choices: ["rarely","constantly","occasionally","never"] },
  { sentence: "I _____ forget to water the plants.", answer: "often", choices: ["often","never","seldom","hardly ever"] },
  { sentence: "She _____ goes to that café — just once a month.", answer: "occasionally", choices: ["occasionally","always","often","constantly"] },
  { sentence: "They _____ miss the train because they are late.", answer: "sometimes", choices: ["sometimes","never","always","regularly"] },
  { sentence: "I _____ eat cereal for breakfast.", answer: "usually", choices: ["usually","rarely","never","occasionally"] },
  { sentence: "He _____ arrives early to prepare.", answer: "always", choices: ["always","hardly ever","sometimes","rarely"] },
  { sentence: "We _____ go to the museum — every few months.", answer: "periodically", choices: ["constantly","periodically","never","always"] }
];

// shuffle helper
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; }

// state
let state = {
  questions: [],
  index: 0,
  score: 0,
  total: 25,
  results: []
};

// elements
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const qNum = document.getElementById('qNum');
const qTotal = document.getElementById('qTotal');
const sentenceEl = document.getElementById('sentence');
const choicesEl = document.getElementById('choices');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const playAgain = document.getElementById('playAgain');
const finalScore = document.getElementById('finalScore');
const finalTotal = document.getElementById('finalTotal');
const message = document.getElementById('message');
const downloadBtn = document.getElementById('downloadBtn');
const numQuestions = document.getElementById('numQuestions');
const soundToggle = document.getElementById('sound');

function speakText(t){ if(window.speechSynthesis && soundToggle.checked){ const u=new SpeechSynthesisUtterance(t); u.lang='en-US'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } }

function startGame(){ 
  const n = parseInt(numQuestions.value,10) || 25;
  state.total = n;
  // pick questions shuffled and slice to n
  const pool = shuffle([...questions]);
  state.questions = pool.slice(0,n).map(q=>{
    // shuffle choices and ensure answer present
    const choices = shuffle([...q.choices]);
    return { ...q, choices };
  });
  state.index = 0;
  state.score = 0;
  state.results = [];
  qTotal.textContent = state.total;
  scoreEl.textContent = 0;
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  endScreen.classList.add('hidden');
  showQuestion();
}

function showQuestion(){
  const q = state.questions[state.index];
  qNum.textContent = state.index+1;
  sentenceEl.innerHTML = q.sentence.replace('_____', '<span class="blank">_____</span>');
  // render choices
  choicesEl.innerHTML = '';
  q.choices.forEach(choice=>{
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice;
    btn.onclick = ()=> chooseAnswer(choice, btn, q);
    choicesEl.appendChild(btn);
  });
  nextBtn.classList.add('hidden');
  speakText('Choose the correct adverb. ' + q.sentence.replace('_____', 'blank'));
}

function chooseAnswer(choice, btn, q){
  // disable all choices
  Array.from(choicesEl.children).forEach(c=>c.disabled=true);
  // show correct / wrong styling
  if(choice === q.answer){
    btn.classList.add('correct');
    state.score++;
    scoreEl.textContent = state.score;
    state.results.push({question: q.sentence, answer: q.answer, chosen: choice, correct: true});
    speakText('Correct');
  } else {
    btn.classList.add('wrong');
    // highlight correct
    Array.from(choicesEl.children).forEach(c=>{
      if(c.textContent === q.answer) c.classList.add('correct');
    });
    state.results.push({question: q.sentence, answer: q.answer, chosen: choice, correct: false});
    speakText('Incorrect. The correct answer is ' + q.answer);
  }
  // show next
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', ()=>{
  state.index++;
  if(state.index >= state.total){
    endGame();
  } else {
    showQuestion();
  }
});

quitBtn.addEventListener('click', ()=>{
  // confirm then show end
  if(confirm('Quit now? Your progress will be shown.')) endGame();
});

function endGame(){
  gameScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalScore.textContent = state.score;
  finalTotal.textContent = state.total;
  const pct = Math.round((state.score/state.total)*100);
  let msg = '';
  if(pct === 100) msg = 'Perfect! Amazing work!';
  else if(pct >= 80) msg = 'Great job!';
  else if(pct >= 50) msg = 'Good effort — keep practicing.';
  else msg = 'Keep trying — practice makes progress.';
  message.textContent = msg;

  // speak result
  speakText('Your score is ' + state.score + ' out of ' + state.total + '. ' + msg);

  // prepare CSV download
  downloadBtn.onclick = ()=> {
    const rows = [['Question','Correct answer','Chosen answer','Correct?']];
    state.results.forEach(r=> rows.push([r.question,r.answer,r.chosen,r.correct? 'yes':'no']));
    const csv = rows.map(r=> r.map(c=> '\"' + String(c).replace(/\"/g,'\"\"') + '\"').join(',')).join('\\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frequency-race-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
}

playAgain.addEventListener('click', ()=>{
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
});

startBtn.addEventListener('click', startGame);
