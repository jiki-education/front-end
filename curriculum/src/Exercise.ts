// Base class for all exercises

export abstract class Exercise {
  id: string;

  constructor() {
    this.id = Math.random().toString(36).substring(2, 11);
  }
}
