import { PartialType } from '@nestjs/swagger';
import { CreateLabTestCategoryDto } from './create-lab-test-category.dto';

export class UpdateLabTestCategoryDto extends PartialType(CreateLabTestCategoryDto) {}
