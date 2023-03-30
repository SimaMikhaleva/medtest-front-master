import { Question } from "./question";

export class Ticket {
  public id: number;
  public lastPass: Date;
  public errorCount: number;
  public status: string;
  public questions: Array<Question>;

  constructor(data:any) {
    this.id = data.id;
    this.lastPass = data.lastPass;
    this.errorCount = data.errorCount;
    this.status = data.status;
    this.questions = data.questions;
  }

}