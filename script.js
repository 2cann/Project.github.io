document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookInput = document.getElementById('bookInput').value;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookInput}`);
        const data = await response.json();
        displayBooks(data.items);
    });
});

function displayBooks(books) {
    const booksList = document.createElement('ul');
    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `${book.volumeInfo.title} - ${book.volumeInfo.authors.join(', ')}`;
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Купить';
        buyButton.addEventListener('click', () => {
            displayPurchaseForm(book);
        });
        listItem.appendChild(buyButton);
        booksList.appendChild(listItem);
    });

    const existingList = document.querySelector('ul');
    if (existingList) {
        existingList.remove();
    }
    document.body.appendChild(booksList);
}

function displayPurchaseForm(book) {
    const purchaseForm = document.createElement('form');
    purchaseForm.innerHTML = `
        <input type="hidden" name="bookTitle" value="${book.volumeInfo.title}">
        <input type="hidden" name="bookAuthor" value="${book.volumeInfo.authors.join(', ')}">
        <label for="name">Имя:</label>
        <input type="text" id="name" name="name">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
        <label for="phone">Телефон:</label>
        <input type="tel" id="phone" name="phone">
        <label for="address">Адрес:</label>
        <input type="text" id="address" name="address">
        <button type="submit">Отправить</button>
    `;
    purchaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(purchaseForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        formDataObject['bookTitle'] = book.volumeInfo.title;
        formDataObject['bookAuthor'] = book.volumeInfo.authors.join(', ');
        await sendFormData(formDataObject);
    });
    const existingForm = document.querySelector('form[name="purchaseForm"]');
    if (existingForm) {
        existingForm.remove();
    }
    document.body.appendChild(purchaseForm);
}

async function sendFormData(formData) {
    try {
        const response = await fetch('http://localhost:3000/submitFormData', { // Используйте адрес вашего сервера
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('Данные успешно отправлены!');
        } else {
            alert('Произошла ошибка при отправке данных.');
        }
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        alert('Произошла ошибка при отправке данных.');
    }
}
