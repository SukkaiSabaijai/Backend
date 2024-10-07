// app.controller.ts
import {
	Controller,
	Get,
	Post,
	Param,
	Delete,
	UploadedFile,
	UseInterceptors,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { MinioService } from './modules/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Controller()
export class AppController {
	constructor(private readonly minioService: MinioService) { }
	@Get()
	getHello(): string {
		return 'Hello World!';
	}

	@Get('image/:folderName/:fileName')
	async getImage(@Param('folderName') folderName: string, @Param('fileName') fileName: string): Promise<string> {
		const objectName = `${folderName}/${fileName}`;
		if (folderName !== 'marker-pics') {
			throw new HttpException('access denied', HttpStatus.FORBIDDEN);
		}
		const url = await this.minioService.getFileUrl(objectName);
		return url
	}
}
