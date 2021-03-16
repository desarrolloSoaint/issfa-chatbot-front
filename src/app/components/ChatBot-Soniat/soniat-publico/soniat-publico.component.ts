import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Country } from 'app/models/country';
import { Router } from '@angular/router';
import { Clientes } from 'app/models/clientes';
import { FormBuilder, Validators } from '@angular/forms';
import { AvatarChat } from 'app/models/avatarChat';
import { SoniatService } from 'app/services/soniat/soniat.service';
import Swal from 'sweetalert2';
import { PrivateClient } from 'app/models/private-contact';
import { ThemeSoniatService } from 'app/services/themeSoniat/theme-soniat.service';
import { Colors } from 'app/models/colors';
import { Url_Back } from 'app/config/config';
import { Personas } from 'app/models/persona';
import Message from '../message/message';
import { uuid } from 'uuidv4';
import { timeStamp } from 'console';
import { personaISSFA } from './json';
import { element } from 'protractor';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-soniat-publico',
  templateUrl: './soniat-publico.component.html',
  styleUrls: ['./soniat-publico.component.scss']
})

export class SoniatPublicoComponent implements OnInit {
  public clientes = new Clientes('', null, null, null);
  public personas = new Personas('', null, null);
  @ViewChildren(MessageComponent) childrenMessages: QueryList<MessageComponent>
  public clientesPrivado = new PrivateClient('', null, '', null, '');
  public errorMsg: string;
  public errorMsgPreguntas:string;
  public msgPreguntas:string;
  public errorMsg1: string;
  public mensaje: string;
  public result: any;
  id: Country[] = [];
  avatarChat: AvatarChat[] = [];
  mostrar: boolean = false;
  showContent: number;
  getId: number;
  getIdPrivate:number;
  avatar_chat: string;
  prueba: string;
  img: string;
  mostrarBoton:boolean=true;
  ocultarBotonPregunta:boolean=false;
  messages: Message[] = [];
  form;
  formPreguntas;
  formC;
  question = ['Cuál es su fecha nacimiento?', 'Cuantos número de dependientes registrados posee?', 'Que grupo sanguineo es?', 'Que número de afiliación posee?', 'Diga su estado civil', 'Cuánto tiempo de servicio tiene?', 'Digite su correo electrónico registrado', 'Cual es el nombre de esposa(o)?'];
  pregunta: string;
  preguntas:any[] =[];
  cont : number = 0;
  asnwer:string = "";
  intentos : number = 0;
  public  color: Colors = new Colors();
  public colors: Colors[] = [];
  tittleChatBox:string="ISSFA";


  public themeChatbot = {
    'theme-yellow': false,
    'theme-blue': false,
    'theme-orange': false,
    'theme-green': false,
    'theme-purple': false,
    'theme-red': false,
    'theme-yellowDark': false,
    'theme-blueDark': false,
    'theme-orangeDark': false,
    'theme-greenDark': false,
    'theme-purpleDark': false,
    'theme-redDark': false
  };

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public soniatService: SoniatService,
    public themeService: ThemeSoniatService,) {
    this.form = formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern(/^[1-9]\d{1,10}$/)]],
    });   
  }

  ngOnInit() {
    this.authService.country().subscribe(
      data => {
        this.id = data;
      },
      err => {
        console.log(err);
      }
    );

    this.authService.getAvatarChat().subscribe(
      data => {
        this.avatarChat = data;
        this.avatar_chat = this.avatarChat[0].avatarChat;
        this.img =  Url_Back+'avatar/uploads/img/' + this.avatar_chat;
      },
      err => {
        console.log(err);
      }
    );
    this.showContent = 2;
    this.getThemeChatbot();
  }

  ngAfterViewInit(): void {
    this.childrenMessages.changes.subscribe((messages: QueryList<MessageComponent>) => {
      if (messages && messages.last && messages.last.messageInput) {
        this.scrollToMessage('last-message', 'end');
      }
    })
  }
  scrollToMessage(id: string, blockString: ScrollLogicalPosition) {
    const messageElem: HTMLElement = document.getElementById(`${id}`)
    if (messageElem) messageElem.scrollIntoView({ behavior: 'smooth', block: blockString })
  }

  validarCedula(f) {

    if(f.value.cedula == personaISSFA.cedula){
      
      this.mostrarBoton=false;      
      this.questionRandom();
      this.ocultarBotonPregunta = true;
            
    }else{
      this.errorMsg = "Disculpe, no se encuentra registrado.";
      setTimeout(() => { this.errorMsg = ""; }, 2500)
    }

  }
 
  validarPreguntas(f){
      this.saveMessage(f.value.asnwerForm, true);
      if(f.value.questionForm == this.question[0] && f.value.asnwerForm == personaISSFA.fecha_nacimiento){
        this.msgAsnwer();
        this.cont = this.cont +1;      
      }else if(f.value.questionForm == this.question[1] && f.value.asnwerForm == personaISSFA.numero_dependiente){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else if(f.value.questionForm == this.question[2] && f.value.asnwerForm == personaISSFA.grupo_sanguineo){
        this.msgAsnwer();
        this.cont = this.cont +1;         
      }else if(f.value.questionForm == this.question[3] && f.value.asnwerForm == personaISSFA.numero_afiliacion){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else if(f.value.questionForm == this.question[4] && f.value.asnwerForm == personaISSFA.estado_civil){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else if(f.value.questionForm == this.question[5] && f.value.asnwerForm == personaISSFA.tiempo_servicio){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else if(f.value.questionForm == this.question[6] && f.value.asnwerForm == personaISSFA.email){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else if(f.value.questionForm == this.question[7] && f.value.asnwerForm == personaISSFA.nombre_parentesco){
        this.msgAsnwer();
        this.cont = this.cont +1;   
      }else{
        this.errorMsgPreguntas = "Disculpe, respuesta incorrecta.";
        setTimeout(() => { this.errorMsgPreguntas = ""; }, 2500)
        this.intentos = this.intentos + 1;
      }

      if(this.cont==3){
        this.ingresarCHAT();
      }else if(this.intentos==3){
        this.router.navigateByUrl('login');
        this.swalMaximoIntentos()
      }else{
        this.questionRandom();
      }

      
    
  }

  questionRandom(){
    this.pregunta = this.question[Math.floor(this.question.length * Math.random() )]; 
      this.saveMessage(this.pregunta,false)

      this.formC = this.formBuilder.group({
        questionForm: [this.pregunta],
        asnwerForm: ['']
      })
  }

  msgAsnwer(){
    this.msgPreguntas = "Respuesta correcta";
    setTimeout(() => {
      this.msgPreguntas = "";
    }, 2500)
  }

  ingresarCHAT(){
    var moment = require("moment");
    var current_timestamp = moment().format("ddd MMM D YYYY 00:00:00");
    var current_timestamp = moment(new Date());

    this.result = {
      email: personaISSFA.email, created_at: current_timestamp._i, id_country: {
        id: 103,
      },
    };

    this.authService.guardar(this.result).subscribe(
      response => {
        if (response.mensaje == 'Cliente registrado.') {
          this.filterClientPublic();
        }
      }, (err) => {
        this.errorMsg = err;
        console.log(this.errorMsg, 'errorfront');
        throw err;
    });
  }

  saveMessage(question: string, userMessage: boolean): void {
    this.messages.push({
      userMessage: userMessage,
      value: question,
      id: uuid()
    })
  }

  toggleBox() {
    this.mostrar = !this.mostrar;
  }

  filterClientPublic() {
    const email = personaISSFA.email;
    this.soniatService.getPublic().subscribe(response => {
      const filter = response.reverse()[0].email;
      if (email == filter) {
         console.log("Email Coincide")
        this.getId = response[0].id;
        console.log(this.getId);
        this.setClientPublic();
        this.setClientPrivate();
        this.router.navigateByUrl('soniat');
      } else {
         console.log("Email No Coincide")
        this.swalWarning()
      }
    })
  }

  setClientPublic() {
    const id = this.getId;
    this.soniatService.setId(id);
    this.getIdPrivate = undefined
  }

  filterClientPrivate() {
    const email = this.clientesPrivado.email;
    this.soniatService.getPrivate().subscribe(response => {
      const filter = response.reverse()[0].email;
      if (email == filter) {
        // console.log("Email Coincide")
        this.getIdPrivate = response[0].id;
        this.setClientPrivate();
        this.setClientPublic();
        this.router.navigateByUrl('soniat');
      } else {
        // console.log("Email No Coincide")
        this.swalWarning()
      }
    })
  }

  setClientPrivate() {
    const id = this.getIdPrivate;
    this.soniatService.setIdPrivate(id);
    this.getId = undefined;
  }

  public getThemeChatbot() {
    this.themeService.getTheme().subscribe(response => response.forEach((color: Colors) => {
      this.colors.push(color);
      this.setThemeChatbot(response[0].color);
      console.log(response);
    }))
  }

  private setThemeChatbot(theme: string) {
    const themesKeys = Object.keys(this.themeChatbot);
    for (const k of themesKeys) {
      this.themeChatbot[k] = false;
    }
    if (this.themeChatbot[theme] !== undefined) {
      this.themeChatbot[theme] = true;
    } else {
      //Tema por defecto
      this.themeChatbot['theme-blue'] = true;
    }
  }

  //////////////////////////////Swal Alert ////////////////////////////
  swalWarning() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'warning',
      title: 'No fue Encontrado el Cliente Registrado'
    })
  }

  swalMaximoIntentos() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'warning',
      title: 'Se alcanzo el maximo de intentos'
    })
  }
}



