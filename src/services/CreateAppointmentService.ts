import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepositories';

interface Request {
  date: Date;
  provider: string;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public run({ date, provider }: Request): Appointment {
    const appointmentHour = startOfHour(date);

    const hasApointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentHour,
    );

    if (hasApointmentInSameDate) {
      throw Error('This apointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentHour,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
