/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Article } from './res';

export class UploadArticleDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateArticleDto {
  @ApiProperty()
  article: Article;
}
