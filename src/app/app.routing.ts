import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SearchDropdownComponent } from './components/search-dropdown/search-dropdown.component';


const routes: Routes = [
    {
        path: 'search', component: SearchDropdownComponent
    },
    {
        path: '', component: LoginComponent
    },


];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
