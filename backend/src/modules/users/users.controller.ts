import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: User) {
    // Staff can only create other staff users
    if (currentUser.role === UserRole.STAFF) {
      createUserDto.role = UserRole.STAFF;
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() currentUser: User,
  ) {
    const result = await this.usersService.findAll(paginationDto);

    // Role-based visibility:
    // - super_admin: can see everyone
    // - admin: can see admins + staff, but NOT super_admin
    // - staff: can see only staff
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return result;
    }

    if (currentUser.role === UserRole.ADMIN) {
      // hide super admin
      (result as any).data = (result as any).data.filter(
        (u: User) => u.role !== UserRole.SUPER_ADMIN,
      );
      (result as any).total = (result as any).data.length;
      return result;
    }

    if (currentUser.role === UserRole.STAFF) {
      (result as any).data = (result as any).data.filter(
        (u: User) => u.role === UserRole.STAFF,
      );
      (result as any).total = (result as any).data.length;
      return result;
    }

    return result;
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    const target = await this.usersService.findOne(id);

    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return target;
    }

    if (currentUser.role === UserRole.ADMIN) {
      if (target.role === UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Admins cannot view the super admin account.');
      }
      return target;
    }

    // staff: can only view staff users
    if (currentUser.role === UserRole.STAFF && target.role !== UserRole.STAFF) {
      throw new ForbiddenException('Staff can only view staff users.');
    }

    return target;
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    // Super admin can update anyone
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return this.usersService.update(id, updateUserDto);
    }

    // Admin restrictions:
    //  - cannot modify super admin
    //  - cannot modify other admins (only self)
    const target = await this.usersService.findOne(id);

    if (target.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Admins cannot modify the super admin account.');
    }

    if (target.role === UserRole.ADMIN && target.id !== currentUser.id) {
      throw new ForbiddenException('Admins cannot modify other admin accounts.');
    }

    // Also prevent admin from elevating anyone to super_admin
    if (updateUserDto.role === UserRole.SUPER_ADMIN) {
      delete (updateUserDto as any).role;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate a user' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate a user' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
