const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;
    const finishRead = document.getElementById('finishRead').checked;

    const generatedID = generateId(); 
    const bookObject = generateBookObject(generatedID, inputTitle, inputAuthor, inputYear, finishRead, false);
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
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    console.log(books);
});

function makebookItems(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText =  "Penulis Buku :" + " " + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun Terbit :" + " " + bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(textContainer);

    if (bookObject.isCompleted) {
        const buttonUnread = document.createElement('button');
        const textUnread = document.createTextNode('Belum Selesai Dibaca');
        buttonUnread.classList.add('button_green');
        buttonUnread.appendChild(textUnread);
        buttonUnread.setAttribute('id', `book-${bookObject.id}`);

        buttonUnread.addEventListener('click', function() {
            unreadBookFromCompleted(bookObject.id);
        });

        const buttonDelete = document.createElement('button');
        const textDelete = document.createTextNode('Hapus Buku');
        buttonDelete.classList.add('button_delete');
        buttonDelete.appendChild(textDelete);
        buttonDelete.setAttribute('id', `book-${bookObject.id}`);
        
        buttonDelete.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        });


        action.append(buttonUnread, buttonDelete);

    } else {
        const buttonReaded = document.createElement('button');
        const textReaded = document.createTextNode('Selesai Dibaca');
        buttonReaded.classList.add('button_green');
        buttonReaded.appendChild(textReaded);
        buttonReaded.setAttribute('id', `book-${bookObject.id}`);

        buttonReaded.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        });

        const buttonDelete = document.createElement('button');
        const textDelete = document.createTextNode('Hapus Buku');
        buttonDelete.classList.add('button_delete');
        buttonDelete.appendChild(textDelete);
        buttonDelete.setAttribute('id', `book-${bookObject.id}`);

        buttonDelete.addEventListener('click', function() {
            removeBookFromCompleted(bookObject.id);
        });

        action.append(buttonReaded, buttonDelete);
        
    }

    return action;

}

document.addEventListener(RENDER_EVENT, function() {

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completedbookItems = document.getElementById('completeBookshelfList');
    completedbookItems.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makebookItems(bookItem);

        if(!bookItem.isCompleted) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completedbookItems.append(bookElement);
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
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function unreadBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved_book';
const STORAGE_KEY = 'BOOKS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser Kamu Tidak Mendukung Localstorage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
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

const result = books.filter((book) => {
    const inputBookTitle = book.title.toLowerCase();
    const searchKeyword = searchTitle.toLowerCase();

    return inputBookTitle.includes(searchKeyword);
});




