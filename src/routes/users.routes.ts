import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import checkAuthentication from '../middleware/checkAuthentication';

const UsersRouter = Router();
const upload = multer(uploadConfig);

UsersRouter.post('/', async (request, response) => {
  try {
    const data = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.run(data);

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

UsersRouter.patch(
  '/avatar',
  checkAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    return response.json({ ok: true });
  },
);

export default UsersRouter;
