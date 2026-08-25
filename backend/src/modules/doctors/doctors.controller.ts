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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new doctor' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get('booking/available-slots')
  @Public()
  @ApiOperation({ summary: 'Get merged available time slots for a date (from all doctors)' })
  @ApiQuery({ name: 'date', required: true, example: '2024-02-15' })
  getMergedAvailableSlots(@Query('date') date: string) {
    if (!date || typeof date !== 'string' || date.trim() === '') {
      return [];
    }
    return this.doctorsService.getMergedAvailableSlotsForDate(date.trim());
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all doctors / team members' })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({
    name: 'staffType',
    required: false,
    description: 'Comma-separated: doctor, admin_staff, nurse, technician',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('departmentId') departmentId?: string,
    @Query('staffType') staffType?: string,
  ) {
    return this.doctorsService.findAll({ ...paginationDto, departmentId, staffType });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a doctor by ID' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a doctor' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a doctor' })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @Get(':id/availability')
  @Public()
  @ApiOperation({ summary: 'Get doctor availability' })
  getAvailabilities(@Param('id') id: string) {
    return this.doctorsService.getAvailabilities(id);
  }

  @Post(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set doctor availability' })
  setAvailability(
    @Param('id') id: string,
    @Body() availabilityDto: CreateAvailabilityDto,
  ) {
    return this.doctorsService.setAvailability(id, availabilityDto);
  }

  @Delete(':id/availability/:availabilityId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove doctor availability' })
  removeAvailability(
    @Param('id') id: string,
    @Param('availabilityId') availabilityId: string,
  ) {
    return this.doctorsService.removeAvailability(id, availabilityId);
  }

  @Get(':id/leaves')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get doctor leaves' })
  getLeaves(@Param('id') id: string) {
    return this.doctorsService.getLeaves(id);
  }

  @Post(':id/leaves')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add doctor leave' })
  addLeave(@Param('id') id: string, @Body() leaveDto: CreateLeaveDto) {
    return this.doctorsService.addLeave(id, leaveDto);
  }

  @Delete(':id/leaves/:leaveId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove doctor leave' })
  removeLeave(@Param('id') id: string, @Param('leaveId') leaveId: string) {
    return this.doctorsService.removeLeave(id, leaveId);
  }

  @Get(':id/slots')
  @Public()
  @ApiOperation({ summary: 'Get available slots for a specific date' })
  @ApiQuery({ name: 'date', required: true, example: '2024-02-15' })
  getAvailableSlots(@Param('id') id: string, @Query('date') date: string) {
    return this.doctorsService.getAvailableSlots(id, date);
  }
}
