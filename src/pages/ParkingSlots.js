function ParkingSlots() {
  const slots = [
    { id: 1, occupied: false },
    { id: 2, occupied: true },
    { id: 3, occupied: false },
    { id: 4, occupied: true },
    { id: 5, occupied: false },
    { id: 6, occupied: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Parking Slots
      </h1>

      <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`h-24 rounded-xl flex items-center justify-center text-white text-xl font-bold ${
              slot.occupied ? "bg-red-500" : "bg-green-500"
            }`}
          >
            Slot {slot.id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingSlots;