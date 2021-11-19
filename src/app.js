const path = require('path');
const http = require('http');
const handlebars = require('express-handlebars');
const moment = require('moment');
const normalizr = require('normalizr');
const faker = require('faker');
const { Server } = require('socket.io');
const productRoutes = require('./routes/productRoutes');
const productController = require('./product/productController');
const messageController = require('./message/messageController');

const express = require('express');
const { normalize } = require('path');
const app = express();

// initialize server

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server);

// view settings

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
}));
app.set('view engine', '.hbs');

// middlewares

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use('/api/productos', productRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salio mal :(');
});

// normalizer

const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
const schemaMessage = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' });
const schemaMessages = new normalizr.schema.Entity('posts', { mensajes: [schemaMessages] }, { idAttribute: 'id' });
const messageNormalize = msgWithId => normalizr.normalize(msgWithId, schemaMessage);
const getMessagesNormalize = async() => {
    const messages = await messageController.fetchAllMessages();
    return messageNormalize({ id: 'messages', messages });
}

// faker

faker.locale = 'es';


// routes

app.get('/', async (req, res) => {
    res.render('productView');
});

app.get('/api/productos-test', (req, res) => {
    const CANT_PROD = 5
    const products = []
    for (let i = 1; i <= CANT_PROD; i++) {
        const product = {
            id: i,
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: `${faker.image.imageUrl()}?${i}`
        }
        products.push(product);
    }
    res.json(products);
});

// socket

io.on('connection', socket => {
    console.log('New connection: ', socket.id);

    socket.on('client:productList', () => {
        productController.fetchAllProducts()
            .then(products => {
                socket.emit("server:productList", products);
            })
    });

    socket.on('client:newProduct', (newProduct) => {
        productController.writeNewProduct(newProduct)
            .then(productId => {
                console.log('nuevo producto en el server ' + productId);
                io.sockets.emit("server:changeProductList");
            });
    });

    socket.on('client:messages', () => {
        getMessagesNormalize()
            .then(messages => {
                socket.emit("server:messages", messages);
            })
    });

    socket.on('client:newMessage', (newMessage) => {
        messageController.writeNewMessage(newMessage)
            .then(messageId => {
                console.log('nuevo mensaje en el server ' + messageId);
                io.sockets.emit("server:newMessage");
            });
    });

    socket.on('disconnect', () => {
        console.log(socket.id, ' disconnect');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});
