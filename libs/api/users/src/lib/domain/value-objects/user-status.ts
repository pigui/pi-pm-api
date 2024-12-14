export class UserStatus {
  constructor(readonly value: 'active' | 'blocked') {}

  equals(status: UserStatus): boolean {
    return this.value === status.value;
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isBlocked(): boolean {
    return this.value === 'blocked';
  }
}
