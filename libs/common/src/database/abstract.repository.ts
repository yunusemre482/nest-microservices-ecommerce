import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  PipelineStage,
  QueryOptions,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
  MongooseUpdateQueryOptions,
  ClientSession,
} from 'mongoose';

import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {

  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) { }

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {

    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    const savedDocument = await createdDocument.save(options)

    return savedDocument as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
  ): Promise<Partial<TDocument>> {
    const document = await this.model.findOne(filterQuery, {}, options);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, options);

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>, options?: QueryOptions) {
    return this.model.find(filterQuery, {}, options);
  }

  async findById(id: string, options?: QueryOptions): Promise<TDocument | null | undefined> {
    return await this.model.findById(id, {}, options);
  }

  async findAll(options?: QueryOptions): Promise<TDocument[] | null> {
    return await this.model.find({}, {}, options);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<TDocument[] | undefined | null> {
    return await this.model.aggregate(pipeline);
  }

  async aggregateOne(pipeline: PipelineStage[]): Promise<TDocument | undefined | null> {
    return await new Promise((resolve) => {
      this.model.aggregate(pipeline).then((result) => {
        resolve(result[0]);
      });
    }
    );
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<TDocument>,
    options?: (MongooseUpdateQueryOptions & MongooseUpdateQueryOptions<TDocument>) | null
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, updated, options);
  }

  async updateMany(
    filter: FilterQuery<TDocument>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<TDocument>,
    options?: (MongooseUpdateQueryOptions & MongooseUpdateQueryOptions<TDocument>) | null
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(filter, updated, options);
  }

  async countDocuments(filterQuery: FilterQuery<TDocument>) {
    return await this.model.countDocuments(filterQuery);
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async commitTransaction(session: ClientSession
  ): Promise<void> {
    return await session.commitTransaction();
  }

  async abortTransaction(session: ClientSession): Promise<void> {
    return await session.abortTransaction();
  }

  async endSession(session: ClientSession): Promise<void> {
    return await session.endSession();
  }

  async withTransaction<T>(
    fn: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.startTransaction();

    try {
      const result = await fn(session);
      await this.commitTransaction(session);
      return result;
    } catch (error) {
      await this.abortTransaction(session);
      throw error;
    } finally {
      await this.endSession(session);
    }
  }

}
