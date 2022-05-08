import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import booksObj from './js/book-example';
import PreviewTpl from './templates/preview.hbs';
import ListTpl from './templates/list.hbs';
import FormTpl from './templates/form.hbs';
import throttle from 'lodash.throttle';
const divRef = document.body.querySelector('#root');
const KEY = 'books';


// Инициализируем две зоны экрана, для списка книг и отображения книг
const newDiv1 = document.createElement('div');
newDiv1.classList.add('leftdiv');
const newDiv2 = document.createElement('div');
newDiv2.classList.add('rightdiv');
// ===================================================================

// Создаем DOM узлы для левого блока
const heading = document.createElement('h1');
heading.classList.add('title');
heading.textContent = 'Online library';
const newList = document.createElement('ul');
newList.classList.add('leftdiv__list');
const addBtn = document.createElement('button');
addBtn.classList.add('button');
addBtn.textContent = 'Add';
// ===================================================================

//Выводим созданные узлы в интерфейс
newDiv1.append(heading, newList, addBtn);
divRef.append(newDiv1, newDiv2);
// ===================================================================

// Создаем функции для истановки и получения данных из WEB хранилища
const setLocalStorage = (obj) => localStorage.setItem(KEY, JSON.stringify(obj));
const getLocalStorage = () => JSON.parse(localStorage.getItem(KEY));
// ===================================================================


// Создаем функцию для отрисовки списка книг
const renderList = (obj) => newList.insertAdjacentHTML('beforeend', obj.map(ListTpl).join(''));
// ===================================================================

// Записываем данные в локальное хранилище
setLocalStorage(booksObj);
// ===================================================================

// Отрисовываем список книг
renderList(getLocalStorage());
// ===================================================================

// Создаем обработчик кликов на элементы списка книг
newList.addEventListener('click', onClickByListElement);
// ===================================================================

// Создаем функцию для обработки кликов на список в зависимости от элемента, на котором произошел клик
function onClickByListElement(event) {
  // Обрабатываем клик по названию книги
  if (event.target.classList.contains('booktitle')) {
    onClickByTitle(event);
  }
  // Обрабатываем клик по кнопке удаления книги
  else if (event.target.classList.contains('btndel')) {
    onClickDel(event);
  }
    // Обрабатываем клик по кнопке изменения книги
  else if (event.target.classList.contains('btnedit')) {
    onClickEdit(event);
  }
}

// Функция поиска и рендара в правом блоке превью книги по клику на ее название
function onClickByTitle(event) {
  const book = getLocalStorage().find(item => item.title === event.target.textContent);
  newDiv2.innerHTML = '';
  createPrewiewMarkup(book);
}
// ==================================================================

// Создаем функцию для отрисовки превью книги в правом блоке просмотра
function createPrewiewMarkup(obj) {
  if (!obj.img) { obj.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Book.svg/1200px-Book.svg.png' }
  newDiv2.insertAdjacentHTML('beforeend', PreviewTpl(obj));
}
// ===================================================================


// Функция удаления книги. Находим=> Удаляем=> Очищаем список => Отрисовываем новый с учетом изменений
function onClickDel(event) {
  const idOfTargetedBook = event.target.closest('li').id;
  const targetedBookFromStorage = getLocalStorage().filter(item => item.id !== idOfTargetedBook);
  setLocalStorage(targetedBookFromStorage);
  newList.innerHTML = '';
  renderList(getLocalStorage());
}
// ==================================================================

// Функция удаления добавления книги при еажении на кнопку "Add"
addBtn.addEventListener('click', onClickAdd);

function onClickAdd(event) {

  // создаем модальное окно
  basicLightbox.create(FormTpl()).show();

  const form = document.querySelector('.book-form');
  const formInputs = form.querySelectorAll('input');

  // Проверяем, есть ли книга с данными, которые мы вводили, но не сохранили
  localStorageTplCheck(formInputs);

  // Добавляем слушателей на инпуты и кнопку сохранения
  form.addEventListener('input', throttle(onInputChange, 250));

  const saveBtn = document.body.querySelector('.btn-save');
  saveBtn.addEventListener('click', onClickSave);
}
// ==================================================================

// Функция-обработчик кнопки сохранения.
function onClickSave(e) {
  e.preventDefault();

// Создаем новую книгу(по умолчанию пустой объект)
  const newBook = {};
// Достаем данные из формы
  const formEl = document.querySelector('.book-form');
  const formData = new FormData(formEl);
// Присваиваем новой книге ключи и из значения из полей формы
  formData.forEach((value, key) => newBook[key] = value);
  // Добавляем ID новой книге
  newBook.id = Date.now().toString();

  // Если в поле воода не введен url картинки, то устанавиливаем его по умолчанию
  if (!newBook.img) { newBook.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Book.svg/1200px-Book.svg.png' }
  // Проверяем на заплненность полей(img url не обязательное поле)
  if (Object.values(newBook).some(item => item === '')) {
    Notify.failure('All fields must be filled');
    return
  }
  // Если все поля заполнены, то сохраняем новую книгу в localStorage, перезаписывая в нем данные
  else {
    setLocalStorage([...getLocalStorage(), newBook]);
  }

  // Очищаем ненужную информацию, перерисовываем список и выводим уведомление об успешном сохранении
  localStorage.removeItem('TemporaryObject');
  formEl.reset();
  newList.innerHTML = '';
  renderList(getLocalStorage());
  Notify.success('Book added', {position: 'center-top'});
}
// ==================================================================

function onInputChange(e) {
  const input = e.target;
  if (input === e.currentTarget) return;

  const objectTpl = {};
  const formData = new FormData(e.currentTarget);
  formData.forEach((value, key) => objectTpl[key] = value);

  localStorage.setItem('TemporaryObject', JSON.stringify(objectTpl));
}

function localStorageTplCheck(arr) {
  const tplParsed = JSON.parse(localStorage.getItem('TemporaryObject'));
  
  if (!localStorage.TemporaryObject) return;
  
  Object.entries(tplParsed).forEach(([key, value]) => {
    arr.forEach(input => { if (input.name === key) input.value = value; });
  });  
}