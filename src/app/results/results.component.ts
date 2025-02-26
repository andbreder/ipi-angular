import { Component } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Member } from '../models/api-member.model';

export interface Result {
  filename: string;
  classifications: Classification[];
}
export interface Classification {
  className: string;
  bad: number;
  good: number;
  neutral: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {

  members: Member[] = [];
  results: Result[] = [];

  constructor(
    private memberService: MemberService
  ) {
    const _classifications = ['A Letra', 'A Voz', 'O Tom', 'O Ritmo', 'Os Instrumentos'];
    this.memberService.getMembers().subscribe({
      next: (response) => {
        this.members = response.filter(x => x.awnsers.length > 0);
        response.forEach(data => {
          if (data.awnsers.length === 0)
            return;

          data.awnsers.forEach(awnser => {
            let music = this.results.find(r => r.filename === awnser.filename)
            if (!music) {
              this.results.push({
                filename: awnser.filename,
                classifications: _classifications.map(className => {
                  return {
                    className: className,
                    bad: awnser.bad.filter(x => x === className).length,
                    good: awnser.good.filter(x => x === className).length,
                    neutral: awnser.neutral.filter(x => x === className).length
                  }
                })
              });
            } else {
              music.classifications.forEach(classification => {
                _classifications.forEach(className => {
                  if (classification.className === className) {
                    classification.bad += awnser.bad.filter(x => x === className).length,
                      classification.good += awnser.good.filter(x => x === className).length,
                      classification.neutral += awnser.neutral.filter(x => x === className).length
                  }
                });
              });
            }
          })
        })
      }
    });
  }

  getMusicName(filename: string) {
    switch (filename) {
      case 'consagracao':               /**/ return "Consagração";
      case 'e-tudo-sobre-voce':         /**/ return "É Tudo Sobre Você";
      case 'ele-e-exaltado':            /**/ return "Ele é Exaltado";
      case 'grande-e-o-senhor':         /**/ return "Grande é o Senhor";
      case 'lugar-secreto':             /**/ return "Lugar Secreto";
      case 'meu-respirar':              /**/ return "Meu Respirar";
      case 'missoes':                   /**/ return "Missões";
      case 'quebrantado':               /**/ return "Quebrantado";
      case 'toda-sorte-de-bencaos':     /**/ return "Toda Sorte de Bençãos";
      default: return "NÃO SEI O NOME!"
    }
  }
}
