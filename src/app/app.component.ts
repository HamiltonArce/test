import { Component } from '@angular/core';
import { EntityService } from './entity-service.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SoyYo - Test';

  lstEntities: any[] = [];
  lstEntitiesSelected: any[] = [];
  maxValue: number = 10;
  selected: any = null;
  saveUsername: boolean = false;
  entity: any
  idEntity: number = 0;
  sortName: boolean = false;
  sortDate: boolean = false;

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    contactMail: ['', [Validators.required, Validators.email]],
    contactName: ['', [Validators.required]],
    expirationDate: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)]],
    identificationNumber: ['', [Validators.required]],
    ipAddress: ['', []]
  });

  constructor(private readonly entityService: EntityService, private modalService: NgbModal, private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getEntities();
  }

  buildForm(): void {
    this.entity = this.lstEntitiesSelected.find((value: any) => value.entityId === this.idEntity) 
    this.form.patchValue({
      name: this.entity.name,
      identificationNumber: this.entity.identificationNumber,
      contactMail: this.entity.contactMail,
      contactName: this.entity.contactName,
      expirationDate: this.entity.expirationDate,
      ipAddress: this.entity.ipAddress,
      entityId: this.entity.entityId
    });
  }

  getEntities(): void {
    this.lstEntities = []
    for (let index = 1; index <= this.maxValue; index++) {
      this.entityService.getEntity(index).subscribe(response => {
        if (response.data) {
          response.data.checked = false;
          this.lstEntities.push(response.data)
        }
      })
    }
  }

  onSelectItem(param: any): void {
    let item = null;
    item = this.lstEntities.find((value: any) => value.entityId === param.entityId)  
    item.checked = !item.checked
    if(item.checked){
      this.lstEntitiesSelected.push(item)
    }else{
      let index = null;
      index = this.lstEntitiesSelected.findIndex((value: any) => value.entityId === param.entityId) 
      this.lstEntitiesSelected.splice(index, 1)
    }
  }

  onSortName(){
    //Ordenar ascendentemente
    if(this.sortName){
      this.lstEntitiesSelected = this.lstEntitiesSelected.sort(function (a, b) {
        if (a.name > b.name) {
          return -1;
      }
      if (b.name > a.name) {
          return 1;
      }
      return 0;
    });
    } // Ordenar descendentemente
    else{
      this.lstEntitiesSelected = this.lstEntitiesSelected.sort(function (a, b) {

      if (a.name < b.name) {
        return -1;
      }
      if (b.name < a.name) {
          return 1;
      }
      return 0;
      });
    }
    
  this.sortName = !this.sortName;
  }

  onSortDate(){
    //Ordenar ascendentemente
    if(this.sortDate){
      this.lstEntitiesSelected = this.lstEntitiesSelected.sort(function (a, b) {
        if (a.expirationDate > b.expirationDate) {
          return -1;
      }
      if (b.expirationDate > a.expirationDate) {
          return 1;
      }
      return 0;
    });
    } // Ordenar descendentemente
    else{
      this.lstEntitiesSelected = this.lstEntitiesSelected.sort(function (a, b) {

      if (a.expirationDate < b.expirationDate) {
        return -1;
      }
      if (b.expirationDate < a.expirationDate) {
          return 1;
      }
      return 0;
      });
    }
    
  this.sortDate = !this.sortDate;
  }
    
  open(content: any, entityId: any, isEdit: boolean) {
    
    this.idEntity = entityId;
    if(isEdit) {
      this.buildForm()
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if( result == 'delete'){
        let index = null;
        index = this.lstEntitiesSelected.findIndex((value: any) => value.entityId === this.idEntity) 
        this.lstEntitiesSelected.splice(index, 1)

        index = this.lstEntities.findIndex((value: any) => value.entityId === this.idEntity) 
        this.lstEntities.splice(index, 1)
      }
      else if( result == 'edit'){
        const updateEntity = {
          name: this.form.controls['name'].value,
          identificationNumber: this.form.controls['identificationNumber'].value,
          contactMail: this.form.controls['contactMail'].value,
          contactName: this.form.controls['contactName'].value,
          expirationDate: this.form.controls['expirationDate'].value,
          ipAddress: this.form.controls['ipAddress'].value,
          entityId: this.entity.entityId,
          logo: this.entity.logo,
          checked: true
        }
        let index = null;
        index = this.lstEntities.findIndex((value: any) => value.entityId === this.idEntity) 
        this.lstEntities[index].name = updateEntity.name

        index = this.lstEntitiesSelected.findIndex((value: any) => value.entityId === this.idEntity) 
        this.lstEntitiesSelected[index] = updateEntity
      }
    }, (reason) => {

    });
  }

}

