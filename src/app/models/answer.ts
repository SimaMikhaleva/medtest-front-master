export class Answer {
  public id: number;
  public text: string;
  public correct: boolean;

  constructor(data:any) {
    this.id = data.id;
    this.text = data.text;
    this.correct = data.correct;
  }

}
