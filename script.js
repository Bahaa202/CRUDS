let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');

let mood = 'create';
let tmp;

// Get total
function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '';
        total.style.background = '#a00d02';
    }
}

// Create product
let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product);
} else {
    dataPro = [];
}

// Save product to localStorage
submit.onclick = function() {
    let newPro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
    }

    if (mood === 'create') {
        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push({...newPro});
            }
        } else {
            dataPro.push(newPro);
        }
    } else {
        dataPro[tmp] = newPro;
        mood = 'create';
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    clearData();
    showData();
}

// Clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    total.style.background = '#a00d02';
    count.value = '';
    category.value = '';
}

// Read products
function showData() {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += createTableRow(i);
    }
    document.getElementById('tbody').innerHTML = table;
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">DELETE ALL</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
}

// Create table row
function createTableRow(i) {
    return `
    <tr>
        <td>${i}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}%</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})" id="update">update</button></td>
        <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
    </tr>`;
}

// Delete product
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData();
}

// Delete all products
function deleteAll() {
    localStorage.clear();
    dataPro.splice(0);
    showData();
}

// Update product
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
}

// Search functionality
let searchMood = 'title';

document.getElementById('searchTitle').onclick = function() {
    searchMood = 'title';
    document.getElementById('search').placeholder = 'Search by Title';
}

document.getElementById('searchCategory').onclick = function() {
    searchMood = 'category';
    document.getElementById('search').placeholder = 'Search by Category';
}

document.getElementById('search').onkeyup = function() {
    searchData(this.value);
}

function searchData(value) {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMood === 'title' && dataPro[i].title.toLowerCase().includes(value.toLowerCase())) {
            table += createTableRow(i);
        } else if (searchMood === 'category' && dataPro[i].category.toLowerCase().includes(value.toLowerCase())) {
            table += createTableRow(i);
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// Display stored data on page load
showData();
