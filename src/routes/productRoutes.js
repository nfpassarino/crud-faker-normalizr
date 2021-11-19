const express = require('express');
const productRoutes = express.Router();
const productController = require('../product/productController');

productRoutes.get('/', (req, res) => {
    productController.fetchAllProducts()
        .then(data => res.json({
            message: 'Lista de productos',
            data: data
        }))
        .catch(e => console.error(e));
});

productRoutes.get('/random', (req, res) => {
    productController.fetchRandomProduct()
        .then(random => res.json({
            message: 'Producto aleatorio',
            data: random
        }))
        .catch(e => console.error(e));
});

productRoutes.get('/:id', (req, res) => {
    const { id } = req.params;
    productController.fetchProductById(id)
        .then(result => {
            result === null
                ? res.json({
                    message: 'Producto no encontrado :(',
                })
                : res.json({
                    message: 'Producto encontrado',
                    data: result
                })
        })
        .catch(e => console.error(e));
});

productRoutes.post('/', (req, res) => {
    const newProduct = req.body;
    productController.writeNewProduct(newProduct)
        .then(id => {
            productController.fetchProductById(id)
                .then(pro => res.json({
                    message: 'Producto guardado',
                    data: pro
                }))
        })
        .catch(e => console.error(e));
});

productRoutes.put('/:id', (req, res) => {
    const { id } = req.params;
    const newProduct = req.body;
    productController.updateProduct(id, newProduct)
        .then(id => {
            productController.fetchProductById(id)
                .then(pro => res.json({
                    message: 'Producto actualizado',
                    data: pro
                }))
        })
        .catch(e => console.error(e));
});

productRoutes.delete('/:id', (req, res) => {
    const { id } = req.params;
    productController.deleteProduct(id)
        .then(all => res.json({
            message: 'Producto eliminado',
            data: all
        }))
        .catch(e => console.error(e));
});

module.exports = productRoutes;
