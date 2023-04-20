const express = require('express')
const path = require('path')

require('dotenv').config();

const PORT = process.env.PORT || 5001


const mongoose = require("mongoose");

/*
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { clearInterval } = require("timers");
const io = new Server(server);
*/


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



const connectMongo = async () => mongoose.connect(process.env.MONGO_URI);

connectMongo();




const HistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
});


const BetHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },  
  selectedSide: {
    type: String,
    required: true,
  },
  closePrice: {
    type: Number,
    required: true,
  }, 
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
  prizeAmount: {
    type: Number,
    required: true,
  },
  resultAmount: {
    type: Number,
    required: true,
  },
  prizeFee: {
    type: Number,
    required: false,
  },
  depositBefore: {
    type: Number,
    required: true,
  },
  depositAfter: {
    type: Number,
    required: true,
  },

});


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  pass1: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  pass2: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  deposit: {
    type: Number,
    required: false,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    default: "default some image url",
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  newPassToken: {
    type: String,
    required: false,
    default: "",
  },
  userToken: {
    type: String,
    required: true,
  },
  maticBalance: {
    type: Number,
    required: false,
    default: 0,
  },
  walletAddress: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const GameSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
});



const DepositSchema = new mongoose.Schema({

  hash: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  timeStamp: {
    type: String,
    required: true,
  },

  from: {
    type: String,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  value: {
    type: String,
    required: true,
  },

});



const depositRequestSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletFrom: {
    type: String,
    required: true,
  },
  gonderildi: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "Matic",
  },
});



const paymentRequestSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  email1: {
    type: String,
    unique: false,

    required: true,
  },
  withdrawAmount: {
    type: Number,
    required: true,
  },
  withdrawFee: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Waiting",
  },
  walletTo: {
    type: String,
    required: true,
  },
  gonderildi: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "Matic",
  },
});





const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const History = mongoose.models.History || mongoose.model("History", HistorySchema);
const BetHistory = mongoose.models.BetHistory || mongoose.model("BetHistory", BetHistorySchema);

const Deposit = mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);

const DepositRequest = mongoose.models.DepositRequest || mongoose.model("DepositRequest", depositRequestSchema);

const PaymentRequest = mongoose.models.PaymentRequest || mongoose.model("PaymentRequest", paymentRequestSchema);





function bot() {

  const time = 60;
  const maxBet = 200;
  const minBet = 10;
  const maxBetMiktarı = 100;
  const minBetMiktarı = 10;
  //const horse = ["Chief", "Magic", "Scout", "Rebel", "Lucky"];
  const horse = ["Long", "Short"]

  const betMiktari = Math.floor(Math.random() * (maxBet - minBet + 1) + minBet);

  for (let i = 0; i < betMiktari; i++) {

    const betTime = Math.floor(Math.random() * (time * 1000 - 1000 + 1) + 1000);

    const selectedSide = horse[Math.floor(Math.random() * horse.length)];

    console.log("bot selectedSide", selectedSide);


    setTimeout(

      async () => {

        await Game.create({
          userToken: "bot",
          username: rasteleSembol(8, "aA"),
          img: "enter some image url",
          betAmount: Math.floor(
            Math.random() * (maxBetMiktarı - minBetMiktarı + 1) + minBetMiktarı
          ),
          selectedSide: selectedSide,
        });

      }, betTime

    );


  }

}







const placeBet = async (

  userToken,
  username,
  img,

) => {

  //if (user) {

      /*
      if (betAmount > user?.deposit) {
        //return alert('You dont have enough money to bet this amount');

        setErrMsgSnackbar("You don't have enough money to bet this amount");
        setErr(true);
        return;
      }

      if (betAmount === 0) {
        //return alert('You need to enter a bet amount');

        setErrMsgSnackbar("You need to enter a bet amount");
        setErr(true);
        return;
      }

      if (betAmount < 0) {
        //return alert('You cannot bet a negative amount');

        setErrMsgSnackbar("You cannot bet a negative amount");
        setErr(true);
        return;
      }
      

      ////if (secilenAt === null) return alert('You need to select long or short to bet');

      if (secilenAt === null) {
        setErrMsgSnackbar("You need to select long or short to bet");
        setErr(true);
        return;
      }


      if (betAmount > 50000) {

          //alert("You can't bet more than 50000");
          setErrMsgSnackbar("You can't bet more than 50000");
          setErr(true);

          return;
      }

      /////if (betAmount < 100) {
        if (betAmount < 1) {
          //alert("You can't bet less than 100");
          setErrMsgSnackbar("You can't bet less than 100");
          setErr(true);
          return;
      }
      */






      const maxBet = 2000;
      const minBet = 10;
      const betMiktari = Math.floor(Math.random() * (maxBet - minBet + 1) + minBet);
      
      const betAmount = betMiktari;

      const horse = ["Long", "Short"]

      ////const secilenAt = "Long";

      const selectedSide = horse[Math.floor(Math.random() * horse.length)];


      console.log(process.env.API_KEY);
      console.log(userToken);
    
      const formInputs = {
          method: 'newGame',
          API_KEY: process.env.API_KEY,
          userToken: userToken,
          img: img,
          username: username,
          betAmount: betAmount,
          selectedSide: selectedSide
      }
      const res = await fetch('https://craclegamez.io/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs)
      });

      const data = await res.json();

      console.log(data);


      if (data.message === 'Success') {
          //alert('You have successfully placed your bet');

          ////console.log('You have successfully placed your bet');

          //console.log("currentPrice", currentPrice);

          ////setBasePrice(currentPrice);

          //setLongShort(secilenAt);
          //setMyBetAmount(betAmount);


          ///////socket.emit("baseprice", currentPrice);

          //socket.emit("start", user?.username);



//client.js
/*
var io = require('socket.io-client');
var socket = io.connect('https://vienna.herokuapp.com', {reconnect: true});
*/


/*
const socketIo = io(`${SocketEnum.id}`, {
  transports: ["websocket"],
});

const socket = io.connect("http://127.0.0.1:30001", {path: "/socket.io", transports: ['websocket']});
*/


/*
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');

    ////socket.emit('user', username);
});

socket.on('status', function (data) {
  console.log(socket.id + " GameT2E status", data);

  //setStatus(data);


  //setStatus(true);
});

socket.emit('user', username);

socket.emit('start', username);

*/



      } else {

        

          //alert('You have already placed a bet');
          //setErrMsgSnackbar("You have already placed a bet");
          //setErr(true);

      }
      


  //} else {

      ///alert('You need to login to place a bet');
  //    setErrMsgSnackbar("You need to login to place a bet");
  //    setErr(true);
  //}


}



////let userToken = "bot";



const login = async (

  email,
  pass

) => {


  const formInputs = {
      API_KEY: process.env.API_KEY,
      method: "login",
      email: email,
      pass: pass,
  };
  fetch("https://craclegamez.io/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formInputs),
  })
      .then((res) => res.json())
      .then((data) => {

          if (!data.user) {
              console.log(data.message);
              ///handleClickErr()
          } else {
              ///handleClickSucc();
              ///setCookie("user", data.user.user.userToken);
              ///setCookie("username", data.user.user.username);
              ///router.push("/");
              console.log("userToken: " + data.user.user.userToken);

              const userToken = data.user.user.userToken;
              const username = data.user.user.username;
              const img = data.user.user.img;

              placeBet(userToken, username, img);



          }
          
      });
};



/*

setTimeout(() => {
    

  login(
    "creath.park@gmail.com",
    "genever77"
  );

}, 6000);
*/




setInterval(david, 105000);

function david( ) {

  login(
    "david@gmail.com",
    "genever77"
  );

}


setInterval(michael, 142123);

function michael() {
  login(
    "michael@gmail.com",
    "genever77"
  );
}


setInterval(robert, 229332);

function robert() {
  login(
    "robert@gmail.com",
    "genever77"
  );
}


setInterval(james, 145431);

function james() {
  login(
    "james@gmail.com",
    "genever77"
  );
}


setInterval(margaret, 196755);

function margaret() {
  login(
    "margaret@gmail.com",
    "genever77"
  );
}

setInterval(cordelia, 133833);

function cordelia() {
  login(
    "cordelia@gmail.com",
    "genever77"
  );
}

setInterval(naomi, 288119);

function naomi() {
  login(
    "naomi@gmail.com",
    "genever77"
  );
}

setInterval(stella, 299230);

function stella() {
  login(
    "stella@gmail.com",
    "genever77"
  );
}


setInterval(aileen, 112053);

function aileen() {
  login(
    "aileen@gmail.com",
    "genever77"
  );
}


setInterval(bentus, 191023);

function bentus() {
  login(
    "bentus@gmail.com",
    "genever77"
  );
}


setInterval(gratia, 301204);

function gratia() {
  login(
    "gratia@gmail.com",
    "genever77"
  );
}


setInterval(caelum, 291204);

function caelum() {
  login(
    "caelum@gmail.com",
    "genever77"
  );
}

setInterval(puella, 127433);

function puella() {
  login(
    "puella@gmail.com",
    "genever77"
  );
}

setInterval(angelus, 1111342);

function angelus() {
  login(
    "angelus@gmail.com",
    "genever77"
  );
}


setInterval(alceste, 244342);

function alceste() {
  login(
    "alceste@gmail.com",
    "genever77"
  );
}


setInterval(lunaris, 194023);

function lunaris() {
  login(
    "lunaris@gmail.com",
    "genever77"
  );
}


setInterval(phantasia, 123083);

function phantasia() {
  login(
    "phantasia@gmail.com",
    "genever77"
  );
}


setInterval(lumen, 222083);

function lumen() {
  login(
    "lumen@gmail.com",
    "genever77"
  );
}









/*

// 2초 간격으로 메시지를 보여줌
let timerId9 = setInterval(() => {
  
  login(
    "robert@gmail.com",
    "genever77"
  );

}, 82420);
*/



/*

// 2초 간격으로 메시지를 보여줌
let timerId10 = setInterval(() => {
  
  login(
    "james@gmail.com",
    "genever77"
  );

}, 96150);
*/

// 5초 후에 정지
///setTimeout(() => { clearInterval(timerId); alert('정지'); }, 5000);





/*
const time = 60;
const maxBet = 2000;
const minBet = 10;
const maxBetMiktarı = 100;
const minBetMiktarı = 10;
//const horse = ["Chief", "Magic", "Scout", "Rebel", "Lucky"];
const horse = ["Long", "Short"]

const betMiktari = Math.floor(Math.random() * (maxBet - minBet + 1) + minBet);

for (let i = 0; i < betMiktari; i++) {

  const betTime = Math.floor(Math.random() * (time * 1000 - 1000 + 1) + 1000);

  const selectedSide = horse[Math.floor(Math.random() * horse.length)];

  console.log("bot selectedSide", selectedSide);


  setTimeout(

    async () => {

      await Game.create({
        userToken: "bot",
        username: rasteleSembol(8, "aA"),
        img: "enter some image url",
        betAmount: Math.floor(
          Math.random() * (maxBetMiktarı - minBetMiktarı + 1) + minBetMiktarı
        ),
        selectedSide: selectedSide,
      });

    }, betTime

  );


}
*/


var currentPrice = 10000;

/////setInterval(myMethod, 1000);

function myMethod( ) {


  ///console.log("check Game currentPrice========", currentPrice);


  if (currentPrice) {
 

    (async () => {

      const paymentRequest = await PaymentRequest.find({status: 'Waiting'}).sort({ _id: 1 });


      for (var i = 0; i < paymentRequest.length; i++) {

        var request = paymentRequest[i];

        console.log("request", request);

        var userToken = request.userToken;

  
      }

    })();


  }


}



/*
withdraw wallet for winner
0x6827a9fa9059a77851A1A98c17f723F9E69B2d81
*/
