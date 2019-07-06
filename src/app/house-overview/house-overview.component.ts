import { Component, OnInit } from '@angular/core';
import Member from 'src/modules/memberTypes/member';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config.service';
import House from 'src/modules/house';

@Component({
  selector: 'app-house-overview',
  templateUrl: './house-overview.component.html',
  styleUrls: ['./house-overview.component.scss']
})
export class HouseOverviewComponent implements OnInit {

  house: House = new House();
  members: Array<Member> = [];
  constructor(private route: ActivatedRoute, private cs: ConfigService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const houseName = params.get('houseName');
      this.cs.getHouse(houseName).subscribe((data: House) => {
        this.house.parse(data);
        this.members = this.house.getMembers();
      });
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

  getRoleImage(member: Member): string {
    const roleName = member.roleImageName();
    if (roleName === undefined) {
      return undefined;
    } else {
      return 'assets/images/role-' + member.roleImageName() + '.png';
    }
  }
}
