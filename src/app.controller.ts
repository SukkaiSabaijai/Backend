// app.controller.ts
import {
	Controller,
	Get,
	Param,
	Res,
	NotFoundException,
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
		const filePath = `${folderName}/${fileName}`;
		try {
			const fileStream = await this.minioService.getFileStream(filePath);
			res.setHeader('Content-Type', 'image/jpeg');
			res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
			fileStream.pipe(res);
		} catch {
			throw new NotFoundException('Image not found');
		}
	}
}
