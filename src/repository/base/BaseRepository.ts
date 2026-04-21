import { Model, Document } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async findOne(filter: Record<string, any>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
    }
}
