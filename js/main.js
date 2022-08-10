const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
   const submitForm = document.getElementById("inputBook");
   submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

function addBook() {
   const bookTitle = document.getElementById("inputBookTitle").value;
   const bookAuthor = document.getElementById("inputBookAuthor").value;
   const bookYear = document.getElementById("inputBookYear").value;
   const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

   const generatedID = generateId();
   const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete, false);
   books.push(bookObject);

   document.dispatchEvent(new Event(RENDER_EVENT));

   saveData();
}

function generateId() {
   return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
   return {
      id,
      title,
      author,
      year,
      isCompleted,
   };
}

function makeBook(bookObject) {
   const bookTitle = document.createElement("h3");
   bookTitle.innerText = bookObject.title;

   const bookAuthor = document.createElement("p");
   bookAuthor.innerText = bookObject.author;

   const bookYear = document.createElement("p");
   bookYear.innerText = `(${bookObject.year})`;
   bookYear.style.fontWeight = "600";

   const bookDesc = document.createElement("div");
   bookDesc.classList.add("book_desc");
   bookDesc.append(bookAuthor, bookYear);

   const articleItem = document.createElement("div");
   articleItem.classList.add("book_wrapper");
   articleItem.append(bookTitle, bookDesc);

   const container = document.createElement("article");
   container.classList.add("book_item");
   container.append(articleItem);
   container.setAttribute("id", `book-${bookObject.id}`);

   const action = document.createElement("div");
   action.classList.add("action");

   if (bookObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo");
      undoButton.innerHTML = `<i class="bx bx-undo"></i>`;

      undoButton.addEventListener("click", function () {
         undoBookFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = `<i class="bx bxs-trash-alt"></i>`;

      trashButton.addEventListener("click", function () {
         removeBookFromCompleted(bookObject.id);
      });

      action.append(undoButton, trashButton);
      container.append(action);
   } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check");
      checkButton.innerHTML = `<i class="bx bx-check"></i>`;

      checkButton.addEventListener("click", function () {
         addBookToCompleted(bookObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = `<i class="bx bxs-trash-alt"></i>`;

      trashButton.addEventListener("click", function () {
         removeBookFromCompleted(bookObject.id);
      });

      action.append(checkButton, trashButton);
      container.append(action);
   }

   return container;
}

document.addEventListener(RENDER_EVENT, function () {
   console.log(books);
   const incompletedBookList = document.getElementById("incompleteBookshelfList");
   incompletedBookList.innerHTML = "";

   const completeBookList = document.getElementById("completeBookshelfList");
   completeBookList.innerHTML = "";

   for (bookItem of books) {
      const bookElement = makeBook(bookItem);

      if (bookItem.isCompleted == false) {
         incompletedBookList.append(bookElement);
      } else {
         completeBookList.append(bookElement);
      }
   }
});

function addBookToCompleted(bookId) {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));

   saveData();
}

function findBook(bookId) {
   for (bookItem of books) {
      if (bookItem.id == bookId) {
         return bookItem;
      }
   }

   return null;
}

function findBookIndex(bookId) {
   for (index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }

   return -1;
}

function removeBookFromCompleted(bookId) {
   const bookTarget = findBookIndex(bookId);

   if (bookTarget === -1) return;

   books.splice(bookTarget, 1);
   document.dispatchEvent(new Event(RENDER_EVENT));

   saveData();
}

function undoBookFromCompleted(bookId) {
   const bookTarget = findBook(bookId);

   if (bookTarget === null) return;

   bookTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));

   saveData();
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
   }
}

function isStorageExist() {
   if (typeof Storage === undefined) {
      alert("Browser Anda tidak mendukung Local Web Storage");
      return false;
   }

   return true;
}

document.addEventListener(SAVED_EVENT, function () {
   console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      for (const book of data) {
         books.push(book);
      }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchBtn = document.getElementById("searchSubmit");
searchBtn.addEventListener("click", function (event) {
   event.preventDefault();

   const searchBook = document.getElementById("searchBookTitle").value;
   const bookItem = document.querySelectorAll(".book_item");

   for (let book of bookItem) {
      const bookTitle = book.innerText;

      if (bookTitle.toLowerCase().includes(searchBook)) {
         book.style.display = "flex";
      } else {
         book.style.display = "none";
      }
   }
});
