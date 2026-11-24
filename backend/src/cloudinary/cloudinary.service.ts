import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import type { Express } from 'express';
@Injectable()
export class CloudinaryService {

  constructor(private configService: ConfigService) {

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')
    });

  }

  async uploadImage(file: Express.Multer.File): Promise<string> {

    try {

      const result = await new Promise<any>((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'beautyglow/services',
            resource_type: 'image'
          },
          (error, result) => {

            if (error) {
              return reject(error);
            }

            resolve(result);

          }
        );

        Readable.from(file.buffer).pipe(uploadStream);

      });

      return result.secure_url;

    } catch (error) {

      console.error('Cloudinary upload error:', error);

      throw new InternalServerErrorException(
        'Image upload failed.'
      );

    }

  }

}