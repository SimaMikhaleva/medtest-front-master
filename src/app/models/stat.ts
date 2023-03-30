export class Stat {
    public id!: number;
    public name: string;
    public errorCount: number;
    public lastPass: number;
  
    constructor(stat:any){
      this.id = stat.id;
      this.name = stat.name;
      this.errorCount = stat.errorCount;
      this.lastPass = stat.lastPass;
    }
  }
  