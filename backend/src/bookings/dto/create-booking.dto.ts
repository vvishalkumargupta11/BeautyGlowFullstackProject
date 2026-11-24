import {
  IsMongoId,
  IsNotEmpty,
  IsDateString,
  IsString,
  Matches
} from 'class-validator';

export class CreateBookingDto {

  @IsMongoId()
  @IsNotEmpty()
  serviceId!: string;

  @IsDateString()
  @IsNotEmpty()
  appointmentDate!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(10|11|12|02|03|04|05):00 (AM|PM)$/,
    { message: 'Please select a valid appointment time.' }
  )
  appointmentTime!: string;

}