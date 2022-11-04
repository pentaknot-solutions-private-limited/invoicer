import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DOCXGenerator } from '../docx-manager/docx.generator';
import * as docx from 'docx-preview/dist/docx-preview';
import { HttpClient } from '@angular/common/http';
import { ReviewService } from 'src/app/shared/_http/review.service';

@Component({
  selector: 'sscp-panel',
  templateUrl: './sscp-panel.component.html',
  styleUrls: ['./sscp-panel.component.scss'],
  providers: [ReviewService],
})
export class SscpPanelComponent implements OnInit, OnChanges {
  // Input & Output Params
  @Input() title: any;
  @Input() isEditing: boolean;
  @Input() variableTextValue: any = 'Editor Here!'; // Need to parse
  @Input() loading: boolean;
  @Input() isSaving: boolean;
  @Input() currentVariableAndDevice: any;
  @Input() allVariables: any[] = [];
  // Output
  @Output() documentAction: EventEmitter<string> = new EventEmitter();
  @Output() currentVariableAndDeviceChange: EventEmitter<any> =
    new EventEmitter();
  @Output() variableTextValueChange = new EventEmitter<any>();
  @Output() isSavingChange = new EventEmitter<any>();
  @Output() loadingChange = new EventEmitter<any>();

  // View Childs
  @ViewChild('documentPlaceholder')
  documentPlaceholder: ElementRef<HTMLElement>;

  tempVariableTextValue: any;
  completeXMLDataAsOne: any;
  updatedVariableXML: any;

  // getter / setter
  get currentVariable() {
    return this.allVariables.find(
      (variable) => variable.id == this.currentVariableAndDevice.variableId
    );
  }

  get currentDevice() {
    return this.allVariables
      .find(
        (variable) => variable.id == this.currentVariableAndDevice.variableId
      )
      .devices.find(
        (device) => device.deviceId == this.currentVariableAndDevice.deviceId
      );
  }

  constructor(private http: HttpClient, private reviewService: ReviewService) {}

  ngOnInit(): void {}

  ngOnChanges(e) {
    this.tempVariableTextValue = this.variableTextValue;
  }

  // Update Changed Value Logic
  changeXMLWithUpdatedValue() {
    return new Promise((resolve, reject) => {
      this.updatedVariableXML = this.completeXMLDataAsOne.replace(
        //  this.completeXMLDataAsOne.replace(
        this.tempVariableTextValue,
        this.variableTextValue
      );
      resolve(this.updatedVariableXML);
      // resolve(this.completeXMLDataAsOne);
    });
    // console.log(this.completeXMLDataAsOne);
  }

  // Extract Highlighter Logic
  extractSelectionKeywords = (arg: string) => {
    // Step A - starting extraction
    console.log('Step A - starting extraction ');
    console.log(arg);

    // Step B - Find w:shd tag in XML (Higlighter)
    const highlighted = arg.slice(arg.indexOf('<w:shd'));
    console.log('Step B - Find w:shd tag in XML (Higlighter)');
    console.log(highlighted);

    // Step C - Extract Text from <w:t> (Text)

    const textPart = highlighted.match(/<w:t>(.*?)<\/w:t>/g);
    console.log('Step C - Extract Text from <w:t> (Text)');
    console.log(textPart);

    // Step D - Return Extracted text without tags
    const returnableText = textPart.map(function (val) {
      return val.replace(/<\/?w:t>/g, '');
    });
    console.log('Step D - Return Extracted text without tags');
    console.log(returnableText[0]);

    return returnableText[0];
  };

  // Handle Events

  handleEditorAction(type: any) {
    switch (type) {
      case 'save':
        // Update Variable in XML
        this.changeXMLWithUpdatedValue().then((data: any) => {
          // this.updatedVariableXML = data;
          // console.log(data);
          // API Call Here
          this.updateVariableValue();
        });

        break;

      default:
        // Cancel
        this.variableTextValue = this.tempVariableTextValue;
        break;
    }
    this.isEditing = false;
  }

  // Events
  handleClick(type: string) {
    switch (type) {
      case 'edit':
      // WIP
      // this.isEditing = true;
      // break;
      case 'prev':
      case 'skip':
      case 'complete':
        this.documentAction.emit(type);
        break;

      default:
        break;
    }
  }

  afterUpdateVariableCalled() {
    // Dummy
    this.variableTextValueChange.emit(this.variableTextValue);
    this.loading = false;
    this.loadingChange.emit(this.loading);
    this.isEditing = false;
  }

  // API Calls

  updateVariableValue() {
    this.loading = true;
    this.loadingChange.emit(this.loading);
    // Selected Variable/ Device Details
    const payload = {
      jobId: 1,
      variableId: 3,
      deviceId: 2,
      // value: this.variableTextValue,
      value: this.updatedVariableXML,
    };
    this.reviewService.updateVariableValue(payload).subscribe(
      (res: any) => {
        console.log(res);
        this.afterUpdateVariableCalled();
      },
      (err: any) => {
        console.log(err);
        setTimeout(() => {
          this.afterUpdateVariableCalled();
        }, 300);
      }
    );
  }
  onSelectDevice(device) {
    this.currentVariableAndDevice.deviceId = device.deviceId;
    this.currentVariableAndDeviceChange.emit(this.currentVariableAndDevice);
  }

  onValueChange(value: any) {
    this.variableTextValue = value.target.innerText;
  }

  handleInputBlur(event: any) {
    // console.log(event);
    // Do anything (reasign default value)
  }
}
