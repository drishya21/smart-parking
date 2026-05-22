import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hours, setHours] = useState(1);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);

  const pricePerHour = 50;

  // FETCH SLOT DATA
  const fetchSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/slots"
      );

      setSlots(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // REAL TIME UPDATE
  useEffect(() => {
    fetchSlots();

    const interval = setInterval(() => {
      fetchSlots();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // SLOT SELECT
  const handleSelect = (slot) => {
    if (slot.status === "booked") {
      alert("Slot already booked!");
      return;
    }

    setSelectedSlot(slot.id);
  };

  const totalAmount = hours * pricePerHour;

  // PAYMENT
  const handlePayment = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/book-slot",
        {
          slotId: selectedSlot,
        }
      );

      fetchSlots();

      const newBooking = {
        slot: selectedSlot,
        hours,
        amount: totalAmount,
        date: new Date().toLocaleString(),
      };

      setBookingHistory([
        ...bookingHistory,
        newBooking,
      ]);

      setBookingDone(true);

      alert("Payment Successful ✅");

    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // QR DATA
  const qrData = `
    Smart Parking Booking
    Slot: ${selectedSlot}
    Hours: ${hours}
    Amount: ₹${totalAmount}
  `;

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🚗 Smart Parking System</h1>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      {/* SLOT SECTION */}
      <h2 style={styles.sectionTitle}>
        Available Parking Slots
      </h2>

      <div style={styles.grid}>
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => handleSelect(slot)}
            style={{
              ...styles.slot,

              backgroundColor:
                slot.status === "available"
                  ? "#16a34a"
                  : "#dc2626",

              border:
                selectedSlot === slot.id
                  ? "4px solid yellow"
                  : "none",
            }}
          >
            <h3>{slot.id}</h3>
            <p>{slot.status}</p>
          </div>
        ))}
      </div>

      {/* PAYMENT BOX */}
      <div style={styles.paymentBox}>
        <h2>Booking Details</h2>

        <p>
          <strong>Selected Slot:</strong>{" "}
          {selectedSlot || "None"}
        </p>

        <label>Select Hours</label>

        <select
          value={hours}
          onChange={(e) =>
            setHours(Number(e.target.value))
          }
          style={styles.select}
        >
          <option value={1}>1 Hour</option>
          <option value={2}>2 Hours</option>
          <option value={3}>3 Hours</option>
          <option value={4}>4 Hours</option>
        </select>

        <h2 style={{ marginTop: "20px" }}>
          Total: ₹{totalAmount}
        </h2>

        <button
          onClick={handlePayment}
          style={styles.payBtn}
        >
          Pay Now
        </button>

        {/* QR */}
        {bookingDone && (
          <div style={styles.qrBox}>
            <h3>Booking Confirmed ✅</h3>

            <QRCodeCanvas
              value={qrData}
              size={180}
            />

            <p>
              Show this QR at parking entry
            </p>
          </div>
        )}
      </div>

      {/* BOOKING HISTORY */}
      <div style={styles.historyBox}>
        <h2>Booking History 📜</h2>

        {bookingHistory.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookingHistory.map(
            (booking, index) => (
              <div
                key={index}
                style={styles.historyCard}
              >
                <p>
                  <strong>Slot:</strong>{" "}
                  {booking.slot}
                </p>

                <p>
                  <strong>Hours:</strong>{" "}
                  {booking.hours}
                </p>

                <p>
                  <strong>Amount:</strong> ₹
                  {booking.amount}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.date}
                </p>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(to right, #e0eafc, #cfdef3)",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "15px",
  },

  slot: {
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.2)",
  },

  paymentBox: {
    backgroundColor: "white",
    marginTop: "40px",
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "400px",
    marginInline: "auto",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  select: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  payBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  qrBox: {
    marginTop: "25px",
  },

  historyBox: {
    marginTop: "50px",
    textAlign: "center",
  },

  historyCard: {
    backgroundColor: "white",
    maxWidth: "350px",
    margin: "15px auto",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "left",
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.15)",
  },

  logout: {
    padding: "12px 20px",
    backgroundColor: "#111827",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};