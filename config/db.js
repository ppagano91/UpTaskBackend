import mongoose from "mongoose";
const connectarDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI, {
    //     // const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL, {
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true,
    //     useCreateIndex: true
    // });
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectarDB;
