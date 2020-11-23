import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatar_filename: string;
}

class UpdateUserAvatarService {
  public async run({ user_id, avatar_filename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can change avatar', 401);
    }

    if (user.avatar) {
      const userAvatarFilepath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilepath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilepath);
      }
    }

    user.avatar = avatar_filename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
