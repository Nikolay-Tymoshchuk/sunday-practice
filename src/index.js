import { Notify } from 'notiflix/build/notiflix-notify-aio';
const books = [
  {
    id: '1',
    title: `Apple. Эволюция компьютера`,
    author: `Владимир Невзоров`,
    img: `https://bukva.ua/img/products/449/449532_200.jpg`,
    plot: `Богато иллюстрированный хронологический справочник по истории компьютеров, в котором увлекательно 
    и в структурированном виде изложена информация о создании и развитии техники Apple на фоне истории 
    персональных компьютеров в целом.
    В книге даны описания десятков наиболее значимых моделей устройств как Apple, так и других производителей, 
    сопровождающиеся большим количеством оригинальных студийных фотографий.
    Книга предназначена для широкого круга читателей, интересующихся историей электроники. 
    Она также может послужить источником вдохновения для дизайнеров, маркетологов и предпринимателей.`,
  },
  {
    id: '2',
    title: `Как объяснить ребенку информатику`,
    author: `Кэрол Вордерман`,
    img: `https://bukva.ua/img/products/480/480030_200.jpg`,
    plot: `Иллюстрированная энциклопедия в формате инфографики о технических, социальных и культурных аспектах 
    в информатике. Пошагово объясняет, как детям максимально эффективно использовать компьютеры и интернет-сервисы, 
    оставаясь в безопасности. 
    Книга рассказывает обо всем: от хранения данных до жизни в интернет-пространстве, 
    от программирования до компьютерных атак. О том, как компьютеры функционируют, о современном программном 
    обеспечении, устройстве Интернета и цифровом этикете. Все концепты - от хакера до биткоина - 
    объясняются наглядно с помощью иллюстраций и схем.`,
  },
  {
    id: '3',
    title: `Путь скрам-мастера. #ScrumMasterWay`,
    author: `Зузана Шохова`,
    img: `https://bukva.ua/img/products/480/480090_200.jpg`,
    plot: `Эта книга поможет вам стать выдающимся скрам-мастером и добиться отличных результатов с вашей командой. 
    Она иллюстрированная и легкая для восприятия - вы сможете прочитать ее за выходные, а пользоваться полученными 
    знаниями будете в течение всей карьеры.
    Основываясь на 15-летнем опыте, Зузана Шохова рассказывает, какие роли и обязанности есть у скрам-мастера, 
    как ему решать повседневные задачи, какие компетенции нужны, чтобы стать выдающимся скрам-мастером, 
    какими инструментами ему нужно пользоваться.`,
  },
];
const divRef = document.body.querySelector('#root');

const newDiv1 = document.createElement('div');
const newDiv2 = document.createElement('div');

newDiv1.classList.add('leftdiv');
newDiv2.classList.add('rightdiv');

divRef.append(newDiv1, newDiv2);

const heading = document.createElement('h1');
const newList = document.createElement('ul');
const addBtn = document.createElement('button');

heading.textContent = 'Online library';
addBtn.textContent = 'Add';

heading.classList.add('title');
addBtn.classList.add('leftdiv__button');
newList.classList.add('leftdiv__list');

newDiv1.append(heading, newList, addBtn);

function renderList(obj) {
  const markup = newList.insertAdjacentHTML(
    'beforeend',
    obj
      .map(
        ({ title }) => `<li class="leftdiv__list-item">
  <p class="booktitle">${title}</p>
<div class="leftdiv__list-item-buttons">
 <button class="list-item__button btndel" type="button">Delete</button>
  <button class="list-item__button btned" type="button">Edit</button></div>
  </li>`,
      )
      .join(''),
  );
}

renderList(books);

const pRef = document.body.querySelectorAll('.booktitle');

pRef.forEach(item => item.addEventListener('click', onClickTitle));

function onClickTitle(event) {
  const book = books.find(item => item.title === event.target.textContent);
  newDiv2.innerHTML = '';
  createPrewiewMarkup(book);
}

function createPrewiewMarkup(obj) {
  const { title, author, img, plot } = obj;
  const markup = newDiv2.insertAdjacentHTML(
    'beforeend',
    `<div class="rightdiv__book">
    <img class="rightdiv__book-img" src="${img}" alt="book">
    <div class="rightdiv__book-info">
    <h2 class="rightdiv__book-title">${title}</h2>
    <p class="rightdiv__book-author">${author}</p>
    <p class="rightdiv__book-plot">${plot}</p>
    </div>
    </div>`,
  );
}

const btnDelEl = document.body.querySelectorAll('.btndel');
const btnEditEl = document.body.querySelectorAll('.btned');

btnDelEl.forEach(item => item.addEventListener('click', onClickDel));
// btnEditEl.forEach(item => item.addEventListener('click', onClickEdit));

function onClickDel(event) {
  const p = event.target.parentElement.previousElementSibling.textContent;
  const book = books.find(item => item.title === p);
  //   books.splice(books.indexOf(book), 1);
  //   newList.innerHTML = '';
  //   renderList(books);
  //   console.log('books :>> ', books);
  console.log('event :>> ', event);
}
