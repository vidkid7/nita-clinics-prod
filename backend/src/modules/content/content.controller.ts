import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new page content' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get('pages')
  @Public()
  @ApiOperation({ summary: 'Get all page slugs' })
  getAllPages() {
    return this.contentService.getAllPages();
  }

  @Get('page/:pageSlug')
  @Public()
  @ApiOperation({ summary: 'Get all content for a page' })
  findByPage(@Param('pageSlug') pageSlug: string) {
    return this.contentService.findByPage(pageSlug);
  }

  @Get('page/:pageSlug/:sectionKey')
  @Public()
  @ApiOperation({ summary: 'Get specific section content' })
  findByPageAndSection(
    @Param('pageSlug') pageSlug: string,
    @Param('sectionKey') sectionKey: string,
  ) {
    return this.contentService.findByPageAndSection(pageSlug, sectionKey);
  }

  @Put('page/:pageSlug/:sectionKey')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert content for a section' })
  upsert(
    @Param('pageSlug') pageSlug: string,
    @Param('sectionKey') sectionKey: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.upsert(pageSlug, sectionKey, updateContentDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get content by ID' })
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content' })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content' })
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
