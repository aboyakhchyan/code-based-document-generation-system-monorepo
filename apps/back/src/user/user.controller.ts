import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto/user.dto';
import { Upload, User } from '@common/decorators/param';
import { FileValidationPipe } from '@common/pipes';
import { Auth } from '@common/decorators/method';
import { IUser } from '@auth/interface';
import { Verified } from '@common/decorators/method/verified.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('edit')
  @Verified()
  @Auth('jwt')
  @Upload('picture')
  @HttpCode(HttpStatus.OK)
  async edit(
    @Body() editUserDto: EditUserDto,
    @UploadedFile(new FileValidationPipe({ isRequired: false }))
    picture: Express.Multer.File | undefined,
    @User() user: IUser,
  ) {
    return this.userService.editUser(user.id as string, editUserDto, picture);
  }
}
