/*
 * @Author: mrrs878
 * @Date: 2020-09-21 18:46:01
 * @LastEditTime: 2020-09-27 18:58:40
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\pipes\index.ts
 */
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Joi from '@hapi/joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(`参数校验失败,${error.message}`);
    }
    return value;
  }
}

export const addArticleV = new JoiValidationPipe(Joi.object({
  title: Joi.string().required(),
  categories: Joi.string().required(),
  description: Joi.string().required(),
  tag: Joi.string().required(),
  content: Joi.string().required(),
}));

export const addMenuV = new JoiValidationPipe(Joi.object({
  key: Joi.string().required(),
  icon_name: Joi.string().default(''),
  title: Joi.string().required(),
  path: Joi.string().default('').allow(''),
  parent: Joi.string().required(),
  role: Joi.array().default([]),
  sub_menu: Joi.array().default([]),
  status: Joi.number().default(1),
}));

export const updateMenuV = new JoiValidationPipe(Joi.object({
  key: Joi.string().required(),
  icon_name: Joi.string().allow(''),
  title: Joi.string().required(),
  path: Joi.string().required().allow(''),
  parent: Joi.string().required(),
  role: Joi.array().required(),
  sub_menu: Joi.array().required(),
  status: Joi.number().required(),
  children: Joi.array().required(),
  _id: Joi.string().required(),
}));
