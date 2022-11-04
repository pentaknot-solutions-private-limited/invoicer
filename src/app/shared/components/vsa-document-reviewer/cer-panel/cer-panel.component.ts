import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DOCXGenerator } from '../docx-manager/docx.generator';
import * as docx from 'docx-preview/dist/docx-preview';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'cer-panel',
  templateUrl: './cer-panel.component.html',
  styleUrls: ['./cer-panel.component.scss']
})
export class CerPanelComponent implements OnInit {
  // Input & Output Params
  @Input() title: any;
  @Input() loading: boolean;

  // View Childs
  @ViewChild('documentPlaceholder') documentPlaceholder: ElementRef<HTMLElement>;

  constructor() {
    this.loading = false;
   }

  ngOnInit(): void {
  }

}
