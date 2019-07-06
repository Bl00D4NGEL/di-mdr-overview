import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import House from 'src/modules/house';
import Division from 'src/modules/division';


@Component({
  selector: 'app-mdr',
  templateUrl: './mdr.component.html',
  styleUrls: ['./mdr.component.scss']
})
export class MdrComponent implements OnInit {
  divisions: Array<Division>;
  constructor(private cs: ConfigService) { }

  ngOnInit() {
    const self = this;
    this.cs.getMdr().subscribe((data: MdrData) => {
      // data.houses.map(x => new House(x));

      const divisions: Array<Division> = [];
      data.houses.map(house => {
        house.divisions.map(division => {
          division.houseName = house.houseName;
          const div = new Division(division);
          divisions.push(div);
        });
      });
      self.divisions = divisions;
    });
  }

  getHouseImage(house: string): string {
    house = house.replace('House - ', '');
    return 'assets/images/house-' + house.toLowerCase() + '.png';
  }

  getDivisionImage(division: string): string {
    division = division.replace('DI-', '');
    return 'assets/images/div-' + division.toLowerCase() + '.svg';
  }

  getGameImage(division: Division): string {
    return 'assets/images/game-' + division.getGameImageName() + '.png';
  }

  getDivisionCommander(division: Division): string {
    if (division.commanders.length > 0) {
      return division.commanders[0].name;
    } else {
      return '';
    }
  }

  getDivisionVice(division: Division): string {
    if (division.vices.length > 0) {
      return division.vices[0].name;
    } else {
      return '';
    }
  }
}

interface MdrData {
  fileName: string;
  houses: Array<House>;
}
