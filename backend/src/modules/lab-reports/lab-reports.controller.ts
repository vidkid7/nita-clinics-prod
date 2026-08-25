import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LabReportsService } from './lab-reports.service';
import { CreateLabReportDto } from './dto/create-lab-report.dto';
import { UpdateLabReportDto } from './dto/update-lab-report.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('lab-reports')
@Controller('lab-reports')
export class LabReportsController {
  constructor(private readonly labReportsService: LabReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload lab report' })
  create(@Body() dto: CreateLabReportDto, @Req() req: any) {
    const uploadedBy = req?.user?.name || req?.user?.email || 'system';
    return this.labReportsService.create(dto, uploadedBy);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all lab reports (admin)' })
  @ApiQuery({ name: 'patientId', required: false })
  findAll(@Query() pagination: PaginationDto, @Query('patientId') patientId?: string) {
    return this.labReportsService.findAll(pagination, patientId);
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my lab reports (patient)' })
  getMyReports(@Req() req: any, @Query() pagination: PaginationDto) {
    return this.labReportsService.findByPatientUserId(req.user.id, pagination);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by order ID' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.labReportsService.findByOrderId(orderId);
  }

  @Get('my-reports/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific report (patient, access controlled)' })
  getMyReport(@Param('id') id: string, @Req() req: any) {
    return this.labReportsService.getPatientReport(id, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab report by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.labReportsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lab report' })
  update(@Param('id') id: string, @Body() dto: UpdateLabReportDto) {
    return this.labReportsService.update(id, dto);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify lab report' })
  verify(@Param('id') id: string, @Req() req: any) {
    const verifier = req?.user?.name || req?.user?.email || 'admin';
    return this.labReportsService.verify(id, verifier);
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle report visibility for patient' })
  toggleVisibility(@Param('id') id: string) {
    return this.labReportsService.toggleVisibility(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lab report' })
  remove(@Param('id') id: string) {
    return this.labReportsService.remove(id);
  }
}
