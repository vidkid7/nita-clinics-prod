import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AppointmentStatus } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Book a new appointment' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get('available-doctors')
  @Public()
  @ApiOperation({ summary: 'Get doctors available at a given date and time slot' })
  @ApiQuery({ name: 'date', required: true, example: '2024-02-15' })
  @ApiQuery({ name: 'time', required: true, example: '10:00' })
  getAvailableDoctors(@Query('date') date: string, @Query('time') time: string) {
    return this.appointmentsService.getAvailableDoctorsAtSlot(date, time);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.findAll({
      ...paginationDto,
      doctorId,
      status,
      startDate,
      endDate,
    });
  }

  @Get('today')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get today\'s appointments' })
  getTodayAppointments() {
    return this.appointmentsService.getTodayAppointments();
  }

  @Get('my-appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my appointments (patient)' })
  getMyAppointments(@Req() req: any, @Query() pagination: PaginationDto) {
    const email = String(req.user?.email || '')
      .trim()
      .toLowerCase();
    return this.appointmentsService.findByPatientEmail(email, pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an appointment' })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm an appointment' })
  confirm(@Param('id') id: string) {
    return this.appointmentsService.confirm(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an appointment (patient: own only; staff: any)' })
  cancel(
    @Param('id') id: string,
    @Req() req: { user: { email: string; role: UserRole } },
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.cancel(id, reason, req.user);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark appointment as completed' })
  complete(@Param('id') id: string) {
    return this.appointmentsService.complete(id);
  }

  @Patch(':id/no-show')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark appointment as no-show' })
  markNoShow(@Param('id') id: string) {
    return this.appointmentsService.markNoShow(id);
  }
}
