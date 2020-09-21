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
}

export class Article extends ArticleSummary {
  @ApiProperty()
  content: string;
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