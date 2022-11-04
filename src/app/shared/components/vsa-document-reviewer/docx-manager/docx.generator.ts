import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as JSZip from "jszip";
import { forkJoin } from "rxjs";
import { DocxDecompressedXMLStrucuture } from "./docx-file-structure.model";

export class DOCXGenerator {
    xmlFiles: DocxDecompressedXMLStrucuture;
    constructor(decompressedXMLFilesStrucutre: DocxDecompressedXMLStrucuture) {
        this.xmlFiles = decompressedXMLFilesStrucutre;
    }
    // ConvertsXMLFilesToDocxFile
    public xmlTodocx() {
        return new Promise<any>((resolve, request) => {
            var result, zip = new JSZip(), zipTime, processTime;
            processTime = Date.now();
            zip = this.zipAllFiles(zip);
            processTime = Date.now() - processTime;
            zipTime = Date.now();
            zip.generateAsync<'base64'>({ type: 'base64', compression: 'DEFLATE' }).then((value)=> {
                result = { 
                    base64: value, 
                    zipTime: Date.now() - zipTime, 
                    processTime: processTime,
                    src: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + value
                }
                resolve(result)
            });  
        })
    }
    private zipAllFiles(zip: JSZip): JSZip {
        zip.file('[Content_Types].xml', this.xmlFiles["[Content_Types].xml"])
        zip.folder('_rels').file('.rels', this.xmlFiles._rels[".rels"]);
        let docProps = zip.folder('docProps');
        let word = zip.folder('word');
        word.folder('theme').file('theme1.xml', this.xmlFiles.word.theme["theme1.xml"]);
        word.file('fontTable.xml', this.xmlFiles.word["fontTable.xml"]);
        word.file('settings.xml', this.xmlFiles.word["settings.xml"]);
        word.file('styles.xml', this.xmlFiles.word["styles.xml"]);
        word.file('stylesWithEffects.xml', this.xmlFiles.word["stylesWithEffects.xml"]);
        word.file('webSettings.xml', this.xmlFiles.word["webSettings.xml"]);
        word.file('numbering.xml', this.xmlFiles.word["numbering.xml"]);
        word.file('document.xml', this.xmlFiles.word["document.xml"]);
        word.folder('_rels').file('document.xml.rels',this.xmlFiles.word._rels["document.xml.rels"]);
        docProps.file('core.xml', this.xmlFiles.docProps["core.xml"]);
        docProps.file('app.xml', this.xmlFiles.docProps["app.xml"]);
        Object.keys(this.xmlFiles.word.media).forEach(file => {
            word.folder('media').file(`${file}.png`, this.xmlFiles.word.media[file], {base64: true})  
        })
        return zip;
    }

    // Currently No use,
    // It was created to map new relations, not required because new images cannot be added
    private createMediaRelations(images: string[], mediaFolder: any) {
        let currentRelationId = 19;
        let relationsXMLString = "";
        let assignedMediaIds = [];
        images.forEach((imageValue, index) => {
            const fileName = `image${index}.png`;
            mediaFolder.file(fileName, imageValue, {base64: true})
            relationsXMLString += `<Relationship Id="rId${currentRelationId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${fileName}"/>`
            assignedMediaIds.push(currentRelationId);
            currentRelationId += 1;
        })
        return {
            xmlString: relationsXMLString,
            mediaIds: assignedMediaIds
        };
    }
    
    // Currently No use,
    // It was created to place new relation mapping
    private handleMediaRelations(xmlString: string, additionalXML?: string) {
        const replaceString = "{{new_relations}}"
        return xmlString.replace(replaceString,additionalXML?additionalXML:"");
    }

    // Currently No use,
    // It was created to place paragraphs into document xml, also highlight it and 
    // add images tags to bottom of document.
    private createDocumentInnerXml(baseXmlString: string, paragraphXMLStrings: string[], mediaIds: any[], highlighter: string) {
        const paraXML = paragraphXMLStrings.reduce((a,b) => a+b, "" );
        // const mediaXML = mediaIds.reduce((a,b) => 
        // a+`<w:p w14:paraId="0F69395C" w14:textId="77777777" w:rsidR="00714847" w:rsidRDefault="00714847" w:rsidP="00714847"><w:pPr><w:pStyle w:val="TableCell10-Bullet"/></w:pPr><w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="52CA2FCC" wp14:editId="319899D9"><wp:extent cx="2486398" cy="714375"/><wp:effectExtent l="0" t="0" r="9525" b="0"/><wp:docPr id="1129" name="Picture 1129"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="1" name=""/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId${b}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="971475"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`
        // , "")
        baseXmlString = baseXmlString.replace("{{paragraphs_xml}}", paraXML)
        // baseXmlString = baseXmlString.replace("{{media_xml}}",mediaXML)
        // return this.XPathParser(baseXmlString, "/w:document/w:body/w:tbl[1]/w:tr[0]/w:tc[1]/w:p[0]", highlighter)
        // return this.XPathParser(baseXmlString, "/w:document/w:body/w:tbl[1]", highlighter)
        return baseXmlString;
    }

    // Currently No use,
    // Logic to replace string by finding using xpath;
    private XPathParser(xml: string, xpath: string, highlighter: string) {
        function parseXmlString(xmlString: string, trimXmlDeclaration: boolean = false): Document {
            if (trimXmlDeclaration)
                xmlString = xmlString.replace(/<[?].*[?]>/, "");
            
            const result = new DOMParser().parseFromString(xmlString, "application/xml");  
            const errorText = hasXmlParserError(result);
        
            if (errorText)
                throw new Error(errorText);
        
            return result;
        }
        function hasXmlParserError(doc: Document) {
            return doc.getElementsByTagName("parsererror")[0]?.textContent;
        }
        const nodes = parseXmlString(xml)
        const pathRelations = xpath.split("/");
        pathRelations.splice(0,1)
        let findNode;
        pathRelations.forEach(path => {
            if(path.includes("[")) {
                const num = parseInt(path.substring(path.indexOf("[")+1, path.lastIndexOf("]")))
                const tagName = path.substring(0, path.indexOf("["))
                if(findNode) 
                findNode = findNode.getElementsByTagName(tagName)[num];
                else
                findNode = nodes.getElementsByTagName(tagName)[num];
            } else {
                if(findNode) 
                findNode = findNode.getElementsByTagName(path)[0];
                else
                findNode = nodes.getElementsByTagName(path)[0];
            }
        });
        highlighter = highlighter.replace("{{highlighted_paragraph}}",(findNode as HTMLElement).outerHTML);
        (findNode as HTMLElement).outerHTML = highlighter
        console.log(nodes)
        return new XMLSerializer().serializeToString(nodes.firstChild)
    }

    
    public b64toBlob(b64Data, contentType='', sliceSize=512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }
}