import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingStatusDto {

    @IsString()
    @IsNotEmpty()
    @IsIn(['confirmed', 'completed', 'cancelled'], {
        message: 'Status must be confirmed, completed, or cancelled.'
    })
    status!: string;

}