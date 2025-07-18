import { PipeTransform, BadRequestException } from '@nestjs/common';
import { fromZodError } from 'zod-validation-error';
import { ZodError, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodObject) {}

	transform(value: unknown) {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue;
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: 'Validation failed',
					statusCode: 400,
					error: fromZodError(error),
				});
			}

			throw new BadRequestException('Validation failed');
		}
	}
}
