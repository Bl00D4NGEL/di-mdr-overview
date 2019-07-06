import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config.service';
import Division from 'src/modules/division';
import Member from 'src/modules/memberTypes/member';

@Component({
  selector: 'app-division-overview',
  templateUrl: './division-overview.component.html',
  styleUrls: ['./division-overview.component.scss']
})
export class DivisionOverviewComponent implements OnInit {

  division: Division = new Division();
  members: Array<Member> = [];
  memberClass: Member;
  constructor(private route: ActivatedRoute, private cs: ConfigService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const divisionName = params.get('divisionName');
      this.cs.getDivision(divisionName).subscribe((data: Division) => {
        this.division.parse(data);
        this.members = this.division.getMembers();
      });
    });
  }

  getDivisionImage(division: string): string {
    division = division.replace('DI-', '');
    return 'assets/images/div-' + division.toLowerCase() + '.svg';
  }

  getGameImage(division: Division): string {
    return 'assets/images/game-' + division.getGameImageName() + '.png';
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
