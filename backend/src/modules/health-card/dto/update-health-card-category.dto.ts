import { PartialType } from '@nestjs/swagger';
import { CreateHealthCardCategoryDto } from './create-health-card-category.dto';

export class UpdateHealthCardCategoryDto extends PartialType(CreateHealthCardCategoryDto) {}
