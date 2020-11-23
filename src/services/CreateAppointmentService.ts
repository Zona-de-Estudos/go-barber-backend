import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepositories';

import AppError from '../errors/AppError';

interface Request {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async run({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentHour = startOfHour(date);

    const hasApointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentHour,
    );

    if (hasApointmentInSameDate) {
      throw new AppError('This apointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentHour,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
