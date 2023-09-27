import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSidenav } from '@angular/material/sidenav';

import { BehaviorSubject } from 'rxjs';

import { MatTreeModule} from '@angular/material/tree';
import {MatTreeFlattener} from '@angular/material/tree';

import {MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';


import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoMaterialModule} from './material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { TreeChecklistExample } from './components/tree-checklist/tree-checklist/tree-checklist.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SearchDropdownComponent } from './components/search-dropdown/search-dropdown.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SidebarComponent } from './components/sidebar/sidebar.component';






@NgModule({
  declarations: [
    AppComponent, 
    HeaderComponent,
    FooterComponent,
    TreeChecklistExample,
    SearchDropdownComponent,
    SidebarComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatCheckboxModule,
    MatSelectModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [TreeChecklistExample],
  // declarations: [TreeChecklistExample],
  // bootstrap: [TreeChecklistExample],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})

export class AppModule { }
