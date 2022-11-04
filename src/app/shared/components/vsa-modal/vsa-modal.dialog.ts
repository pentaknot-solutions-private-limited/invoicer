import { Component, Input, Output, EventEmitter, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
  
@Component ({
    selector: 'vsa-modal-dialog',
    templateUrl: './vsa-modal.dialog.html',
    styleUrls: ['./vsa-modal.dialog.scss']
})

export class VSAModalDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<VSAModalDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          // console.log(data)
        }
    
      onNoClick(returnValue): void {
        this.dialogRef.close(returnValue);
      }

      actionBtnClick(event) {
        console.log(event);
        
      }

      // openDialog(): any {
      //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
      //     width: '620px',
      //     height: '326px',
      //   });
    
      //   dialogRef.afterClosed().subscribe(result => {
      //     
      //   });
      // }
    
}