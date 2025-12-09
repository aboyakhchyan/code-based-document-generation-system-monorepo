import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EditUserDto } from './dto/user.dto';
import { IUser } from '@auth/interface';
import { MulterService } from '@services';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly multerService: MulterService,
  ) {}

  async editUser(
    userId: string,
    editUserDto: EditUserDto,
    picture: Express.Multer.File | undefined,
  ): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<IUser> = {};

    if (editUserDto.fullName !== undefined) {
      updateData.fullName = editUserDto.fullName;
    }

    if (editUserDto.email !== undefined) {
      const existingUser = await this.userRepository.findByEmail(
        editUserDto.email,
      );
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email is already taken');
      }
      updateData.email = editUserDto.email;
    }

    if (editUserDto.age !== undefined) {
      updateData.age = editUserDto.age;
    }

    if (editUserDto.gender !== undefined) {
      updateData.gender = editUserDto.gender;
    }

    if (editUserDto.phone !== undefined) {
      updateData.phone = editUserDto.phone;
    }

    if (editUserDto.city !== undefined) {
      updateData.city = editUserDto.city;
    }

    if(user.isVerified) {
        updateData.isVerified = true;
    }

    let picturePath: string | undefined;

    if (picture) {
      picturePath = await this.multerService.save(picture, 'users');

      if (!picturePath) {
        throw new BadRequestException('Failed to save picture');
      }

      if (user.picture) {
        try {
          await this.multerService.delete(user.picture);
        } catch (error) {
          console.error('Failed to delete old picture:', error);
        }
      }

      updateData.picture = picturePath;
    }

    try {
      const updatedUser = await this.userRepository.update(userId, updateData);

      const { password: _, ...userWithoutPassword } = updatedUser;

      return userWithoutPassword as Omit<IUser, 'password'>;
    } catch (error) {
      if (picturePath) {
        await this.multerService.delete(picturePath);
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to update user',
      );
    }
  }
}
