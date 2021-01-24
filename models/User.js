const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    email: { type: String, required: true, uniq: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    cart: [{ type: Types.ObjectId, ref: 'Carts' }]
})


module.exports = model('User', schema)