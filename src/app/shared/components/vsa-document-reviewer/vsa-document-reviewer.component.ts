import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { xmlDocumentAPIFileNames } from '../../constants/document-viewer/document-api-files.contant';
import { documentTypes } from '../../constants/document-viewer/document-types.constant';
import { ReviewService } from '../../_http/review.service';
import { CerPanelComponent } from './cer-panel/cer-panel.component';
import { DocxDecompressedXMLStrucuture } from './docx-manager/docx-file-structure.model';
import { DOCXGenerator } from './docx-manager/docx.generator';
import { DOCXRenderer } from './docx-manager/docx.renderer';
import { SscpPanelComponent } from './sscp-panel/sscp-panel.component';
import { VariablesPanelComponent } from './variables-panel/variables-panel.component';
import { JoyrideService } from 'ngx-joyride';
import { GenerateDialog } from '../vsa-notifications/dialog-method.util';
import { NotificationDialogModel } from '../vsa-notifications/vsa-notifications.model';
import { MatDialog } from '@angular/material/dialog';

// Source Document means CER
// Destination Document means SSCP
@Component({
  selector: 'vsa-document-reviewer',
  templateUrl: './vsa-document-reviewer.component.html',
  styleUrls: ['./vsa-document-reviewer.component.scss'],
})
export class VSADocumentReviewerComponent implements OnInit {
  // Params
  @Input('variables') docVariablesList: any[];
  @Output()
  onVariableSelectionChange: // emit variableId and deviceId onSelectionChange
  EventEmitter<{
    variableId: number | string;
    deviceId: number | string;
    variableIndex: number;
  }> = new EventEmitter();

  // View Childs
  @ViewChild('variablePanel') variablePanel: VariablesPanelComponent;
  @ViewChild('destination') destinationPanel: SscpPanelComponent;
  @ViewChild('source') sourcePanel: CerPanelComponent;

  // Variables
  saving: boolean;
  selectedVariableAndDevice: any;
  requiredDOCXTypes: string[];
  requiredDocumentFiles: string[];
  documentData: any = {};
  remainingVariables: number;
  private sourceXmlFiles: DocxDecompressedXMLStrucuture;
  private destinationXmlFiles: DocxDecompressedXMLStrucuture;
  tempSourceDOCXFile: any;
  tempDestinationDOCXFile: any;

  constructor(
    private reviewService: ReviewService,
    private joyrideService: JoyrideService,
    public dialog: MatDialog
  ) {
    // Initialize Default Values
    this.setupEmptyDocumentsData();
  }

  ngOnInit(): void {}

  // Core Logic

  // Based on Required Files and Document Types generate first level storage of data
  setupEmptyDocumentsData() {
    // Destination and Source can be changed later, for now it has been maintained in constants
    this.requiredDOCXTypes = [documentTypes.destination, documentTypes.source];
    // Required XML and other Files required from api has been maintained in constants
    this.requiredDocumentFiles = xmlDocumentAPIFileNames;
    this.requiredDOCXTypes.forEach((docxType) => {
      this.documentData[docxType] = {};
      this.requiredDocumentFiles.forEach((requiredFile) => {
        this.documentData[docxType][requiredFile] = '';
      });
      // Document XML stores the array of XML Paragraphs
      this.documentData[docxType]['documentXML'] = [];
      this.documentData[docxType]['images'] = {};
    });
  }

  renderSourceDOCX() {
    // Starts generating DOCX
    this.generateDOCXBlob(this.sourceXmlFiles, 'source').then((blob) => {
      // Starts rendering DOCX to html
      this.sourcePanel.loading = false;
      // Stops loading once docx is generated
      setTimeout(() => {
        new DOCXRenderer(blob)
          .renderDocxToHtml(this.sourcePanel.documentPlaceholder.nativeElement)
          .then(() => {
            // Docx successfully rendered.
            this.scrollToHighlightInView();
          });
      }, 10);
    });
  }

  renderDestinationDOCX() {
    // Starts generating DOCX
    this.generateDOCXBlob(this.destinationXmlFiles, 'destination').then(
      (blob) => {
        // Starts rendering DOCX to html
        this.destinationPanel.loading = false;
        // Stops loading once docx is generated
        setTimeout(() => {
          new DOCXRenderer(blob)
            .renderDocxToHtml(
              this.destinationPanel.documentPlaceholder.nativeElement
            )
            .then(() => {
              // Docx successfully rendered.
              this.scrollToHighlightInView();
            });
        }, 10);
      }
    );
  }

  // Generate Blob of Docx created using XML Files
  private generateDOCXBlob(
    xmlFiles: DocxDecompressedXMLStrucuture,
    docxType: 'source' | 'destination'
  ) {
    return new Promise<Blob>((resolve, reject) => {
      xmlFiles = new DocxDecompressedXMLStrucuture();
      // Load all the API Files
      xmlFiles.word['numbering.xml'] =
        this.documentData[documentTypes[docxType]]['numbering'];
      xmlFiles.word['settings.xml'] =
        this.documentData[documentTypes[docxType]]['settings'];
      xmlFiles.word['styles.xml'] =
        this.documentData[documentTypes[docxType]]['styles'];
      xmlFiles.word._rels['document.xml.rels'] =
        this.documentData[documentTypes[docxType]]['rels'];
      xmlFiles.word.theme['theme1.xml'] =
        this.documentData[documentTypes[docxType]]['theme1'];
      xmlFiles.word.media =
        this.documentData[documentTypes[docxType]]['images'];
      this.getDocxLocalStaticFiles().then((files) => {
        // Load all static files from assets
        xmlFiles['[Content_Types].xml'] = files[0];
        xmlFiles._rels['.rels'] = files[1];
        xmlFiles.word['fontTable.xml'] = files[2];
        xmlFiles.word['stylesWithEffects.xml'] = files[3];
        xmlFiles.word['webSettings.xml'] = files[4];
        // Place Paragraphs XML array to document XML.
        xmlFiles.word['document.xml'] = this.createDocumentInnerXml(
          files[5],
          this.documentData[documentTypes[docxType]]['documentXML']
        );
        xmlFiles.docProps['core.xml'] = files[6];
        xmlFiles.docProps['app.xml'] = files[7];
        // Custom Library used compress xmls and generate docx base64 data
        console.log(xmlFiles);
        const generator = new DOCXGenerator(xmlFiles);
        generator.xmlTodocx().then((docx) => {
          // convert base64 to blob and return it.
          const docxBlob = generator.b64toBlob(
            docx.base64,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          );
          resolve(docxBlob);
        });
      });
    });
  }

  private createDocumentInnerXml(
    baseXmlString: string,
    paragraphXMLStrings: string[]
  ) {
    let paraXML = '';
    if (paragraphXMLStrings.length > 1)
      paraXML = paragraphXMLStrings.reduce((a, b) => a + b, '');
    else paraXML = paragraphXMLStrings[0];
    baseXmlString = baseXmlString.replace('{{paragraphs_xml}}', paraXML);
    return baseXmlString;
  }

  private scrollToHighlightInView() {
    let highlightedElements = [];
    var allStyledElements = document.querySelectorAll('*[style]');
    allStyledElements.forEach((element) => {
      // Find Shaded color rgb(245, 231, 221) and scroll to it.
      if ((element as any).style.backgroundColor == 'rgb(245, 231, 221)') {
        highlightedElements.push(element);
      }
    });
    highlightedElements.forEach((element: any) => {
      // element.scrollIntoView({block: 'center'});
      element.scrollIntoViewIfNeeded(true);
    });
  }

  // Events / Actions
  onVariableOrDeviceChange(event: any) {
    // Starts Document Loaders
    this.sourcePanel.loading = true;
    this.destinationPanel.loading = true;
    setTimeout(() => {
      // Scroll to the start of those loaders.
      document.getElementById('doc-sk1').scrollIntoView();
      document.getElementById('doc-sk2').scrollIntoView();
    }, 10);
    this.selectedVariableAndDevice = event;
    this.onVariableSelectionChange.emit(event);
  }

  onDocumentAction(event) {
    const currentVariable =
      this.docVariablesList[this.selectedVariableAndDevice.variableIndex - 1];
    const currentDeviceIndex = currentVariable.devices.findIndex(
      (device) => device.deviceId == this.selectedVariableAndDevice.deviceId
    );
    switch (event) {
      case 'prev':
        if (currentDeviceIndex == 0) {
          // if first device is selected the goto previous variable and last device
          this.variablePanel.onVarIndexDecreament();
          const newCurrentVariable =
            this.docVariablesList[
              this.selectedVariableAndDevice.variableIndex - 1
            ];
          this.selectedVariableAndDevice.deviceId =
            newCurrentVariable.devices[
              newCurrentVariable.devices.length - 1
            ].deviceId;
          this.onVariableOrDeviceChange(this.selectedVariableAndDevice);
        } else {
          // else only goto previous device on current variable
          this.selectedVariableAndDevice.deviceId =
            currentVariable.devices[currentDeviceIndex - 1].deviceId;
          this.onVariableOrDeviceChange(this.selectedVariableAndDevice);
        }
        break;
      case 'skip':
        console.log(this.selectedVariableAndDevice);
        console.log(currentVariable);

        this.warningForSkipVariable(currentVariable, currentDeviceIndex);
        break;
      case 'complete':
        // mark current device status to completed
        currentVariable.devices[currentDeviceIndex].status = 1;
        this.docVariablesList[
          this.selectedVariableAndDevice.variableIndex - 1
        ] = currentVariable;
        // go ahead to next variable if it is on last device
        if (currentVariable.devices.length == currentDeviceIndex + 1) {
          this.variablePanel.onVarIndexIncreament();
        } else {
          // goto next device on current variable
          this.selectedVariableAndDevice.deviceId =
            currentVariable.devices[currentDeviceIndex + 1].deviceId;
          this.onVariableOrDeviceChange(this.selectedVariableAndDevice);
        }
        break;

      case 'edit':
        // Edit logic here
        this.testEdit();
        break;

      default:
        break;
    }
  }

  testEdit() {
    // Logging test data
    this.documentData[documentTypes['destination']]['documentXML'];
  }

  handleVariableTextChanged(updatedValue: any) {
    // console.log(updatedValue);
    // alert(updatedValue);
  }

  warningForSkipVariable(currentVariable?: any, currentDeviceIndex?: any) {
    const notificationConfig: NotificationDialogModel = {
      title: 'Skip variable',
      notificationType: 'info',
      disableClose: true,
      message: `Are you sure you’d like to skip <b>${currentVariable.name}</b> variable and <b>${currentVariable.devices[currentDeviceIndex].deviceName}</b> device?`,
      actions: [
        { label: 'No', actionCase: 'close', class: 'big-width' },
        {
          label: 'Yes',
          actionCase: 'yes',
          class: 'confirm big-width',
        },
      ],
    };
    const dialogRef = GenerateDialog(this.dialog, notificationConfig);
    dialogRef.afterClosed().subscribe((result) => {
      switch (result) {
        case 'yes':
          if (currentVariable.devices.length == currentDeviceIndex + 1) {
            // go to next variable if it is on last device
            this.variablePanel.onVarIndexIncreament();
          } else {
            // goto next device on current variable
            this.selectedVariableAndDevice.deviceId =
              currentVariable.devices[currentDeviceIndex + 1].deviceId;
            this.onVariableOrDeviceChange(this.selectedVariableAndDevice);
          }
          break;
        default:
          break;
      }
    });
  }

  startTutorial() {
    this.joyrideService.startTour(
      {
        steps: [
          'startTutorialStep',
          'variableListStep',
          'variableStatusStep',
          'variableInspectionStep',
          // Pending (doesn't work on same div)
          'variableInspectionDetailStep',
          'editVariableStep',
          'previewPanelStep',
          // 'secondStep'
        ],
        showCounter: false,
        // stepDefaultPosition: 'top',
        // showPrevButton: false,
        // themeColor: '#212f23',
      } // Your steps order
    );
  }
  // Service Calls
  // private getDocxLocalStaticFiles() {
  private getDocxLocalStaticFiles() {
    return new Promise<string[]>((resolve, reject) => {
      const filesServices = [
        this.reviewService.getLocalDocxFile('[Content_Types].xml'),
        this.reviewService.getLocalDocxFile('_rels/.rels'),
        this.reviewService.getLocalDocxFile('word/fontTable.xml'),
        this.reviewService.getLocalDocxFile('word/stylesWithEffects.xml'),
        this.reviewService.getLocalDocxFile('word/webSettings.xml'),
        this.reviewService.getLocalDocxFile('word/document.xml'),
        this.reviewService.getLocalDocxFile('docProps/core.xml'),
        this.reviewService.getLocalDocxFile('docProps/app.xml'),
      ];
      forkJoin(filesServices).subscribe((responses) => {
        resolve(responses);
      });
    });
  }
}
