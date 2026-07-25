import prisma from "./lib/prisma";
import { Appointment, Patient, Doctor } from "@prisma/client";

export async function bookAppointment(
  patientId: number,
  doctorId: number,
  date: Date,
  notes?: string
): Promise<
  Appointment & {
    patient: Pick<Patient, "name" | "email">;
    doctor: Pick<Doctor, "name" | "specialty">;
  }
> {
  return prisma.appointment.create({
    data: {
      appointmentDate: date,
      notes: notes ?? null,
      patient: { connect: { id: patientId } },
      doctor: { connect: { id: doctorId } },
    },
    include: {
      patient: { select: { name: true, email: true } },
      doctor: { select: { name: true, specialty: true } },
    },
  });
}

export async function getAppointmentFull(
  id: number
): Promise<Appointment & { patient: Patient; doctor: Doctor }> {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  if (appt === null) throw new Error("Appointment not found");
  return appt;
}

export async function getDoctorUpcomingAppointments(doctorId: number): Promise<
  (Appointment & { patient: Pick<Patient, "name" | "phone"> })[]
> {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      status: "scheduled",
      appointmentDate: { gte: new Date() },
    },
    orderBy: { appointmentDate: "asc" },
    include: {
      patient: { select: { name: true, phone: true } },
    },
  });
}

export async function setAppointmentStatus(
  id: number,
  status: "scheduled" | "completed" | "cancelled"
): Promise<Appointment> {
  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function cancelAllPatientAppointments(patientId: number): Promise<number> {
  const result = await prisma.appointment.updateMany({
    where: { patientId, status: "scheduled" },
    data: { status: "cancelled" },
  });
  return result.count;
}

export async function deleteAppointment(id: number): Promise<Appointment> {
  return prisma.appointment.delete({ where: { id } });
}
