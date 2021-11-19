export const initializeUI = () => {
    const btnAddProduct = document.querySelector('#btnAddProduct');
    const btnSendMessage = document.querySelector('#btnSendMessage');
    btnAddProduct.addEventListener('click', sendNewProduct);
    btnSendMessage.addEventListener('click', sendNewMessage);
}

export const renderProductList = (data) => {
    const productContainer = document.querySelector('#productContainer');
    const template =   `{{#each products}}
                            <tr class="product-list">
                                <td>{{this.title}}</td>
                                <td>{{this.price}}</td>
                                <td><img class="mx-auto imgTable" src="{{this.thumbnail}}" /></td>
                            </tr>
                        {{/each}}`;
    const renderer = Handlebars.compile(template);
    const result = renderer({
        products: data
    });
    productContainer.innerHTML = result;
}

export const renderChat = (data) => {
    const messageContainer = document.querySelector('#messageContainer');
    const template =   `{{#each messages}}
                            <div class="bg-success bg-opacity-25 p-3 message">
                                <p class="userMessage">{{this.user}}</p>
                                <p>{{this.message}}</p>
                            </div>
                            <span class="text-muted messageDate">{{this.timestamp}}</span>
                        {{/each}}`;
    const renderer = Handlebars.compile(template);
    const result = renderer({
        messages: data
    });
    messageContainer.innerHTML = result;
}

const sendNewProduct = () => {
    const socket = io();
    const inputTitle = document.querySelector('#inputTitle');
    const inputPrice = document.querySelector('#inputPrice');
    const inputThumbnail = document.querySelector('#inputThumbnail');
    const successAlert = document.querySelector('#successAlert');
    const productName = document.querySelector('#productName');
    socket.emit('client:newProduct', {
        title: inputTitle.value,
        price: Number(inputPrice.value),
        thumbnail: inputThumbnail.value
    });
    productName.innerText = inputTitle.value;
    successAlert.classList.remove('hide');
    inputTitle.value = '';
    inputPrice.value = '';
    inputThumbnail.value = '';
}

const sendNewMessage = () => {
    const socket = io();
    const inputUser = document.querySelector('#inputUsername');
    const inputMessage = document.querySelector('#inputMessage');
    socket.emit('client:newMessage', {
        user: inputUser.value,
        message: inputMessage.value,
    });
    inputMessage.value = '';
}
