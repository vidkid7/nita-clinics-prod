import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Allow updating all fields from CreateUserDto, including password.
// Password hashing is handled by the User entity's @BeforeUpdate hook.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
