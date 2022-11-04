import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'document-skeleton-loader',
  templateUrl: './document-skeleton-loader.component.html',
  styleUrls: ['./document-skeleton-loader.component.scss']
})
export class DocumentSkeletonLoaderComponent implements OnInit {
  @Input() id: string;
  constructor() { }

  ngOnInit(): void {
  }

}
