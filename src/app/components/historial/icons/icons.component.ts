import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import * as Chartist from 'chartist';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import{ Historial } from 'app/models/history'
import { UserRegisterService } from 'app/services/usuario/user-register.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscriber } from 'rxjs';
import { HistoryService } from 'app/services/history/history.service';
import { hour } from 'app/models/hour';
import { month } from 'app/models/month';
import { count } from 'app/models/count';
import { countexp } from 'app/models/conutExp';
import { frepu } from 'app/models/prefrepu';
import {  Privfre } from 'app/models/prepriv';
import { ModaltiemresComponent } from '../timeresp/modaltiemres/modaltiemres.component';
import { timeres } from 'app/models/timeres';
import { Clientes } from 'app/models/clientes';
import { PrivateContact } from 'app/models/private-contact';
import { Injectable } from '@angular/core';
import { param } from 'jquery';
import  Swal  from 'sweetalert2';
import { Historialecu } from 'app/models/historyencu';
import { TabladosComponent } from 'app/components/historial/tablados/tablados.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  // displayedColumns: string[] =  ['Clientes','Question_client', 'Response_soniat', 'Time_question_client','Time_response_soniat','Expired_time'];
  // dataSource = ELEMENT_DATA;

  public load: boolean;

  public titulo: string = "Historial Conversaciones del ChatBot"; 
  dataSource: MatTableDataSource<Historial>;

  // dataSourcese: MatTableDataSource<Historialecu>;

  displayedColumnss =  ['Cliente','Quedo Conforme con la informacion suministrada','evaluando la calidad del chatbot,como lo identifica', 'volveria a recurrir a preguntarle al chatbot'];
  displayedColumns =  ['Cliente','Question_client', 'Response_soniat', 'Time_question_client','Time_response_soniat','Expired_time'];
 
  @ViewChild (MatPaginator, {static:true }) paginator:MatPaginator;
  @ViewChild (MatPaginator, {static:true }) aapaginator:MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  //'Clientes Privados'
  public hist: Historial[]=[];                           
  public histe: Historialecu[]=[];
  public historial: Historial = new Historial(); 
  public historials: Historialecu = new Historialecu(); 

  public clientes: Clientes[] = [];
  public clientes2: Clientes= new Clientes(1,'pivot',1, null);
  public clientes3: PrivateContact= new PrivateContact();
  public PrivateContact: PrivateContact[] = [];
  // public privado:Privfre = new Privfre();
  otra: any;
  info: any = {};
emailpub: string[];
  isLogin = false;
  roles: string[];
  authority: string;
  tokenService: any;
  router: any;
 email: string [];
cantidad:string[];
public hor: hour[]=[];
public uno:Array <any>[]=[];
 time:string;
pivote:number;
  public mon: month[]=[];
 public count: count[]=[];
public countexp: countexp[]=[];
 frepu: any={};
 public privfre: any []=[];
dato: any;
id:number;
  constructor(private userRegister:UserRegisterService, public dialog: MatDialog,private history:HistoryService
   ) { 
    this.load = false;
  }

  ngOnInit() {
    setTimeout(() => {
      this.load = true;
    }, 3000);
    
    this.dataSource = new MatTableDataSource(this.hist);
    this.dataSource.paginator = this.paginator;


    this.history.getHour().subscribe(
      data=>{
        this.hor= data;

      }
    );
    
    this.history.getmonth().subscribe(
      data=>{
        this.mon= data;

      }
    );

   
     
    this.history.getcant().subscribe(
      data=>{
        this.count= data;

      }
    );

    this.history.getcantExp().subscribe(
      data=>{
        this.countexp= data;

      }
    );
    this.history.getfrepu().subscribe(
      data=>{
        this.frepu= data;
this.emailpub=this.frepu;
  
      }
    );
 
    this.history.getfrepri().subscribe( response =>{

      this.privfre = response
      this.email = this.privfre;
      }
    )
  

    this.userRegister.historial().subscribe(response => {
      if(response.length===0){
        this.swalAlert();
        console.log("No existe Data");
      }else{
        response.forEach((hist:Historial) => {
      
      this.hist.push(hist)
      this.dataSource.data=[];
      this.dataSource.data = this.hist.slice(0);
      for (let index = 0; index < this.dataSource.data.length; index++) {
        if (this.dataSource.data[index].id_client==null) {
          this.dataSource.data[index].id_client=this.clientes2;
          this.dataSource.data[index].id_client.email='';
          this.dataSource.data[index].id_client.id_country=this.dataSource.data[index].id_client_private.id_country.id;
        }else{
          if (this.dataSource.data[index].id_client.email!='') {
           this.dataSource.data[index].id_client_private=this.clientes3;
          this.dataSource.data[index].id_client_private.email='';
          this.dataSource.data[index].id_client_private.id_country=this.dataSource.data[index].id_client;
          this.dataSource.data[index].id_client_private.password='';
          }
        }
       
      }

      
    })

   
    }});
    
      
  
  }
  public openDialog1(hist:Historial) {

    const dialogRef = this.dialog.open(ModaltiemresComponent,{
      data:{
        id: hist.id
        
        
      }
      
    });
 
  }
 
  swalAlert(){
    let timerInterval
    Swal.fire({
      title: ' NO Posee Data',
      timer: 2000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }
}

