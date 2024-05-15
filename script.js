const card = document.querySelector('.flip-card');
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const buttonExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const shuffleWords = document.querySelector('#shuffle-words');
const time = document.querySelector('#time');
let progress = 0;

const words = [
    {
      word: "Sun",
      translate: "Солнце",
      example: "How could you sit in the sun!",
    },
  
    {
      word: "Candies",
      translate: "Конфеты",
      example: "But she brings me sweets and that sort of thing",
    },
  
    {
      word: "Fridge",
      translate: "Холодильник",
      example: "You just broke my fridge!",
    },
  
    {
      word: "Lamp",
      translate: "Лампа",
      example: "And lastly a paraffin lamp!",
    },
  
    {
      word: "Strawberry",
      translate: "Клубника",
      example: "Had a strawberry patch",
    }
  ];

const currentWords = [...words];

function makeCard ({word, translate, example}) {
    card.querySelector('#card-front h1').textContent = word;
    card.querySelector('#card-back h1').textContent = translate;
    card.querySelector('#card-back p span').textContent = example;
};

function renderCard(arr) {
    arr.forEach((item) => {
        makeCard(item);
    })
};

renderCard(currentWords);

card.onclick = function () {
  card.classList.toggle('active');
};

function getRandomCard(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

shuffleWords.addEventListener('click', () =>{
  makeCard(getRandomCard(currentWords));
})

function showProgress () {
  document.querySelector('#words-progress').value = progress * 25;
  document.querySelector('#current-word').textContent = progress + 1;
  makeCard(currentWords[progress]);
}


buttonNext.onclick = function () {
  progress = ++progress;
  buttonBack.disabled = false;
  if (progress == 4) {
    buttonNext.disabled = true;
  }
  showProgress();
};

buttonBack.onclick = function () {
  progress = --progress;
  if (progress == 0) {
    buttonBack.disabled = true;
  }
  if (progress < 5) {
    buttonNext.disabled = false;
  }
  showProgress();
};

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

function makeExamCard(key) {
  const item = document.createElement("div");
  item.classList.add('card');
  item.textContent = key;
  return item;
};

function mixCards(arr) {
  const newArr = [];
  arr.forEach((item) => {
    newArr.push(makeExamCard(item.word));
    newArr.push(makeExamCard(item.translate));
  })
  return shuffle(newArr);
};

function renderExamCard(arr) {
  arr.forEach((item) => {
    examCards.append(item);
  })
};

let timer;
let sec = 0;
let min = 0;
let firstCard = 0;
let secondCard = 0;
let firstCardIndex = 0;
let secondCardIndex = 0;
const size = Object.keys(words).length;
let endIndex = 0;
let click = false;


buttonExam.addEventListener('click', () => {
  card.classList.add('hidden');
  buttonBack.classList.add('hidden');
  buttonExam.classList.add('hidden');
  buttonNext.classList.add('hidden');
  document.querySelector('#study-mode').classList.add('hidden');
  document.querySelector('#exam-mode').classList.remove('hidden');
  renderExamCard(mixCards(currentWords));

  timer = setInterval(() => {
    sec++;
    if (sec === 60) {
      sec = 0;
      min++
    }
    if (sec < 10) {
      time.textContent = `${min}:0${sec}`;
    }
    else {
      time.textContent = `${min}:${sec}`;
    }
  }, 1000)
})

function showExamProgress(value) {
  const result = (100 * (value + 1)) / size;
  return Math.round(result);
}

examCards.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (click === false) {
    card.classList.add("correct");
    firstCard = card;
    firstCardIndex = currentWords.findIndex((item) => item.word === card.textContent);
    if (firstCardIndex === -1) {
      firstCardIndex = currentWords.indexOf((item) => item.translate === card.textContent);
    }
    click = true;
  } else if (click === true) {
    secondCard = card;
    secondCardIndex = currentWords.findIndex((item) => item.translate === card.textContent);

    if (secondCardIndex === -1) {
      secondCardIndex = currentWords.indexOf((item) => item.word === card.textContent);
    }

    if (firstCardIndex === secondCardIndex) {
      document.querySelector('#correct-percent').textContent = showExamProgress(endIndex) + '%';
      document.querySelector('#exam-progress').value = showExamProgress(endIndex);
      endIndex++;
      firstCard.classList.add("fade-out");
      secondCard.classList.add("correct");
      secondCard.classList.add("fade-out");

      if (endIndex === size) {
        clearInterval(timer);
        document.querySelector('.motivation').textContent = 'Поздравляю! Проверка знаний пройдена успешно!';
      }
      click = false;

    } else if (firstCardIndex !== secondCardIndex) {
      click = false;
      secondCard.classList.add("wrong");
      setTimeout(() => {
        firstCard.classList.remove("correct");
        secondCard.classList.remove("wrong");
      }, 500);
    }
  }
});
