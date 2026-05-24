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

  const pricePerHour = 50;

  // TOKEN
  const getHeaders = () => {
    const token = localStorage.getItem("access");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // FETCH SLOTS
  const fetchSlots = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/slots/",
        getHeaders()
      );

      setSlots(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // SELECT SLOT
  const handleSelect = (slot) => {
    if (slot.is_occupied) {
      alert("Slot already booked");
      return;
    }

    setSelectedSlot(slot.slot_number);
  };

  // PAYMENT
  const handlePayment = async () => {
    if (!selectedSlot) {
      alert("Select a slot");
      return;
    }

    const totalAmount = hours * pricePerHour;

    try {
      // CREATE RAZORPAY ORDER
      const orderRes = await axios.post(
        "http://127.0.0.1:8000/api/create-order/",
        {
          amount: totalAmount,
        },
        getHeaders()
      );

      const order = orderRes.data;

      const options = {
        key: "rzp_test_SsGr4sHvnfHvAn",

        amount: order.amount,

        currency: order.currency,

        name: "Smart Parking",

        description: "Parking Booking Payment",

        order_id: order.id,

        handler: async function () {
          // BOOK SLOT AFTER PAYMENT SUCCESS

          await axios.post(
            "http://127.0.0.1:8000/api/book-slot/",
            {
              slot_number: selectedSlot,
            },
            getHeaders()
          );

          fetchSlots();

          setBookingDone(true);

          alert("Payment Successful & Slot Booked");
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const total = hours * pricePerHour;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>🚗 Smart Parking</h2>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <h3>Parking Slots</h3>

      <div style={styles.grid}>
        {slots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => handleSelect(slot)}
            style={{
              ...styles.slot,
              backgroundColor: slot.is_occupied
                ? "#ef4444"
                : "#22c55e",

              border:
                selectedSlot === slot.slot_number
                  ? "4px solid yellow"
                  : "none",
            }}
          >
            <h3>{slot.slot_number}</h3>

            <p>
              {slot.is_occupied ? "Booked" : "Available"}
            </p>
          </div>
        ))}
      </div>

      <div style={styles.panel}>
        <h3>Booking Panel</h3>

        <p>
          Selected Slot:
          <b> {selectedSlot || "None"} </b>
        </p>

        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          style={styles.select}
        >
          <option value={1}>1 Hour</option>
          <option value={2}>2 Hours</option>
          <option value={3}>3 Hours</option>
          <option value={4}>4 Hours</option>
        </select>

        <h2>Total ₹{total}</h2>

        <button
          onClick={handlePayment}
          style={styles.payBtn}
        >
          Pay Now
        </button>

        {bookingDone && (
          <div style={{ marginTop: 20 }}>
            <QRCodeCanvas
              value={`Slot:${selectedSlot}`}
              size={180}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// STYLES

const styles = {
  page: {
    padding: 20,
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#111827",
    color: "white",
    padding: 15,
    borderRadius: 10,
  },

  logoutBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: 5,
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(120px,1fr))",
    gap: 15,
    marginTop: 20,
  },

  slot: {
    color: "white",
    padding: 25,
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
  },

  panel: {
    marginTop: 30,
    background: "white",
    padding: 25,
    borderRadius: 10,
    maxWidth: 400,
  },

  select: {
    width: "100%",
    padding: 10,
    marginTop: 10,
  },

  payBtn: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};