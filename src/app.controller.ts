// app.controller.ts
import {
	Controller,
	Get,
	Param,
	HttpException,
	HttpStatus,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from './modules/minio/minio.service';

@Controller()
export class AppController {
	constructor(private readonly minioService: MinioService) { }
	@Get()
	getHello(): string {
		return 'Hello World!';
	}

	@Get('image/:folderName/:fileName')
	async getImage(
		@Param('folderName') folderName: string,
		@Param('fileName') fileName: string,
		@Res() res: Response
	): Promise<void> {
		if (folderName !== 'marker-pics') {
			throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
		}

		try {
			const fileStream = await this.minioService.getFileStream(`${folderName}/${fileName}`);
			res.set({
				'Content-Type': 'image/jpeg',
				'Content-Disposition': `inline; filename="${fileName}"`,
			});

			fileStream.pipe(res);
		} catch {
			throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
		}
	}
}
