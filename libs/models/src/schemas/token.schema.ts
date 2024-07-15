


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (doc, ret: Record<string, any>) => {
      ret.id = ret._id;

      delete ret._id;

      return ret;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      return ret;
    },
  },
})
export class Token {
  @Prop({ type: String, required: true })
  token!: string;

  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
