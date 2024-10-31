import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class MinioService {
	private minioClient: Minio.Client;
	private bucketName: string;

	constructor(private readonly configService: ConfigService) {
		this.minioClient = new Minio.Client({
			endPoint: this.configService.get('MINIO_ENDPOINT'),
			port: Number(this.configService.get('MINIO_PORT')),
			useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
			accessKey: this.configService.get('MINIO_ACCESS_KEY'),
			secretKey: this.configService.get('MINIO_SECRET_KEY'),
		});
		this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
	}

	async onModuleInit() {
		await this.createBucketIfNotExists();
	}

	async createBucketIfNotExists() {
		const bucketExists = await this.minioClient.bucketExists(this.bucketName);
		if (!bucketExists) {
			await this.minioClient.makeBucket(this.bucketName, 'ap-southeast-1');
		}
	}

	async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
		const timestamp = Date.now();
		const randomString = crypto.randomBytes(16).toString('hex');
		const fileExtension = path.extname(file.originalname);

		const fileName = `${timestamp}-${randomString}${fileExtension}`;
		const filePath = `${folder}/${fileName}`;

		await this.minioClient.putObject(
			this.bucketName,
			filePath,
			file.buffer,
			file.size,
		);

		return filePath;
	}

	async getFileStream(objectName: string) {
		try {
			return await this.minioClient.getObject(this.bucketName, objectName);
		} catch (error) {
			throw new HttpException('File not found', HttpStatus.NOT_FOUND);
		}
	}

	// Generate a presigned URL for the file
	async getFileUrl(fileName: string): Promise<string> {
		try {
			return await this.minioClient.presignedUrl('GET', this.bucketName, fileName, 120);
		} catch (error) {
			throw new HttpException('Error generating URL', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Delete a file from MinIO
	async deleteFile(fileName: string) {
		try {
			await this.minioClient.removeObject(this.bucketName, fileName);
		} catch (error) {
			throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
