/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-21 19:26:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\swagger\dto.ts
 */
/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Article } from './res';

export class UploadArticleDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateArticleDto extends Article {
}

export class CreateArticleDto extends Article {
}
