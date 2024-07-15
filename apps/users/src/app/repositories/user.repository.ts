import { AbstractRepository } from '@libs/common/src/database/abstract.repository';

import { Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { User, UserDocument } from '@libs/models/src/schemas/user.schema';


export class UserRepository extends AbstractRepository<UserDocument> {

  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    private readonly _userModel: Model<UserDocument>,
    @InjectConnection()
    private readonly _connection: Connection,
  ) {

    super(_userModel, _connection);
  }

  async createUser(
    user: Partial<Omit<UserDocument, '_id'>>,
    options?: SaveOptions,
  ): Promise<UserDocument> {
    return this.create(user, options);
  }

  async findUser(
    filterQuery: FilterQuery<UserDocument>,
    options?: QueryOptions,
  ): Promise<Partial<UserDocument>> {
    return this.findOne(filterQuery, options);
  }

  async findUserAndUpdate(
    filterQuery: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options?: QueryOptions
  ) {
    return this.findOneAndUpdate(filterQuery, update, options);
  }

  async upsertUser(
    filterQuery: FilterQuery<UserDocument>,
    user: Partial<UserDocument>,
  ) {
    return this.upsert(filterQuery, user);
  }

  async findAllUsers(): Promise<UserDocument[] | null> {
    return this.findAll();
  }

  async findUserById(userId: string): Promise<UserDocument | null | undefined> {
    return this.findById(userId);
  }

  async findOneAndUpdateUser(
    filterQuery: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options?: QueryOptions
  ) {
    return this.findOneAndUpdate(filterQuery, update, options);
  }

  async deleteUser(filterQuery: FilterQuery<UserDocument>) {
    return this.deleteOne(filterQuery);
  }

}
