import { Answer } from "./api-awnser.model";

export class Member {
  name: string;
  awnsers: Answer[];

  constructor(name: string, ...awnsers: Answer[]) {
    this.name = name;
    this.awnsers = awnsers ?? [];
  }
}
