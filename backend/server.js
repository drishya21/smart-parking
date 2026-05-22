const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Parking slot data
let slots = [
  { id: "A1", status: "available" },
  { id: "A2", status: "available" },
  { id: "A3", status: "available" },
  { id: "A4", status: "available" },
  { id: "A5", status: "available" },
];

// GET all slots
app.get("/slots", (req, res) => {
  res.json(slots);
});

// BOOK slot
app.post("/book-slot", (req, res) => {
  const { slotId } = req.body;

  slots = slots.map((slot) =>
    slot.id === slotId
      ? { ...slot, status: "booked" }
      : slot
  );

  res.json({
    message: "Slot booked successfully",
    slots,
  });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});