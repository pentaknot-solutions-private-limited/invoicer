import { Component, Input } from "@angular/core";

@Component({
  selector: 'vsa-loader',
  templateUrl: './vsa-loader.component.html',
  styleUrls: ['./vsa-loader.component.scss']
})
export class VSALoaderComponent {
  @Input() loadingText?: string;
  constructor() {

  }

}
