export class ProjectStatus {
  constructor(private readonly value: 'initial' | 'blocked' | 'canceled') {}
}
