// app.controller.ts
import {
	Controller,
	Get,
	Post,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './modules/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller()
export class AppController {
	constructor(private readonly minioService: MinioService) {}

	@Post('covers')
	@UseInterceptors(FileInterceptor('file'))
	async uploadBookCover(@UploadedFile() file: Express.Multer.File) {
		await this.minioService.createBucketIfNotExists();
		const uniqueId = uuidv4();
		const folderPath = 'profile/';
		const fileName = `${folderPath}${uniqueId}${path.extname(file.originalname)}`;

		await this.minioService.uploadFile(file, fileName);
		return fileName;
	}

	@Get('covers/:fileName')
	async getBookCover(@Param('fileName') fileName: string) {
		const fileUrl = await this.minioService.getFileUrl(fileName);
		return fileUrl;
	}

	@Delete('covers/:fileName')
	async deleteBookCover(@Param('fileName') fileName: string) {
		await this.minioService.deleteFile(fileName);
		return fileName;
	}
}
