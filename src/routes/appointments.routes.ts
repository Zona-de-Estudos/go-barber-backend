import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepositories';
import CreateAppointmentService from '../services/CreateAppointmentService';
import checkAuthentication from '../middleware/checkAuthentication';

const appointmentsRouter = Router();

appointmentsRouter.use(checkAuthentication);

appointmentsRouter.get('/', async (request, response) => {
  console.log(request.user);

  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const allAppointments = await appointmentsRepository.find();

  return response.json(allAppointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.run({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
