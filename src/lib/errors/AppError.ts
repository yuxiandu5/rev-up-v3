export class AppError extends Error {
  status: number;
  code?: string;
  expose: boolean;

  constructor(message: string, status: number, code?: string, expose: boolean = true) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.expose = expose;
  }
}


