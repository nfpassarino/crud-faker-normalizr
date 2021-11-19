const fileContainer = require('../FileContainer');

exports.fetchAllMessages = async () => {
    const messageContainer = await fileContainer.initialize('messages.txt');
    return messageContainer.getAll();
};

exports.writeNewMessage = async (newMessage) => {
    const messageContainer = await fileContainer.initialize('messages.txt');
    const message = await messageContainer.save(newMessage);
    return message;
};
