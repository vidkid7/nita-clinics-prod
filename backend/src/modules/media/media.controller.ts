import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaType } from './entities/media.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get all media files (public)' })
  findAllPublic() {
    return this.mediaService.findAll({});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('upload')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const ALLOWED_MIME_TYPES = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type '${file.mimetype}' is not allowed`);
    }
    const isVideo = file.mimetype.startsWith('video/');
    const isDocument =
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const maxBytes = isVideo
      ? 100 * 1024 * 1024
      : isDocument
        ? 25 * 1024 * 1024
        : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(
        `File exceeds maximum allowed size (${isVideo ? '100MB' : isDocument ? '25MB' : '5MB'})`,
      );
    }
    return this.mediaService.uploadFile(file, folder);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all media files' })
  @ApiQuery({ name: 'type', required: false, enum: MediaType })
  @ApiQuery({ name: 'folder', required: false })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: MediaType,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.findAll({ ...paginationDto, type, folder });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('folders')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all folders' })
  getFolders() {
    return this.mediaService.getFolders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get a media file by ID' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update media file metadata' })
  update(
    @Param('id') id: string,
    @Body() data: { alt?: string; caption?: string },
  ) {
    return this.mediaService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a media file' })
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
