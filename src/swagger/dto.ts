/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-23 18:38:58
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\swagger\dto.ts
 */
/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Article, User } from './res';

export class UploadArticleDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateArticleDto extends Article {
}

export class CreateArticleDto extends Article {
}

export class LoginDto extends User {
}

export class RegDto extends LoginDto {
  @ApiProperty()
  repassword: string;
}
