import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MemberService } from './services/member.service';
import { Member } from './models/api-member.model';
import { MatSliderModule } from '@angular/material/slider';
import { MatRippleModule } from '@angular/material/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Answer } from './models/api-awnser.model';
import { FormsModule } from '@angular/forms';

class AnalysysAsset {
  filename: string;
  musicname: string;
  audio?: HTMLAudioElement;

  isPlaying: boolean = false;
  currentTime: number = 0;

  constructor(
    platformId: Object,
    filename: string,
    musicname: string
  ) {
    this.filename = filename;
    this.musicname = musicname;

    if (isPlatformBrowser(platformId)) {
      this.audio = new Audio(`../assets/audios/${filename}.mp3`);

      // play	          | O áudio começa a tocar.
      // pause	        | O áudio é pausado.
      // ended	        | O áudio termina.
      // timeupdate     | O tempo de reprodução muda (geralmente a cada fração de segundo).
      // canplay        | O áudio pode ser reproduzido sem precisar de mais dados.
      // canplaythrough | O áudio pode ser reproduzido até o final sem interrupções.
      // waiting        | A reprodução está pausada enquanto mais dados são carregados.
      // stalled        | O navegador está tentando carregar o áudio, mas não recebe dados.
      // error          | Ocorre um erro ao carregar ou reproduzir o áudio.
      // loadstart      | O carregamento do áudio começou.
      // loadedmetadata | Os metadados do áudio (duração, codecs, etc.) foram carregados.
      // loadeddata     | Os primeiros dados do áudio foram carregados.
      // seeking        | O usuário está a avançar/retroceder no áudio.
      // seeked         | O usuário terminou de procurar um novo ponto no áudio.
      // volumechange   | O volume do áudio muda.
      // ratechange     | A velocidade de reprodução muda.
      // durationchange | A duração do áudio muda.
      // abort          | O carregamento do áudio foi interrompido.

      this.audio.addEventListener('play', (data) => {
        this.isPlaying = true;
      });
      this.audio.addEventListener('ended', (data) => {
        this.isPlaying = false;
        if (this.audio)
          this.audio.currentTime = 0;
      });
      this.audio.addEventListener('timeupdate', (data) => {
        this.currentTime = this.audio ? this.audio.currentTime : 0;
      });
    }
  }

  playAudio() {
    if (this.audio) {
      if (!this.isPlaying) {
        this.audio.play();
      } else {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  changeVolume(event: Event) {
    if (this.audio) {
      const input = event.target as HTMLInputElement;
      this.audio.volume = parseFloat(input.value);
    }
  }

  changeTime(event: Event) {
    if (this.audio) {
      const input = event.target as HTMLInputElement;
      this.audio.currentTime = parseFloat(input.value);
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    FormsModule,
    MatRippleModule,
    MatSliderModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  currentMember: Member;
  members: Member[] = [];
  assets: AnalysysAsset[] = [];

  sampleList = ['1995', '22', '2', '15'];
  sampleListOdds: string[] = [];
  sampleListEvens: string[] = [];

  submited = false;

  authenticated: boolean = false;
  rootPassword: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private memberService: MemberService,
  ) {
    this.currentMember = new Member('');
    //
    // loading music data
    //
    this.assets = [
      new AnalysysAsset(this.platformId, 'consagracao',           /**/ "Consagração"),
      new AnalysysAsset(this.platformId, 'e-tudo-sobre-voce',     /**/ "É Tudo Sobre Você"),
      new AnalysysAsset(this.platformId, 'ele-e-exaltado',        /**/ "Ele é Exaltado"),
      new AnalysysAsset(this.platformId, 'grande-e-o-senhor',     /**/ "Grande é o Senhor"),
      new AnalysysAsset(this.platformId, 'lugar-secreto',         /**/ "Lugar Secreto"),
      new AnalysysAsset(this.platformId, 'meu-respirar',          /**/ "Meu Respirar"),
      new AnalysysAsset(this.platformId, 'missoes',               /**/ "Missões"),
      new AnalysysAsset(this.platformId, 'quebrantado',           /**/ "Quebrantado"),
      new AnalysysAsset(this.platformId, 'toda-sorte-de-bencaos', /**/ "Toda Sorte de Bençãos")
    ];
    //
    // requesting members data
    //
    this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data;
      },
      error: (error) => console.error('Erro ao buscar membros:', error),
    });
  }

  setCurrentMember(selected: Member) {
    this.currentMember = selected;
    this.assets.forEach(asset => {
      if (!this.currentMember.awnsers.find(awnser => awnser.filename === asset.filename)) {
        this.currentMember.awnsers.push(new Answer(asset.filename));
      }
    });
  }
  getMusicName(filename: string) {
    return this.assets.find(a => a.filename === filename)?.musicname;
  }

  drop(event: CdkDragDrop<string[]>) {
    const item = Number(event.item.data);
    if ((event.container.id === 'dnd-evens' && item % 2 !== 0) ||
        (event.container.id === 'dnd-odds' && item % 2 === 0)) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  submit() {
    this.memberService.putAwnsers(this.currentMember).subscribe({
      next: (data) => {
        this.members = data;
        this.submited = true;
      },
      error: (error) => console.error('Erro enviar respostas:', error),
      complete: () => {
        this.currentMember = new Member('');
      }
    });
  }

  authenticate() {
    this.memberService.postAuth(this.rootPassword).subscribe({
      next: () => {
        this.authenticated = true;
      },
      error: (error) => console.error('Erro de autenticação', error)
    });
  }

  resetForm() {
    this.submited = false;
    this.currentMember = new Member('');
    this.sampleList = ['1995', '22', '2', '15'];
    this.sampleListOdds = [];
    this.sampleListEvens = [];
  }
  resetAwnser(name: string) {
    this.memberService.putAwnsers(this.currentMember).subscribe({
      next: (data) => {
        this.members = data;
        this.submited = true;
      },
      error: (error) => console.error('Erro enviar respostas:', error),
      complete: () => {
        this.currentMember = new Member('');
      }
    });
  }
}
