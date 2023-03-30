import { Question } from "./question";

export class Theme {
  public id: number;
  public title: string;
  public estimatedTime: number;
  public text: string;
  public learned: boolean;
  public questions: Array<Question>;

  constructor(data:any) {
    this.id = data.id;
    this.title = data.title;
    this.estimatedTime = data.estimatedTime;
    this.text = data.text;
    this.learned = data.learned;
    this.questions = data.questions;
  }

}
