import { HttpEventType } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { formatBytes } from "../../utils/fileSize-converter";
import { GenerateDialog } from "../vsa-notifications/dialog-method.util";
import { NotificationDialogModel } from "../vsa-notifications/vsa-notifications.model";
import { VSAAttachmentFile } from "./vsa-file-uploader.model";
import { VSAFileUploaderService } from "./vsa-file-uploader.service";

@Component({
  selector: "vsa-file-uploader",
  templateUrl: "./vsa-file-uploader.component.html",
  styleUrls: ["./vsa-file-uploader.component.scss"],
  providers: [VSAFileUploaderService],
})
export class VSAFileUploaderComponent implements OnInit {
  // Parameters
  @Input() Allowedfiles = "";
  @Input() MultipleUpload: boolean;
  @Input() FilesNumberLimit: number;
  @Input() FilesSizeLimit: number; // in bytes
  @Input() fileList: VSAAttachmentFile[] = [];
  @Input() uploadAPIEndPoint: string;
  @Output() fileListChange: EventEmitter<VSAAttachmentFile[]> =
    new EventEmitter();

  //Variables
  @ViewChild("fileSelector") fileSelector: ElementRef;
  //Temp

  constructor(
    private changeDetector: ChangeDetectorRef,
    private uploaderService: VSAFileUploaderService,
    public dialog: MatDialog
  ) {
    // Initialize Default Properties
    this.MultipleUpload = false;
    this.FilesNumberLimit = 1;
    // this.FilesSizeLimit = 524288000000; // ...Bytes = 5 MB
    this.FilesSizeLimit = 5242880; // ...Bytes = 5 MB
    // this.FilesSizeLimit = 5242880; // ...Bytes = 5 MB
  }

  ngOnInit() {}

  fileChangeEvent(e: any) {
    let selectedFileList: File[] = [];
    Object.keys(e).forEach((key) => {
      if (key != "length") {
        selectedFileList.push(e[key]);
      }
    });

    const changedFileList: VSAAttachmentFile[] = selectedFileList
      .map((value) => {
        console.log(value);

        if (value.type != "application/pdf") {
          this.warningDialog(`Please upload only ${this.Allowedfiles} files.`);
          return;
        } else {
          return {
            fileId: null,
            fileDetails: value,
            isUploaded: false,
            uploadingPercentage: null,
            fileName: value.name,
            fileSize: value.size,
            extension: value.name,
            extractedData: null,
            error: null,
            fileBinary: null,
          };
        }
      })
      .filter((blockFileValidations) => {
        return this.blockOverSizeLimitFile(blockFileValidations);
      });
    this.fileList?.push(...changedFileList);
    if (this.fileList?.length > this.FilesNumberLimit) {
      this.warningDialog(
        `You have uploaded more than ${this.FilesNumberLimit} files. Please upload less than or equal to ${this.FilesNumberLimit} files.`
      );
      this.fileList = [];
    } else {
      this.fakeloader();
      this.getBinaryDetails();
      // this.fileUploader();
      console.log(this.fileList);
    }
  }

  // Warning function
  warningDialog(msg: string) {
    const notificationConfig: NotificationDialogModel = {
      notificationType: "warning",
      disableClose: true,
      message: msg,
      actions: [{ label: "Close", actionCase: "ok" }],
    };
    const dialogRef = GenerateDialog(this.dialog, notificationConfig);
  }

  fakeloader() {
    for (const key in this.fileList) {
      if (
        this.fileList[key]?.uploadingPercentage == null ||
        this.fileList[key]?.uploadingPercentage == undefined
      )
        this.fileList[key].uploadingPercentage = 0;
      // this.changeDetector.detach();
      let interval = setInterval(() => {
        if (!this.fileList[key]) clearInterval(interval);
        if (this.fileList[key]?.uploadingPercentage < 100) {
          this.fileList[key].uploadingPercentage =
            this.fileList[key].uploadingPercentage + 10;
        } else {
          clearInterval(interval);
        }
        this.changeDetector.detectChanges();
      }, 2);
    }
  }

  getUploadedFileSize(file: VSAAttachmentFile) {
    return this.fileSizeFormaterByBytes(
      ((file.uploadingPercentage ? file.uploadingPercentage : 0) *
        file.fileSize) /
        100
    );
  }

  fileUploader() {
    this.fileList?.forEach((file) => {
      this.uploaderService
        .uploadFile(this.getFormData(file))
        .subscribe((resp) => {
          if (resp.type === HttpEventType.Response) {
            file.isUploaded = true;
          }
          if (resp.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * resp.loaded) / resp.total);
            console.log("Progress " + percentDone + "%");
            file.uploadingPercentage = percentDone;
          }
        });
    });
  }

  cancelAndRemoveFile(index) {
    this.fileList?.splice(index, 1);
    this.fileSelector.nativeElement.value = "";
    // console.log(this.fileList);
    this.fileListChange.emit(this.fileList);
    this.changeDetector.detectChanges();
  }

  getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }

  blockOverSizeLimitFile(file: VSAAttachmentFile) {
    return file?.fileSize <= this.FilesSizeLimit;
  }

  fileSizeFormaterByBytes(bytes: number) {
    return formatBytes(bytes);
  }

  // get binary details
  getBinaryDetails() {
    for (let index = 0; index < this.fileList?.length; index++) {
      const element = this.fileList[index];
      if (element.fileDetails) {
        var reader = new FileReader();

        reader.readAsDataURL(element.fileDetails as Blob); // read file as data url

        reader.onload = (event) => {
          // called once readAsDataURL is completed
          //   this.user.userImage = event.target.result.toString();
          //
          this.fileList[index].fileBinary = (
            event.target as FileReader
          ).result.toString();
          this.fileListChange.emit(this.fileList);
        };
      }
    }
  }

  onFileDropped(event) {
    this.prepareFilesList(event);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      if (item.type != "application/pdf") {
        this.warningDialog(`Please upload only ${this.Allowedfiles} files.`);
      } else {
        item.progress = 0;
        this.fileList?.push({
          fileId: null,
          fileDetails: item,
          isUploaded: false,
          uploadingPercentage: 0,
          fileName: item.name,
          fileSize: item.size,
          extension: item.name,
          extractedData: null,
          error: null,
          fileBinary: null,
        });
      }
    }
    this.fakeloader();
    this.getBinaryDetails();
  }
}
