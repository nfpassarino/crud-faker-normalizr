import { initializeUI, renderProductList, renderChat } from './ui.js';

const socket = io();
const getProductList = () => socket.emit('client:productList');
const getMessages = () => socket.emit('client:messages');

const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
const schemaMessage = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' });
const schemaMessages = new normalizr.schema.Entity('posts', { mensajes: [schemaMessages] }, { idAttribute: 'id' });

initializeUI();

socket.emit('client:productList');
socket.emit('client:messages');
socket.on('server:changeProductList', getProductList);
socket.on('server:newMessage', getMessages);

socket.on('server:productList', data => {
    renderProductList(data);
});

socket.on('server:messages', data => {
    const messages = normalizr.denormalize(data.result, schemaMessages, data.entities);
    renderChat(messages.messages);
});

