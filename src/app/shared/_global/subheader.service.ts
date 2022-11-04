import { Injectable, TemplateRef } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class ChangeSubheaderParameterService {
    private title = new Subject<string>();
    private sidebarToggle = new Subject<boolean>();
    private template = new Subject<TemplateRef<any>>();

  titleObservable(): Observable<string> {
    return this.title.asObservable();
  }

  templateObservable(): Observable<TemplateRef<any>> {
    return this.template.asObservable();
  }

  sidebarToggleObservable(): Observable<boolean> {
    return this.sidebarToggle.asObservable();
  }

  changeSubheaderTitle(value: string) {
    this.title.next(value);
  }

  changeSubheaderTemplate(template: TemplateRef<any>) {
      this.template.next(template)
  }

  changeSidebarToggle(value: boolean) {
      this.sidebarToggle.next(value)
  }
}
