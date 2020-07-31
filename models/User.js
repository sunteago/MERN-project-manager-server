const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
//ver que campos requiere app y que tipos de datos acepto, en mongo estan los tipos de datos
const UsersSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    register: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', UsersSchema);