module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected");

    socket.on("joinDoctorRoom", (doctorId) => {
      socket.join(doctorId);
    });

    socket.on("joinPatientRoom", (uniqueLinkId) => {
      socket.join(uniqueLinkId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};
