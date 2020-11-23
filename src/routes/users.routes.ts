import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatar';

import checkAuthentication from '../middleware/checkAuthentication';

const UsersRouter = Router();
const upload = multer(uploadConfig);

UsersRouter.post('/', async (request, response) => {
  const data = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.run(data);

  delete user.password;

  return response.json(user);
});

UsersRouter.patch(
  '/avatar',
  checkAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.run({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default UsersRouter;
