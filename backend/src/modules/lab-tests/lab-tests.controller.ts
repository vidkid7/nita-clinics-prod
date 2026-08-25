import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LabTestsService } from './lab-tests.service';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';
import { CreateLabTestCategoryDto } from './dto/create-lab-test-category.dto';
import { UpdateLabTestCategoryDto } from './dto/update-lab-test-category.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('lab-tests')
@Controller('lab-tests')
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  // --- Categories ---

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lab test category' })
  createCategory(@Body() dto: CreateLabTestCategoryDto) {
    return this.labTestsService.createCategory(dto);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get lab test categories' })
  @ApiQuery({ name: 'includeInactive', required: false })
  findAllCategories(@Query('includeInactive') includeInactive?: string) {
    return this.labTestsService.findAllCategories(includeInactive === 'true');
  }

  /** Must be registered before categories/:id so "slug" is not parsed as an id. */
  @Get('categories/slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get lab test category by slug' })
  findCategoryBySlug(@Param('slug') slug: string) {
    return this.labTestsService.findCategoryBySlug(slug);
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Get lab test category by ID' })
  findCategory(@Param('id') id: string) {
    return this.labTestsService.findCategory(id);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lab test category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateLabTestCategoryDto) {
    return this.labTestsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lab test category' })
  removeCategory(@Param('id') id: string) {
    return this.labTestsService.removeCategory(id);
  }

  // --- Tests ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lab test' })
  createTest(@Body() dto: CreateLabTestDto) {
    return this.labTestsService.createTest(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get lab tests (public)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'popular', required: false })
  findAllTests(
    @Query() pagination: PaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('popular') popular?: string,
  ) {
    return this.labTestsService.findAllTests(pagination, categoryId, popular === 'true');
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lab tests (admin, includes inactive)' })
  @ApiQuery({ name: 'categoryId', required: false })
  findAllTestsAdmin(
    @Query() pagination: PaginationDto,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.labTestsService.findAllTestsAdmin(pagination, categoryId);
  }

  /** Before :id so paths like /lab-tests/slug/cbc are not treated as id "slug". */
  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get lab test by slug' })
  findTestBySlug(@Param('slug') slug: string) {
    return this.labTestsService.findTestBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get lab test by ID' })
  findTest(@Param('id') id: string) {
    return this.labTestsService.findTest(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lab test' })
  updateTest(@Param('id') id: string, @Body() dto: UpdateLabTestDto) {
    return this.labTestsService.updateTest(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lab test' })
  removeTest(@Param('id') id: string) {
    return this.labTestsService.removeTest(id);
  }
}
