// esquema prod y un esquema ticket
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); //CON ESTO NUESTRA API PUEDE SERVIR A OTROS LADOS
const {/*vet,*/ pet, user, date} = require("./vetSchemas");

const PORT = process.env.PORT || 2000; //DECLARAMOS EL PUERTO QUE SE ESTARÁ USANDO PARA EL LOCALHOST

const app = express();

app.use(cors()); //INICIALIZAMOS CORS
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hola!</h1>");
});

//User post, get...
// Create a new user
app.post("/create/user/", (req, res) => {
  const {
    userEmail,
    username,
    userPwd,
    firstName,
    surName,
    address,
    isVet,
    activeUser
  } = req.body;

  const newUser = user({
    userEmail,
    username,
    userPwd,
    firstName,
    surName,
    address,
    isVet,
    activeUser
  });

  newUser.save((err, user) => {
    !err ? res.status(201).send(user) : res.status(400).send(err);
  });
});

//Get all users
app.get("/all/user/", (req, res) => {
  user
    .find()
    .populate("pets")
    .exec()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(409).send(err));
});

// Get user by email
app.get("/user/:userEmail/", (req, res) => {
  const {userEmail} = req.body;

  user
    .findOne(userEmail)
    .populate("pets")
    .exec()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(209).send(err));
});

// //Vets
// //Create vets
// app.post("/create/vet/", (req, res) => {
//   const {vetUserName, vetUserPwd, firstName, surName, address} = req.body;

//   const newVet = vet({
//     vetUserName,
//     vetUserPwd,
//     firstName,
//     surName,
//     address
//   });

//   newVet.save((err, body) => {
//     !err ? res.status(200).send(body) : res.status(400).send(err);
//   });
// });

// //Get all vets
// app.get("/all/vet/", (req, res) => {
//   vet
//     .find()
//     .exec()
//     .then(result => res.status(200).send(result))
//     .catch(err => res.status(409).send(err));
// });

// //Get vet by email
// app.get("/vet/:vetEmail/", (req, res) => {
//   const {vetEmail} = req.params;

//   vet
//     .findOne(vetEmail)
//     .populate("pet")
//     .exec()
//     .then(result => res.status(200).send(result))
//     .catch(err => res.status(409).send(err));
// });

//Pets
//create Pet
app.post("/create/pet/", (req, res) => {
  const {userEmail, name, age, race, illnes, treatment} = req.body;

  const newPet = pet({
    name,
    age,
    race,
    illnes,
    treatment
  });

  newPet.save((err, result) => {
    if (!err) {
      user.findOneAndUpdate(
        {userEmail},
        {$push: {pets: result._id}},
        {new: true},
        (err, user) => {
          if (!err) {
            res.status(200).send(`Todo good ${user}`);
          } else {
            res.status(409).send(`Error! ${err}`);
          }
        }
      );
    } else {
      res.status(409).send(`Error! ${err}`);
    }
  });
});

//Get all pets
app.get("/all/pet/", (req, res) => {
  pet
    .find()
    .exec()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(409).send(err));
});

//Get pet by id
app.get("/pet/:id/", (req, res) => {
  const {id} = req.params;

  pet
    .findById(id)
    .populate("user")
    .exec()
    .then(result => console.log(`Exito! ${result}`))
    .catch(err => console.log(err));
});

//Dates
//Assign a date to a vet
// const assignVet = () => {
//   return new Promise((resolve, reject) => {
//     app.get("/all/vet/", (err, response, body) => {
//       if (response.statusCode == 200) {
//         const content = JSON.parse(body);
//         // const vetIdArr = content.
//         // const randomId =
//       } else {
//         console.log(`Error! ${err}`);
//         reject(`Error! ${response.statusCode}`);
//       }
//     });
//   });
// };

//Create a new date
app.post("/create/date/", (req, res) => {
  // app.get("/all/date/", (request, result) => {

  // })

  let {userDate, madeBy, patientPet} = req.body;

  user
    .findById(madeBy)
    .exec()
    .then(result => {
      console.log(`Exito! ${result._id}`);
      madeBy = result._id;
    })
    .catch(err => {
      console.log(`Error1: ${err}`);
      res.status(201).send(`Error: No existe ese usuario ${err}`);
    });

  pet
    .findById(patientPet)
    .exec()
    .then(result => {
      console.log(`Exito! ${result._id}`);
      patientPet = result._id;
    })
    .catch(err => {
      console.log(`Error2: ${err}`);
      res.status(201).send(`Error: No existe esa mascota ${err}`);
    });

  const newDate = date({
    userDate,
    madeBy,
    patientPet
  });

  newDate.save((err, result) => {
    !err
      ? res.status(201).send(`Exito! ${result}`)
      : res.status(409).send(`Error! ${err}`);
  });
});

app.get("/all/date/", (req, res) => {
  date
    .find()
    .populate("madeBy")
    .populate("patientPet")
    .exec()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(409).send(err));
});

app.listen(PORT, () => {
  console.log(`Server iniciado en: ${PORT}`);
});
