import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all settings or by category' })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.settingsService.findByCategory(category);
    }
    return this.settingsService.findAll();
  }

  @Get('object')
  @Public()
  @ApiOperation({ summary: 'Get settings as key-value object' })
  getSettingsObject(@Query('category') category?: string) {
    return this.settingsService.getSettingsObject(category);
  }

  @Get(':key')
  @Public()
  @ApiOperation({ summary: 'Get a setting by key' })
  findOne(@Param('key') key: string) {
    return this.settingsService.findOne(key);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update a setting' })
  upsert(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.upsert(updateSettingDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create or update settings' })
  bulkUpsert(@Body() bulkUpdateSettingsDto: BulkUpdateSettingsDto) {
    return this.settingsService.bulkUpsert(bulkUpdateSettingsDto.settings);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a setting' })
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
