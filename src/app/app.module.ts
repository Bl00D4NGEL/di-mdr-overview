import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { ConfigService } from './config.service';
import { MdrComponent } from './mdr/mdr.component';
import { HttpClientModule } from '@angular/common/http';
import { DivisionOverviewComponent } from './division-overview/division-overview.component';
import { HouseOverviewComponent } from './house-overview/house-overview.component';
import { TagToolComponent } from './tag-tool/tag-tool.component';

@NgModule({
  declarations: [
    AppComponent,
    MdrComponent,
    DivisionOverviewComponent,
    HouseOverviewComponent,
    TagToolComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: MdrComponent },
      { path: 'division/:divisionName', component: DivisionOverviewComponent },
      { path: 'house/:houseName', component: HouseOverviewComponent },
      { path: 'tools', component: TagToolComponent }
    ])
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent],
})
export class AppModule { }
