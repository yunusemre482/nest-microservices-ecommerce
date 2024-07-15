import { IsNumber, IsOptional, IsString } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class QueryParamsDTO {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  filter?: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  fields?: string;

  @IsString()
  @IsOptional()
  sortBy = "createdAt";

  @IsString()
  @IsOptional()
  order = "desc" || "asc";

  // NOTE : https://typescript-eslint.io/rules/no-inferrable-types
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit = 10;

  @IsString()
  @IsOptional()
  query = "{}";

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  @Expose()
  get sortStage(): { [key: string]: number } {
    return {
      [this.sortBy]: this.order === "desc" ? -1 : 1,
    };
  }

  @Expose()
  get projection(): { [key: string]: number } {
    if (!this.fields) {
      return {};
    }

    return this.fields.split(",").reduce((acc, field) => {
      acc[field] = 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  @Expose()
  get filterStage(): { [key: string]: unknown } {
    if (!this.filter) {
      return {};
    }

    return JSON.parse(this.filter);
  }

  @Expose()
  get searchStage(): { [key: string]: unknown } {
    if (!this.search) {
      return {};
    }

    return {
      $or: [
        {
          $text: {
            $search: this.search,
          },
        },
      ],
    };
  }

  @Expose()
  get queryStage(): { [key: string]: unknown } {
    if (!this.query) {
      return {};
    }

    return JSON.parse(this.query);
  }


}
