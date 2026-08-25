import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HealthCardService } from './health-card.service';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateHealthCardCategoryDto } from './dto/create-health-card-category.dto';
import { UpdateHealthCardCategoryDto } from './dto/update-health-card-category.dto';
import { UpdateHealthCardPageDto } from './dto/update-health-card-page.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationStatus } from './entities/health-card-application.entity';

@ApiTags('health-card')
@Controller('health-card')
export class HealthCardController {
  constructor(private readonly healthCardService: HealthCardService) {}

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get health card categories' })
  @ApiQuery({ name: 'includeInactive', required: false })
  findAllCategories(@Query('includeInactive') includeInactive?: string) {
    return this.healthCardService.findAllCategories(includeInactive === 'true');
  }

  @Get('categories/:id')
  @Public()
  @ApiOperation({ summary: 'Get health card category by ID' })
  findCategory(@Param('id') id: string) {
    return this.healthCardService.findCategory(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create health card category' })
  createCategory(@Body() payload: CreateHealthCardCategoryDto) {
    return this.healthCardService.createCategory(payload);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update health card category' })
  updateCategory(@Param('id') id: string, @Body() payload: UpdateHealthCardCategoryDto) {
    return this.healthCardService.updateCategory(id, payload);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete health card category' })
  removeCategory(@Param('id') id: string) {
    return this.healthCardService.removeCategory(id);
  }

  @Get('page')
  @Public()
  @ApiOperation({ summary: 'Get health card page content' })
  getPageContent() {
    return this.healthCardService.getPageContent();
  }

  @Patch('page')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update health card page content' })
  updatePageContent(@Body() payload: UpdateHealthCardPageDto) {
    return this.healthCardService.updatePageContent(payload);
  }

  @Post('applications')
  @Public()
  @UseInterceptors(FileInterceptor('document'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Submit health card application (optional document upload)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: { type: 'string', format: 'binary', description: 'Identity document (passport, citizenship, driving license, NMC ID, employee ID)' },
        holderType: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        organization: { type: 'string' },
        nmcRegistrationId: { type: 'string' },
        relationWithDoctor: { type: 'string' },
        documentType: { type: 'string', enum: ['passport', 'citizenship', 'driving_license', 'nmc_registration', 'employee_id'] },
        documentNumber: { type: 'string' },
      },
      required: ['holderType', 'fullName', 'phone'],
    },
  })
  createApplication(
    @Body() payload: CreateApplicationDto,
    @UploadedFile() document?: Express.Multer.File,
  ) {
    return this.healthCardService.createApplication(payload, document);
  }

  @Get('applications/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my health card applications (patient)' })
  getMyApplications(@Req() req: any) {
    return this.healthCardService.findMyApplications(req.user.id, req.user.email);
  }

  @Get('applications/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications (admin)' })
  listApplications(@Query('status') status?: ApplicationStatus) {
    return this.healthCardService.listApplications(status);
  }

  @Patch('applications/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve health card application' })
  approveApplication(@Param('id') id: string, @Req() req: any) {
    const approver = req?.user?.name || req?.user?.email || 'admin';
    return this.healthCardService.approveApplication(id, approver);
  }

  @Patch('applications/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject health card application' })
  rejectApplication(@Param('id') id: string, @Body() payload: UpdateApplicationStatusDto) {
    return this.healthCardService.rejectApplication(id, payload.rejectionReason);
  }

  @Get('inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get health card inventory stats' })
  getInventoryStats() {
    return this.healthCardService.getInventoryStats();
  }

  @Patch('inventory/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update health card inventory' })
  updateInventory(@Param('categoryId') categoryId: string, @Body() body: { totalCards: number }) {
    return this.healthCardService.updateInventory(categoryId, body.totalCards);
  }

  @Post('applications/:id/generate-otp')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate OTP for card collection' })
  generateCollectionOtp(@Param('id') id: string) {
    return this.healthCardService.generateCollectionOtp(id);
  }

  @Post('applications/:id/verify-collection')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify card collection with OTP' })
  verifyCollection(@Param('id') id: string, @Body() body: { otp: string }, @Req() req: any) {
    const verifier = req?.user?.name || req?.user?.email || 'admin';
    return this.healthCardService.verifyCollection(id, body.otp, verifier);
  }
}
