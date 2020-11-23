import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const data = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.run(data);

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
