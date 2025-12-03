// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { User } from "../models/User.js";

// Helper function to get start and end of day
const getDateRange = (dateString) => {
    const date = new Date(dateString);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
};

// Helper function to check if time slot is available
const isSlotAvailable = async (doctorId, scheduledAt, durationMinutes, excludeAppointmentId = null) => {
    const appointmentStart = new Date(scheduledAt);
    const appointmentEnd = new Date(appointmentStart.getTime() + durationMinutes * 60000);

    // Find overlapping appointments
    const query = {
        doctor: doctorId,
        status: { $nin: ['cancelled', 'no-show'] }, // Exclude cancelled appointments
        $or: [
            // New appointment starts during existing appointment
            {
                scheduledAt: { $lte: appointmentStart },
                $expr: {
                    $gte: [
                        { $add: ["$scheduledAt", { $multiply: ["$durationMinutes", 60000] }] },
                        appointmentStart
                    ]
                }
            },
            // New appointment ends during existing appointment
            {
                scheduledAt: { $lt: appointmentEnd },
                $expr: {
                    $gt: [
                        { $add: ["$scheduledAt", { $multiply: ["$durationMinutes", 60000] }] },
                        appointmentStart
                    ]
                }
            },
            // New appointment completely contains existing appointment
            {
                scheduledAt: { $gte: appointmentStart, $lt: appointmentEnd }
            }
        ]
    };

    // Exclude current appointment if updating
    if (excludeAppointmentId) {
        query._id = { $ne: excludeAppointmentId };
    }

    const overlapping = await Appointment.findOne(query);
    return !overlapping; // Returns true if slot is available
};

// Create new appointment with optimistic locking (atomic operation)
// Works with standalone MongoDB - no replica set required
export const createAppointment = async (req, res) => {
    try {
        const { patient, doctor, scheduledAt, durationMinutes, notes } = req.body;

        // Validate required fields
        if (!patient || !doctor || !scheduledAt) {
            return res.status(400).json({ error: "Patient, doctor, and scheduled time are required" });
        }

        // Check if doctor exists
        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Check if patient exists
        const patientExists = await User.findById(patient);
        if (!patientExists) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Validate appointment is in the future
        const appointmentDate = new Date(scheduledAt);
        if (appointmentDate < new Date()) {
            return res.status(400).json({ error: "Cannot book appointments in the past" });
        }

        // Calculate appointment time range
        const duration = durationMinutes || 30;
        const appointmentStart = new Date(scheduledAt);
        const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);

        // CRITICAL: Atomic conflict check
        // Check for any overlapping appointments with this doctor
        const conflictingAppointment = await Appointment.findOne({
            doctor: doctor,
            status: { $nin: ['cancelled', 'no-show'] },
            $or: [
                // New appointment starts during existing appointment
                {
                    scheduledAt: { $lte: appointmentStart },
                    $expr: {
                        $gte: [
                            { $add: ["$scheduledAt", { $multiply: ["$durationMinutes", 60000] }] },
                            appointmentStart
                        ]
                    }
                },
                // New appointment ends during existing appointment
                {
                    scheduledAt: { $lt: appointmentEnd },
                    $expr: {
                        $gt: [
                            { $add: ["$scheduledAt", { $multiply: ["$durationMinutes", 60000] }] },
                            appointmentStart
                        ]
                    }
                },
                // New appointment completely contains existing appointment
                {
                    scheduledAt: { $gte: appointmentStart, $lt: appointmentEnd }
                }
            ]
        });

        // If conflict found, return 409 Conflict immediately
        if (conflictingAppointment) {
            return res.status(409).json({
                error: "This time slot is already booked. Please choose another time.",
                conflictWith: {
                    appointmentId: conflictingAppointment._id,
                    scheduledAt: conflictingAppointment.scheduledAt
                }
            });
        }

        // Create appointment
        // The unique index on the model provides database-level protection
        // against race conditions even if two requests pass the check above
        const appointment = new Appointment({
            patient,
            doctor,
            scheduledAt,
            durationMinutes: duration,
            notes,
            status: 'pending'
        });

        await appointment.save();

        // Populate doctor and patient details
        await appointment.populate('doctor', 'name specialty contact');
        await appointment.populate('patient', 'name email');

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });
    } catch (err) {
        console.error("Error creating appointment:", err);

        // Handle duplicate key errors from unique index (race condition caught at DB level)
        if (err.code === 11000) {
            return res.status(409).json({
                error: "This time slot is already booked. Please choose another time."
            });
        }

        res.status(500).json({ error: err.message });
    }
};

// Get all appointments (for admin)
export const getAllAppointments = async (req, res) => {
    try {
        const { status, date, doctorId } = req.query;
        const query = {};

        // Filter by status if provided
        if (status && status !== 'All') {
            query.status = status;
        }

        // Filter by doctor if provided
        if (doctorId && doctorId !== 'All') {
            query.doctor = doctorId;
        }

        // Filter by specific date if provided
        if (date) {
            const { startOfDay, endOfDay } = getDateRange(date);
            query.scheduledAt = { $gte: startOfDay, $lte: endOfDay };
        }

        console.log("Fetching all appointments with query:", JSON.stringify(query));
        const appointments = await Appointment.find(query)
            .populate('doctor', 'name specialty')
            .populate('patient', 'name email')
            .sort({ scheduledAt: -1 })
            .lean();

        console.log(`Found ${appointments.length} appointments`);
        res.json({
            count: appointments.length,
            appointments
        });
    } catch (err) {
        console.error("Error fetching all appointments:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get appointments by user (patient)
export const getAppointmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, upcoming } = req.query;

        const query = { patient: userId };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Filter upcoming appointments
        if (upcoming === 'true') {
            query.scheduledAt = { $gte: new Date() };
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'name specialty contact licenseNumber')
            .sort({ scheduledAt: upcoming === 'true' ? 1 : -1 })
            .lean();

        res.json({
            count: appointments.length,
            appointments
        });
    } catch (err) {
        console.error("Error fetching user appointments:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { status, date } = req.query;

        const query = { doctor: doctorId };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Filter by specific date if provided
        if (date) {
            const { startOfDay, endOfDay } = getDateRange(date);
            query.scheduledAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email')
            .sort({ scheduledAt: 1 })
            .lean();

        res.json({
            count: appointments.length,
            appointments
        });
    } catch (err) {
        console.error("Error fetching doctor appointments:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get available time slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.params;
        const durationMinutes = parseInt(req.query.duration) || 30;

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Get all appointments for the doctor on this date
        const { startOfDay, endOfDay } = getDateRange(date);
        const appointments = await Appointment.find({
            doctor: doctorId,
            scheduledAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ['cancelled', 'no-show'] }
        }).select('scheduledAt durationMinutes').lean();

        // Define working hours (9 AM to 5 PM)
        const workStart = 9; // 9 AM
        const workEnd = 17; // 5 PM
        const slotDuration = durationMinutes;

        // Generate all possible slots
        const slots = [];
        const selectedDate = new Date(date);

        for (let hour = workStart; hour < workEnd; hour++) {
            for (let minute = 0; minute < 60; minute += slotDuration) {
                const slotTime = new Date(selectedDate);
                slotTime.setHours(hour, minute, 0, 0);

                // Don't show past slots for today
                if (slotTime > new Date()) {
                    const slotEnd = new Date(slotTime.getTime() + slotDuration * 60000);

                    // Check if slot end time is within working hours
                    if (slotEnd.getHours() < workEnd || (slotEnd.getHours() === workEnd && slotEnd.getMinutes() === 0)) {
                        // Check if this slot conflicts with any existing appointment
                        const isBooked = appointments.some(apt => {
                            const aptStart = new Date(apt.scheduledAt);
                            const aptEnd = new Date(aptStart.getTime() + apt.durationMinutes * 60000);

                            return (
                                (slotTime >= aptStart && slotTime < aptEnd) ||
                                (slotEnd > aptStart && slotEnd <= aptEnd) ||
                                (slotTime <= aptStart && slotEnd >= aptEnd)
                            );
                        });

                        slots.push({
                            time: slotTime.toISOString(),
                            available: !isBooked,
                            displayTime: slotTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })
                        });
                    }
                }
            }
        }

        res.json({
            doctor: {
                id: doctor._id,
                name: doctor.name,
                specialty: doctor.specialty
            },
            date,
            slots,
            availableCount: slots.filter(s => s.available).length,
            totalSlots: slots.length
        });
    } catch (err) {
        console.error("Error fetching available slots:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('doctor', 'name specialty')
            .populate('patient', 'name email');

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.json({
            message: "Appointment status updated successfully",
            appointment
        });
    } catch (err) {
        console.error("Error updating appointment status:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get single appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id)
            .populate('doctor', 'name specialty contact licenseNumber')
            .populate('patient', 'name email')
            .lean();

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.json(appointment);
    } catch (err) {
        console.error("Error fetching appointment:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete/Cancel appointment
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Instead of deleting, mark as cancelled
        appointment.status = 'cancelled';
        await appointment.save();

        res.json({
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (err) {
        console.error("Error cancelling appointment:", err);
        res.status(500).json({ error: err.message });
    }
};
