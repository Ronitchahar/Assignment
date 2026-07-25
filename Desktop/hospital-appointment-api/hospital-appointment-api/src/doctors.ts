import prisma from "./lib/prisma";
import { Doctor } from "@prisma/client";

export async function createDoctor(data: {
  name: string;
  specialty: string;
  email: string;
}): Promise<Doctor> {
  return prisma.doctor.create({ data });
}

export async function getDoctor(id: number): Promise<Doctor> {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (doctor === null) throw new Error("Doctor not found");
  return doctor;
}

export async function listDoctorsBySpecialty(specialty: string): Promise<
  Pick<Doctor, "id" | "name" | "specialty" | "email">[]
> {
  return prisma.doctor.findMany({
    where: { specialty: { contains: specialty } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, specialty: true, email: true },
  });
}

// Note: ON DELETE RESTRICT on appointments.doctor_id
// Deleting a doctor who has appointments throws a P2003 FK constraint error.
// Cancel/reassign their appointments first, or catch the error at the call site.
export async function deleteDoctor(id: number): Promise<Doctor> {
  return prisma.doctor.delete({ where: { id } });
}
