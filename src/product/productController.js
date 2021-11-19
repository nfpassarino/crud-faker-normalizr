const fileContainer = require('../FileContainer');

exports.fetchAllProducts = async () => {
    const productContainer = await fileContainer.initialize('productos.txt');
    return productContainer.getAll();
};

exports.fetchProductById = async (id) => {
    const productContainer = await fileContainer.initialize('productos.txt');
    const obj = productContainer.getById(Number(id));
    return obj;
};

exports.fetchRandomProduct = async () => {
    const objects = await fetchAllProducts();
    return objects[Math.floor(Math.random() * objects.length)];
};

exports.writeNewProduct = async (newProduct) => {
    const productContainer = await fileContainer.initialize('productos.txt');
    const product = await productContainer.save(newProduct);
    return product;
};

exports.updateProduct = async (id, newProduct) => {
    const productContainer = await fileContainer.initialize('productos.txt');
    const product = await productContainer.updateById(Number(id), newProduct);
    return product;
};

exports.deleteProduct = async (id) => {
    const productContainer = await fileContainer.initialize('productos.txt');
    await productContainer.deleteById(Number(id));
    return await fetchAllProducts();
};
