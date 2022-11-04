import * as docx from 'docx-preview/dist/docx-preview';

export class DOCXRenderer {
    docxBlob: Blob;
    constructor(file: Blob) {
        this.docxBlob = file;
    }

    // HTML Element = Where docx needs to be rendered,
    // options = configurations for renderer, default is ignoreWidth: true and ignoreHeight: True
    renderDocxToHtml(element: HTMLElement, options?: Partial<docx.Options>) {
        if(!options) options = {ignoreWidth: true, ignoreHeight: true}
        return new Promise<void>((resolve, reject) => {
            docx.renderAsync(
            this.docxBlob, 
            element,
            null, 
            options)
            .then(x => resolve());
        })
    }
}