import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('vaccinations')
@Controller('vaccinations')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vaccine' })
  create(@Body() dto: CreateVaccineDto) {
    return this.vaccinationsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get vaccines (public)' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query() pagination: PaginationDto, @Query('category') category?: string) {
    return this.vaccinationsService.findAll(pagination, category);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all vaccines (admin)' })
  findAllAdmin() {
    return this.vaccinationsService.findAllAdmin();
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get vaccine categories' })
  getCategories() {
    return this.vaccinationsService.getCategories();
  }

  /** Before :id so /vaccinations/slug/... is not parsed as id "slug". */
  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get vaccine by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.vaccinationsService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get vaccine by ID' })
  findOne(@Param('id') id: string) {
    return this.vaccinationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vaccine' })
  update(@Param('id') id: string, @Body() dto: UpdateVaccineDto) {
    return this.vaccinationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vaccine' })
  remove(@Param('id') id: string) {
    return this.vaccinationsService.remove(id);
  }
}
