export class ProjectStatus {
  constructor(readonly value: 'initial' | 'blocked' | 'canceled') {}

  equals(status: ProjectStatus): boolean {
    return this.value === status.value;
  }

  isInitial(): boolean {
    return this.value === 'initial';
  }

  isBlocked(): boolean {
    return this.value === 'blocked';
  }

  isCanceled(): boolean {
    return this.value === 'canceled';
  }
}
