import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tag-tool',
  templateUrl: './tag-tool.component.html',
  styleUrls: ['./tag-tool.component.scss'],

})
export class TagToolComponent implements OnInit {
  form: FormGroup;
  divisions: Array<string> = [];
  roles = [
      {id: 'SUB', name: 'Sub Player'},
      {id: 'TM', name: 'Member'},
      {id: 'RL', name: 'Roster Leader'},
      {id: '2IC', name: '2IC'},
      {id: 'TL', name: 'Team Leader'},
      {id: 'DV', name: 'Vice'},
      {id: 'DC', name: 'Commander'}
  ];
  tagList: string;
  redirectTime: number;
  newToolLink: string;

  constructor(private formBuilder: FormBuilder, private cs: ConfigService) {
    this.form = this.formBuilder.group({
      roles: new FormArray([]),
      divisions: ['']
    });

    this.redirectTime = 5;
    this.newToolLink = 'https://di-tools.d-peters.com';

    this.addRoleCheckboxes();
  }

  ngOnInit() {
    setInterval(() => {
      if (this.redirectTime === 0) {
        window.location.href = this.newToolLink;
      }
      if (this.redirectTime > 0) {
        this.redirectTime--;
      }
    }, 1000);
    /*
    this.cs.getDivisionNames().subscribe((data: Array<string>) => {

      this.divisions = this.divisions.concat(data);
    });
    */
  }

  private addRoleCheckboxes() {
    this.roles.map((o, i) => {
      const control = new FormControl(true);
      (this.form.controls.roles as FormArray).push(control);
    });
  }

  submit() {
    const selectedRoles = this.form.value.roles
      .map((v, i) => v ? this.roles[i].id : null)
      .filter(v => v !== null);
    const selectedDivisions = this.form.value.divisions;
    console.log(selectedDivisions, selectedRoles);

    this.cs.getTagList(selectedRoles, selectedDivisions).subscribe((data: string) => {
      console.log("GOT DATA: ", data);
      this.tagList = data;
    });
  }
}
