/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

class ArticleSummary {
  @ApiProperty()
  category: string;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;
}

export class Article extends ArticleSummary {
  @ApiProperty()
  content: string;
}

export class User {
  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}

export class Menu {
  @ApiProperty()
  key: string;

  @ApiProperty({ required: false })
  icon?: Record<string, unknown>;

  @ApiProperty({ required: false })
  icon_name?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  path?: string;

  @ApiProperty({ required: false })
  children?: Array<MenuItemI>;

  @ApiProperty()
  sub_menu?: Array<string>;

  @ApiProperty()
  parent: string;

  @ApiProperty({ required: false })
  role?: Array<number>;

  @ApiProperty()
  status?: number;
}

export class Dict {
  @ApiProperty()
  status: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  label_view: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  type_view: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;
}

class BaseRes {
  @ApiProperty({ description: '操作是否成功' })
  success: boolean;

  @ApiProperty({ description: '提示信息' })
  msg: string;

  @ApiProperty({ description: '操作码' })
  code: number;
}

export class GetArticleRes extends BaseRes {
  @ApiProperty({ description: '文章' })
  data: Article;
}

export class GetArticlesSummaryRes extends BaseRes {
  @ApiProperty({ type: [ArticleSummary], description: '文章摘要' })
  data;
}

export class UpdateArticleRes extends BaseRes {}

export class UploadArticle extends BaseRes {
  @ApiProperty({ description: '文章' })
  data: ArticleSummary;
}

export class DeleteArticle extends BaseRes {}

export class LoginRes extends BaseRes {
  @ApiProperty({ description: 'token' })
  data: {
    token: string
  };
}

export class RegRes extends BaseRes {
}

export class GetMenusRes extends BaseRes {
  @ApiProperty({ description: 'menus' })
  data: Array<MenuItemI>;
}

export class AddMenuRes extends BaseRes {
}

export class UpdateMenuRes extends BaseRes {
}

export class GetDictRes extends BaseRes {
  @ApiProperty({ description: 'dict' })
  data: DictI;
}

export class GetDicts extends BaseRes {
  @ApiProperty({ description: 'dict' })
  data: Array<DictI>;
}

export class UpdateDictRes extends BaseRes {}

export class DeleteDictRes extends BaseRes {}
