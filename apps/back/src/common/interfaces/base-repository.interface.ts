export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findOne(id: number): Promise<T>;
    create(data: T): Promise<T>;
    update(id: number, data: T): Promise<T>;
    delete(id: number): Promise<void>;
}