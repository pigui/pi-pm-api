export class User {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
