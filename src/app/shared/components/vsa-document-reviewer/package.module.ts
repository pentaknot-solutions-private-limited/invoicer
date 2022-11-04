import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariablesPanelComponent } from './variables-panel/variables-panel.component';
import { SscpPanelComponent } from './sscp-panel/sscp-panel.component';
import { CerPanelComponent } from './cer-panel/cer-panel.component';
import { VSADocumentReviewerComponent } from './vsa-document-reviewer.component';
import { MaterialModule } from '../../shared-modules/material.module';
import { VSAIconModule } from '../vsa-icon/package.module';
import { FormsModule } from '@angular/forms';
import { VSAButtonModule } from '../vsa-button/package.module';
import { SplitterModule } from 'primeng/splitter';
import { ReviewService } from '../../_http/review.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { DocumentSkeletonLoaderComponent } from './document-skeleton-loader/document-skeleton-loader.component';
@NgModule({
  declarations: [
    VariablesPanelComponent,
    SscpPanelComponent,
    CerPanelComponent,
    VSADocumentReviewerComponent,
    DocumentSkeletonLoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    VSAIconModule,
    FormsModule,
    VSAButtonModule,
    SplitterModule,
    // Tutorial Dependencies
    JoyrideModule.forRoot(),
    //
  ],
  exports: [VSADocumentReviewerComponent],
  providers: [ReviewService, // Tutorial Dependency
    JoyrideService],
  
})
export class DocumentReviewerModule {}
