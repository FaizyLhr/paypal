import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader.component';
import { DayPipe } from './pipes/days.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { NumericOnlyDirective } from './directives/numeric.directive';
import { BrowserModule } from '@angular/platform-browser';

const SHARED_PIPES = [DayPipe, StatusPipe];

const SHARED_COMPONENTS = [LoaderComponent];

const SHARED_DIRECTIVES = [NumericOnlyDirective];

const SHARED_MODULES: any = [];

@NgModule({
  declarations: [SHARED_PIPES, SHARED_COMPONENTS, SHARED_DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    SHARED_MODULES,
  ],
  exports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    SHARED_PIPES,
    SHARED_COMPONENTS,
    SHARED_MODULES,
    SHARED_DIRECTIVES,
  ],
})
export class SharedModule {}
