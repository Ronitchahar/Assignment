import prisma from "./lib/prisma";
import { createPatient, getPatient, searchPatients, updatePatientPhone } from "./patients";
import { createDoctor, listDoctorsBySpecialty } from "./doctors";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
} from "./appointments";

async function main() {
  console.log("\n── Patients ──────────────────────────");

  const patient = await createPatient({
    name: "Test Patient",
    email: "test.patient@example.com",
    phone: "9999999999",
  });
  console.log("Created:", patient.name, patient.id);

  const found = await getPatient(patient.id);
  console.log("Found:", found.name);

  const updated = await updatePatientPhone(patient.id, "8888888888");
  console.log("Updated phone:", updated.phone);

  const results = await searchPatients("Test");
  console.log("Search results:", results.length);

  console.log("\n── Doctors ───────────────────────────");

  const doctor = await createDoctor({
    name: "Dr. Test",
    specialty: "General Medicine",
    email: "dr.test@hospital.io",
  });
  console.log("Created:", doctor.name, doctor.id);

  const specialists = await listDoctorsBySpecialty("General");
  console.log("General Medicine doctors:", specialists.length);

  console.log("\n── Appointments ──────────────────────");

  const appt = await bookAppointment(
    patient.id,
    doctor.id,
    new Date("2024-09-01T09:00:00"),
    "Initial consultation"
  );
  console.log("Booked:", appt.id, "for", appt.patient.name);

  const full = await getAppointmentFull(appt.id);
  console.log("Full fetch:", full.patient.name, "with", full.doctor.name);

  const schedule = await getDoctorUpcomingAppointments(doctor.id);
  console.log("Doctor schedule:", schedule.length, "appointment(s)");

  const cancelled = await setAppointmentStatus(appt.id, "cancelled");
  console.log("Status updated to:", cancelled.status);

  console.log("\n── Cleanup ───────────────────────────");
  await prisma.appointment.delete({ where: { id: appt.id } });
  await prisma.patient.delete({ where: { id: patient.id } });
  await prisma.doctor.delete({ where: { id: doctor.id } });
  console.log("Test data cleaned up.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
