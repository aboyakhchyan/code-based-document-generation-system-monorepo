export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    create(data: T): Promise<T>;
    update(id: string, data: T): Promise<T>;
    delete(id: string): Promise<void>;
}