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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { EnquiryType, EnquiryStatus } from './entities/enquiry.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Submit a new enquiry' })
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enquiries' })
  @ApiQuery({ name: 'type', required: false, enum: EnquiryType })
  @ApiQuery({ name: 'status', required: false, enum: EnquiryStatus })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: EnquiryType,
    @Query('status') status?: EnquiryStatus,
  ) {
    return this.enquiriesService.findAll({ ...paginationDto, type, status });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enquiry statistics' })
  getStats() {
    return this.enquiriesService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an enquiry by ID' })
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an enquiry' })
  update(@Param('id') id: string, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    return this.enquiriesService.update(id, updateEnquiryDto);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to an enquiry' })
  respond(@Param('id') id: string, @Body('response') response: string) {
    return this.enquiriesService.respond(id, response);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign enquiry to a staff member' })
  assignTo(@Param('id') id: string, @Body('userId') userId: string) {
    return this.enquiriesService.assignTo(id, userId);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close an enquiry' })
  close(@Param('id') id: string) {
    return this.enquiriesService.close(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an enquiry' })
  remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }
}
