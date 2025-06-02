const mongoose = require ('mongoose');
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://deepikam1508:narutoAot15@cluster1.koxsf.mongodb.net/devTinder"
    );
};
module.exports = connectDB;