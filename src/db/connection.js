const mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/jewellery",{

}).then(() => {
    console.log("MongoDB connected...");
})
  .catch((err) => {
    console.error(err);
  });