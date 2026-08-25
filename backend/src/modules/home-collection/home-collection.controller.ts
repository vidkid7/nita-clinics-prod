import {
  Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HomeCollectionService } from './home-collection.service';
import { CreateHomeCollectionDto } from './dto/create-home-collection.dto';
import { UpdateHomeCollectionDto } from './dto/update-home-collection.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { HomeCollectionStatus } from './entities/home-collection.entity';

@ApiTags('home-collection')
@Controller('home-collection')
export class HomeCollectionController {
  constructor(private readonly homeCollectionService: HomeCollectionService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Request home sample collection' })
  create(@Body() dto: CreateHomeCollectionDto) {
    return this.homeCollectionService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List home collections' })
  @ApiQuery({ name: 'status', required: false, enum: HomeCollectionStatus })
  findAll(@Query() pagination: PaginationDto, @Query('status') status?: HomeCollectionStatus) {
    return this.homeCollectionService.findAll(pagination, status);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get collection statistics' })
  getStats() {
    return this.homeCollectionService.getStats();
  }

  @Get('today')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get today\'s collections' })
  getTodayCollections() {
    return this.homeCollectionService.getTodayCollections();
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my home collection requests (patient)' })
  getMyRequests(@Req() req: any, @Query() pagination: PaginationDto) {
    return this.homeCollectionService.findByPatientEmail(req.user.email, pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get home collection by ID' })
  findOne(@Param('id') id: string) {
    return this.homeCollectionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update home collection' })
  update(@Param('id') id: string, @Body() dto: UpdateHomeCollectionDto) {
    return this.homeCollectionService.update(id, dto);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign staff to collection' })
  assignStaff(
    @Param('id') id: string,
    @Body() body: { staffId: string; staffName: string },
  ) {
    return this.homeCollectionService.assignStaff(id, body.staffId, body.staffName);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel home collection' })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.homeCollectionService.cancel(id, req.user);
  }
}
