import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonServiceDto } from './create-salon-service.dto.js';

export class UpdateSalonServiceDto extends PartialType(
  CreateSalonServiceDto
) {}