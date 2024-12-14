export class UserRole {
  constructor(readonly value: 'user' | 'admin') {}

  equals(role: UserRole): boolean {
    return this.value === role.value;
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  isUser(): boolean {
    return this.value === 'user';
  }
}
