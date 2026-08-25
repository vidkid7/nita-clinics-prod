import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { PartnerSection } from './entities/partner.entity';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create partner' })
  create(@Body() payload: CreatePartnerDto) {
    return this.partnersService.create(payload);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get partners' })
  @ApiQuery({ name: 'section', required: false, enum: PartnerSection })
  @ApiQuery({ name: 'includeInactive', required: false })
  findAll(@Query('section') section?: PartnerSection, @Query('includeInactive') includeInactive?: string) {
    return this.partnersService.findAll(section, includeInactive === 'true');
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get partner by ID' })
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update partner' })
  update(@Param('id') id: string, @Body() payload: UpdatePartnerDto) {
    return this.partnersService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete partner' })
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
