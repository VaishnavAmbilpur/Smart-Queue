const router = require("express").Router();
const Patient = require("../models/Patient");
const auth = require("../middleware/authMiddleware");
const { calculateWaitTimes } = require("../utils/waitTimeCalculator");
const { v4: uuidv4 } = require("uuid");
const Doctor = require("../models/Doctor");

router.post("/add", auth, async (req, res) => {
  try {
    
    const doctorId = req.doctorId;
    const count = await Patient.countDocuments({
      doctorId,
      status: "waiting"
    });

    const patient = await Patient.create({
      doctorId,
      name: req.body.name,
      description: req.body.description,
      number : req.body.number,
      tokenNumber: count + 1,
      uniqueLinkId: uuidv4()
    });

    global.io.to(doctorId.toString()).emit("queueUpdated");

    res.json({
      message: "Patient added successfully", 
      patient,
      statusLink: `/api/queue/status/${patient.uniqueLinkId}`
    });
  } catch (err) {
    console.error("Add Patient Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/history", auth, async (req, res) => {
//   try {
//     const { date, status, search } = req.query;

//     let filter = {
//       doctorId: req.doctorId,
//       status: { $in: ["completed", "cancelled"] }
//     };

//     if (status) filter.status = status;

//     if (search)
//       filter.name = { $regex: search, $options: "i" };

//     if (date) {
//       const start = new Date(date);
//       const end = new Date(date);

//       if (isNaN(start.getTime())) {
//         return res.status(400).json({ message: "Invalid Date Format" });
//       }

//       end.setHours(23, 59, 59, 999);
//       filter.completedAt = { $gte: start, $lte: end };
//     }

//     const history = await Patient.find(filter).sort({ completedAt: -1 });

//     res.json(history);
//   } catch (err) {
//     console.error("History Fetch Error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });
router.get("/history/", auth, async (req, res) => {
  try {
    const { date, status, search } = req.query;
    let filter = {
      doctorId: req.doctorId,
      status: { $in: ["completed", "cancelled"] }
    };
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (date && !isNaN(new Date(date))) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.completedAt = { $gte: start, $lte: end };
    }

    const history = await Patient.find(filter).sort({ completedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("History Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:doctorId", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const queue = await Patient.find({
      doctorId: req.params.doctorId,
  status: { $in: ["waiting"] }
}).sort({ tokenNumber: 1 });

    const queueWithWaitTimes = calculateWaitTimes(queue, doctor);

    res.json(queueWithWaitTimes);
  } catch (err) {
    console.error("Fetch Queue Error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

router.get("/status/:uniqueLinkId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      uniqueLinkId: req.params.uniqueLinkId
    });

    if (!patient) {
      return res.status(404).json({ message: "Invalid link" });
    }
    if (patient.status === "completed") {
      return res.json({
        status: "completed",
        message: "Thank you for visiting"
      });
    }
    const queue = await Patient.find({
      doctorId: patient.doctorId,
      status: { $in: ["waiting"] }
    }).sort({ tokenNumber: 1 });
    const queueWithMarker = queue.map((p, index) => ({
      id: p._id,
      name: p.name,
      tokenNumber: p.tokenNumber,
      status: p.status,
      isMe: p.uniqueLinkId === patient.uniqueLinkId,
      position: index + 1
    }));

    const myPosition = queueWithMarker.find(q => q.isMe)?.position || null;
    const doctor = await Doctor.findById(patient.doctorId);

    res.json({
      doctorId: patient.doctorId,
      myStatus: patient.status,
      myTokenNumber: patient.tokenNumber,
      avgTime: doctor.avgConsultationTime || 5, 
      myPosition,
      queue: queueWithMarker
    });

  } catch (err) {
    console.error("Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/complete/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: "completed", completedAt: new Date() },
      { new: true }
    );

    if (!patient)
      return res.status(404).json({ message: "Patient not found" });
    global.io.to(patient.doctorId.toString()).emit("queueUpdated");
    global.io.to(patient.uniqueLinkId).emit("visitCompleted", { message: "Thank you for visiting" });

    res.json(patient);

  } catch (err) {
    console.error("Complete Patient Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!patient)
      return res.status(404).json({ message: "Patient not found" });
    global.io.to(patient.doctorId.toString()).emit("queueUpdated");
    global.io.to(patient.uniqueLinkId).emit("visitCancelled", { message: "Your appointment has been cancelled." });

    res.json(patient);

  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// router.put("/reorder/:doctorId", auth, async (req, res) => {
//   try {
//     const { newOrder } = req.body; 

//     const queue = await Patient.find({
//       doctorId: req.params.doctorId,
//       status: "waiting"
//     }).sort({ tokenNumber: 1 });

//     if (queue.length < 3)return res.json({ message: "Less than 3 patients" });

//     for (let i = 0; i < newOrder.length; i++) {
//       await Patient.findByIdAndUpdate(newOrder[i], {
//         tokenNumber: i + 1
//       });
//     }

//     global.io.to(req.params.doctorId.toString()).emit("queueUpdated");

//     res.json({ message: "Reordered successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.put("/reorder/:doctorId", auth, async (req, res) => {
  try {
    const { newOrder } = req.body;

    let queue = await Patient.find({
      doctorId: req.params.doctorId,
      status: "waiting"
    }).sort({ tokenNumber: 1 });

    const topLimit = Math.min(3, queue.length);

    const currentTop = queue.slice(0, topLimit);

    if (newOrder.length !== topLimit)
      return res.status(400).json({ message: "Invalid reorder request" });

    for (let i = 0; i < newOrder.length; i++) {
      await Patient.findByIdAndUpdate(newOrder[i], {
        tokenNumber: i + 1
      });
    }

    let nextToken = newOrder.length + 1;

    for (let i = topLimit; i < queue.length; i++) {
      await Patient.findByIdAndUpdate(queue[i]._id, {
        tokenNumber: nextToken++
      });
    }

    global.io.to(req.params.doctorId.toString()).emit("queueUpdated");

    res.json({ message: "Reordered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
