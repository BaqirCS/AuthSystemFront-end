const mongoose = require('mongoose');
const connectDb = async (url) => {
  await mongoose.connect(url, () =>
    console.log('app is connected to database')
  );
};
module.exports = connectDb;
