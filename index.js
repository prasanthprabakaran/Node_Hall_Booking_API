import express from "express";
import cors from "cors";
const app = express();

app.use(cors());

app.use(express.json());

let rooms = [
  {
    room_name: "Ruby",
    room_id: 1,
    seats: 100,
    amenities: ["wifi", "AC", "Smart TV"],
    price_per_hour: 1999,
  },
  {
    room_name: "Sapphire",
    room_id: 2,
    seats: 125,
    amenities: ["wifi", "AC", "Smart TV"],
    price_per_hour: 1599,
  },
];

let bookingDetails = [
  {
    customerName: "John",
    room_name: "Ruby",
    booked_room_id: 1,
    date: new Date("2022-09-15"),
    start_time: "16:00",
    end_time: "18:00",
    status: "booked",
  },
  {
    customerName: "Nolan",
    room_name: "Sapphire",
    booked_room_id: 2,
    date: new Date("2022-09-16"),
    start_time: "16:00",
    end_time: "18:00",
    status: "booked",
  },
];

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to hall booking webpage",
    To_create_a_room: "/room/create",
    To_book_a_room: "/room/book",
    booked_rooms: "/room/booked-details",
    booked_customer: "/room/customer-details",
  });
});

app.post('/room/create', (req, res) => {
    let id = rooms.length + 1;
    req.body.room_id = id;
    rooms.push({
      room_name: req.body.room_name,
      room_id: req.body.room_id,
      seats: req.body.seats,
      amenities: req.body.amenities,
      price_per_hour: req.body.price_per_hour,
    });
    res.status(201).json(`The id ${id} with room is created successfully`);
  });

  app.post('/room/book', (req, res) => {
    let id = bookingDetails.length + 1;
    req.body.booked_room_id = id;
    try {
      req.body.date = new Date(req.body.date);
      let booking_detail = {
        customerName: req.body.customerName,
        booked_room_id: req.body.booked_room_id,
        room_name: req.body.room_name,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        status: 'booked',
      };
      let result = undefined;
      for (const book of bookingDetails) {
        if (
          book.date.getTime() == req.body.date.getTime() &&
          book.start_time === req.body.start_time
        ) {
          console.log(book.date.getTime(), req.body.date.getTime());
          result = 0;
          console.log('in booking');
          return res
            .status(400)
            .send({ error: 'The room is not available with this time slot' });
        } else {
          result = 1;
          bookingDetails.push(booking_detail);
          return res
            .status(201)
            .send(
              `Room is successfully booked with the id ${req.body.booked_room_id}`
            );
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send('internal error');
    }
  });


app.get('/room/booked-details', (req, res) => {
    let roomArray = [];
  
    bookingDetails.forEach((customer) => {
      let roomBook = {};
  
      roomBook.room_name = customer.room_name;
      roomBook.status = customer.status;
      roomBook.customerName = customer.customerName;
      roomBook.date = customer.date;
      roomBook.start_time = customer.start_time;
      roomBook.end_time = customer.end_time;
      roomArray.push(roomBook);
    });
  
    res.status(200).send(roomArray);
  });
  

  
  app.get('/room/customer-details', (req, res) => {
    let customerArray = [];
  
    bookingDetails.forEach((customer) => {
      let customerRoom= {};
   customerRoom.customerName = customer.customerName;
   customerRoom.room_name = customer.room_name;
   customerRoom.date = customer.date;
   customerRoom.start_time = customer.start_time;
   customerRoom.end_time = customer.end_time;
      customerArray.push(customerRoom);
    });
  
    res.status(200).send(customerArray);
  });

app.listen(process.env.PORT || 3002);