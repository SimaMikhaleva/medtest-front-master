import { Answer } from "./answer";

export class Question {
  public id: number;
  public text: string;
  public status: string;
  public favorite: boolean;
  public answers: Array<Answer>;

  constructor(data:any) {
    this.id = data.id;
    this.text = data.text;
    this.status = data.status;
    this.favorite = data.favorite;
    this.answers = data.answers;
  }
}
