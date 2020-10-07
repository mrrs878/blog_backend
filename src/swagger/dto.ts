/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-29 18:50:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\swagger\dto.ts
 */
/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Article, User, Menu, Dict, Comment } from './res';

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

export class AddMenuDto extends Menu {}

export class UpdateMenuDto extends Menu {}

export class AddDictDto extends Dict {}

export class UpdateDictDto extends Dict {}

export class CreateDictDto extends Dict {}

export class UpdateCommentDto extends Comment {}

export class CreateCommentDto extends Comment {}
