var cartArray = [];
var cardArray = [];
var editingCar;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function checkIfAdminAndGivePermission(token) {
    var decoded = parseJwt(token);
    if (decoded.type == "ADMIN") {
        document.getElementById("addCarButton").style.visibility = "visible";
        var bttns = document.getElementsByClassName("adminBttns");
        for (var i = 0; i < bttns.length; i++) {
            bttns[i].style.visibility = "visible";
        }
    }
}

async function displayHome() {
    var token = '';
    try {
        token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3333/car', { headers: { Authorization: "Bearer " + token } });
        cardArray = response.data;
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }

    var maxCol = 5;
    var rowCount = 0;
    var cardCount = 0;

    cardArray.forEach(function (product) {
        var card = `<div class="card" style="width: 250px; height: 300px">
        <img style="width: 200px; height: 100px" src = ${product.imageUrl}
        alt = "Avatar">
        <div class="container">
            <h4>${product.model}</h4> 
            <p><b>${product.name} €${product.price}</b></p>
            <p>${product.description}</p> 
            <button onclick="addToCart(${product.id})" id="${'Card' + product.id}">Buy</button> 
            <div class="adminBttns" style="visibility: hidden;">
                <button style="background-color:green;" onclick="openEditForm(${product.id})" id="${'Card' + product.id}">Update</button> 
                <button style="background-color:red;"  onclick="deleteCar(${product.id})" id="${'Card' + product.id}">Delete</button> 
            </div>
        </div>
        </div>`;

        if (cardCount % maxCol == 0) {
            var board = document.getElementById("board");
            board.innerHTML += `<div id="${rowCount}"></div>`;
            rowCount++;
        }

        var row = document.getElementById(rowCount - 1);
        row.innerHTML += card;
        cardCount++;
    });

    checkIfAdminAndGivePermission(token);
}


function addAllElement() {
    var maxCol = 5;
    var rowCount = 0;
    var cardCount = 0;

    document.getElementById("board").innerHTML = null;

    var _cardArray = JSON.parse(localStorage.getItem("cardArray"));

    _cardArray.forEach(function (product) {
        var card = `<div class="card" style="width: 250px; height: 300px">
        <img style="width: 200px; height: 100px" src = ${product.imageUrl}
        alt = "Avatar">
        <div class="container">
            <h4>${product.model}</h4> 
            <p><b>${product.name} €${product.price}</b></p>
            <p>${product.description}</p> 
            <button onclick="addToCart(${product.id})" id="${'Card' + product.id}">Buy</button> 
            <div class="adminBttns" style="visibility: hidden;">
                <button style="background-color:green;" onclick="openEditForm(${product.id})" id="${'Card' + product.id}">Update</button> 
                <button style="background-color:red;"  onclick="deleteCar(${product.id})" id="${'Card' + product.id}">Delete</button> 
            </div>
        </div>
        </div>`;

        if (cardCount % maxCol == 0) {
            var board = document.getElementById("board");
            board.innerHTML += `<div id="${rowCount}"></div>`;
            rowCount++;
        }

        var row = document.getElementById(rowCount - 1);
        row.innerHTML += card;
        cardCount++;
    });

    checkIfAdminAndGivePermission(token);
}

async function cartDisplay() {
    var maxCol = 5;
    var rowCount = 0;
    var cardCount = 0;
    var totalPrice = 0;

    try {
        token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3333/cart', { headers: { Authorization: "Bearer " + token } });
        cartArray = response.data.map(function (cart) {
            return cart.car;
        });
    } catch (error) {
        console.log(error);
    }

    cartArray.forEach(function (product) {
        var card = `<div class="card" style="width: 250px; height: 300px">
        <img style="width: 200px; height: 100px" src = ${product.imageUrl}
        alt = "Avatar">
        <div class="container">
            <h4>${product.model}</h4> 
            <p><b>${product.name} €${product.price}</b></p>
            <p>${product.description}</p> 
        </div>
        </div>`;

        if (cardCount % maxCol == 0) {
            var board = document.getElementById("cart_board");
            board.innerHTML += `<div id="${rowCount}"></div>`;
            rowCount++;
        }

        var row = document.getElementById(rowCount - 1);
        row.innerHTML += card;
        cardCount++;
        totalPrice += +product.price;
    });

    document.getElementById("total").innerHTML = "Total: € " + totalPrice;
    console.log(totalPrice);
}


async function buy() {
    cartArray = [];
    localStorage.setItem("cartArray", JSON.stringify(cartArray));
    var address = prompt("Thank you for your purchase! \nYour order will be delivered to: ");
    var payment = prompt("1 - Wire Transfer: \n2 - Credit \nCard Select payment method:");
    confirm("Your order will be delivered to: " + address + "\nYour payment method: " + (payment == "1" ? "Wire Transfer" : "Credit"));
    await axios.delete("http://localhost:3333/cart",
        { headers: { Authorization: "Bearer " + token } });
    location.reload();
    cartDisplay();
}

async function deleteCar(carId) {
    token = localStorage.getItem("token");
    try {
        await axios.delete("http://localhost:3333/car/" + carId,
            { headers: { Authorization: "Bearer " + token } });

        const response = await axios.get('http://localhost:3333/car', { headers: { Authorization: "Bearer " + token } });
        cardArray = response.data;
    } catch (error) {
        console.log(error);
    }
    localStorage.setItem("cardArray", JSON.stringify(cardArray));
    addAllElement();
}


function openAddForm() {
    document.getElementById("myForm").style.display = "block";
}

function openEditForm(carId) {
    editingCar = cardArray.filter(car => car.id == carId)[0];
    console.log(editingCar);

    document.getElementsByName("name2")[0].value = editingCar.name;
    document.getElementsByName("price2")[0].value = editingCar.price;
    document.getElementsByName("image2")[0].value = editingCar.imageUrl;
    document.getElementsByName("description2")[0].value = editingCar.description;
    document.getElementsByName("category2")[0].value = editingCar.category;
    document.getElementsByName("model2")[0].value = editingCar.model;
    document.getElementById("myForm2").style.display = "block";
}

function closeForm() {
    console.log("test");
    document.getElementById("myForm").style.display = "none";
    document.getElementById("myForm2").style.display = "none";
}

async function search() {
    const key = document.getElementsByName("search")[0].value;
    console.log(key);
    if (key == "") {
        displayHome();
    }
    token = localStorage.getItem("token");
    try {
        token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3333/car/" + key,
            { headers: { Authorization: "Bearer " + token } });

        cardArray = response.data;
    } catch (error) {
        console.log(error);
    }
    localStorage.setItem("cardArray", JSON.stringify(cardArray));
    addAllElement();
}

async function checkAndClose() {
    const name = document.getElementsByName("name")[0].value;
    const price = document.getElementsByName("price")[0].value;
    const image = document.getElementsByName("image")[0].value;
    const description = document.getElementsByName("description")[0].value;
    const category = document.getElementsByName("category")[0].value;
    const model = document.getElementsByName("model")[0].value;

    var car = {
        name: name,
        price: price,
        imageUrl: image,
        description: description,
        category: category,
        model: model
    };

    console.log(car);

    try {
        token = localStorage.getItem("token");
        await axios.post('http://localhost:3333/car',
            {
                name: name,
                price: parseInt(price),
                imageUrl: image,
                description: description,
                category: category,
                model: model
            },
            { headers: { Authorization: "Bearer " + token } });

        const response = await axios.get('http://localhost:3333/car', { headers: { Authorization: "Bearer " + token } });
        cardArray = response.data;
    } catch (error) {
        console.log(error);
    }

    localStorage.setItem("cardArray", JSON.stringify(cardArray));
    addAllElement();
    document.getElementById("myForm").style.display = "none";
};

async function editAndClose() {
    const name = document.getElementsByName("name2")[0].value;
    const price = document.getElementsByName("price2")[0].value;
    const image = document.getElementsByName("image2")[0].value;
    const description = document.getElementsByName("description2")[0].value;
    const category = document.getElementsByName("category2")[0].value;
    const model = document.getElementsByName("model2")[0].value;

    try {
        token = localStorage.getItem("token");
        await axios.patch('http://localhost:3333/car/' + editingCar.id,
            {
                name: name,
                price: parseInt(price),
                imageUrl: image,
                description: description,
                category: category,
                model: model
            },
            { headers: { Authorization: "Bearer " + token } });

        const response = await axios.get('http://localhost:3333/car', { headers: { Authorization: "Bearer " + token } });
        cardArray = response.data;
    } catch (error) {
        console.log(error);
    }

    localStorage.setItem("cardArray", JSON.stringify(cardArray));
    addAllElement();
    document.getElementById("myForm2").style.display = "none";
}

async function addToCart(productId) {

    try {
        token = localStorage.getItem("token");
        const response = await axios.post('http://localhost:3333/cart', {
            carId: productId
        }, { headers: { Authorization: "Bearer " + token } });
        cardArray = response.data;
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}
