const mongoose = require("mongoose");

const URL_MONGO =
  "mongodb+srv://admin:VZUQAaTr9wBgU5Jx@devfcintaroja-lmcx2.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(URL_MONGO, {useNewUrlParser: true}, err => {
  !err
    ? console.log("Succesful mongoDB connection")
    : console.log(`Connection error
    ${err}`);
});

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: String,
    username: String,
    userPwd: String,
    firstName: String,
    surName: String,
    address: String,
    productBought: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          default: "",
          ref: "product"
        }
      ]
    },
    pets: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          default: "",
          ref: "pet"
        }
      ]
    },
    isVet: {type: Boolean, default: false},
    activeUser: {type: Boolean, default: true}
  },

  {timestamps: true}
);

const petSchema = new Schema(
  {
    name: String,
    age: Number,
    race: String,
    illnes: {Type: String, default: ""},
    treatment: {Type: String, default: ""}
  },
  {timestamps: true}
);

const dateSchema = new Schema(
  {
    userDate: {
      type: String
    },
    madeBy: {
      type: mongoose.Types.ObjectId,
      ref: "user"
    },
    patientPet: [
      {
        type: mongoose.Types.ObjectId,
        ref: "pet"
      }
    ],
    attendingVet: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "user",
          default: ""
        }
      ]
    },
    resolved: {
      type: Boolean,
      default: false
    }
  },
  {timestamps: true}
);

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      minlength: 3
    },
    productDesc: {
      type: String,
      minlength: 5
    },
    productPrice: {
      type: Number,
      required: true,
      min: 5,
      default: 5
    }
  },
  {timestamps: true}
);

productSchema.index(
  {
    productName: "text",
    productDesc: "text"
  },
  {
    weights: {
      productName: 5,
      productDesc: 1
    }
  }
);

const purchaseSchema = new Schema(
  {
    madeBy: {
      type: mongoose.Types.ObjectId,
      ref: "user"
    },
    productBought: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          default: "",
          quantity: mongoose.Schema.Types.Number,
          ref: "product"
        }
      ]
    }
  },
  {timestamps: true}
);

// const vetSchema = new Schema(
//   {
//     vetUserName: String,
//     vetUserPwd: String,
//     vetEmail: String,
//     firstName: String,
//     surName: String,
//     address: String,
//     vet: {
//       type: Boolean,
//       default: true
//     }
//   },
//   {timestamps: true}
// );

const user = mongoose.model("user", userSchema);
const pet = mongoose.model("pet", petSchema);
const product = mongoose.model("product", productSchema);
const purchase = mongoose.model("purchase", purchaseSchema);
// const vet = mongoose.model("vet", vetSchema);
const date = mongoose.model("date", dateSchema);

module.exports = {
  user,
  pet,
  // vet,
  date,
  product,
  purchase
};
