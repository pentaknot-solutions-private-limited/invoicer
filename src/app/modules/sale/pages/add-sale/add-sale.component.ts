import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { CustomerConfig } from "src/app/configs/plugin-components/customer.config";
import {
  CustomerDetails,
  LineItem,
  SaleDetails,
  SaleItem,
} from "../../model/sale.model";
import { SaleConfig } from "src/app/configs/plugin-components/sale.config";
import { CustomerService } from "src/app/shared/_http/customer.service";
import { InventoryService } from "src/app/shared/_http/inventory.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { minLengthArray } from "src/app/shared/utils/custom-validators";
import * as _ from "lodash";
import { convertAmountToWords } from "src/app/shared/utils/convert-amount-to-words";
import { InvoicePDF } from "src/app/shared/invoice-template/view-invoice-template";

@Component({
  selector: "add-sale",
  templateUrl: "./add-sale.component.html",
  styleUrls: ["./add-sale.component.scss"],
})
export class AddSaleComponent implements OnInit {
  @Input() customerData: any;
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  saleConfig: SaleConfig = new SaleConfig();
  saleDetails: SaleDetails = new SaleDetails();
  customers: any[] = [];
  selectedCustomer: any;
  selectedInventory: any;
  lineItemForm: FormGroup;
  lineItemListForm: FormArray;
  lineItems: SaleItem[] = [];
  lineItemFormConfigList = [];
  lineItemFormConfig = {
    inventorySelect: this.saleConfig.inventorySelect,
    hsnSacCode: this.saleConfig.hsnSacCodeInput,
    qty: this.saleConfig.quantityInput,
    rate: this.saleConfig.rateInput,
    // unitId: this.saleConfig.unitConfig,
    amount: this.saleConfig.amountInput,
  };
  calc = 0;
  inventory: any[] = [];
  constructor(
    private customerService: CustomerService,
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {
    this.lineItemForm = this.fb.group({
      lineItemList: this.fb.array([], minLengthArray(1)),
    });
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getAllInventory();
  }

  getControl(lineItem: FormGroup, controlName: string) {
    return lineItem.get(controlName) as FormControl;
  }

  getLineItem(i) {
    // this.lineItems[i].qty = this.inv.packageQty;
    return this.lineItems[i];
  }

  createLineItemForm(lineItem?: any) {
    return this.fb.group({
      saleItemId: [lineItem?.saleItemId || ""],
      inventoryId: [lineItem?.inventoryId || ""],
      hsnSacCode: [lineItem?.hsnSacCode || ""],
      qty: new FormControl(1),
      rate: [lineItem?.rate || 0],
      // taxId: [lineItem?.taxId || ""],
      // unitId: [lineItem?.unitId ? lineItem?.unitId : ""],
      // unit: [lineItem?.unit ? lineItem?.unit : ""],
      amount: [lineItem?.amount || 0],
      carDetails: [lineItem?.carDetails || {}],
    });

    // this.shipmentDetailsModel.packageQty
    // this.shipmentDetailsModel.chargeableWt
  }

  onAddNewLineItemClick(isNew) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    const formIndex =
      this.lineItemFormConfigList.push(_.cloneDeep(this.lineItemFormConfig)) -
      1;
    this.lineItemFormConfigList[formIndex].inventorySelect.options =
      formIndex == 0 ? this.inventory : this.inventory;

    // : this.getServiceTypeData(
    //     true,
    //     this.lineItemForm.get("lineItemList").value[formIndex - 1]
    //       .inventoryId
    //   );

    this.lineItemListForm.push(this.createLineItemForm());

    if (isNew) {
      this.lineItems.push(new LineItem());
      this.lineItems[formIndex].qty = 1;
      this.lineItems[formIndex].rate = 0;
    }

    this.lineItemFormConfigList[formIndex].inventorySelect.attributes.hint = "";
  }

  calculateAmount(array) {
    const initialValue = 0;
    const sumWithInitial = array.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue.qty) * Number(currentValue.rate),
      initialValue
    );
    return sumWithInitial;
  }

  valueChanged(type: any, index: number) {
    console.log(this.calc);
    switch (type) {
      case "qty":
      case "rate":
      // this.lineItems[index].amount = this.calculateAmount(
      //   this.lineItemForm.get("lineItemList").value
      // );
    }
  }

  onDeleteLineItemClick(i) {
    this.lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    // if (
    //   this.lineItemForm.get("lineItemList").value[i].qty &&
    //   this.lineItemForm.get("lineItemList").value[i].rate
    // ) {
    this.lineItemListForm.removeAt(i);
    this.lineItems.splice(i, 1);
    this.lineItemFormConfigList.splice(i, 1);
    // }
  }

  selectionChanged(type: any, event?: any, i?: number) {
    switch (type) {
      case "customer":
        console.log(event);
        this.selectedCustomer = event.selectedObj;
      case "inventory":
        console.log(event);
        console.log(this.lineItems);
        this.lineItems[i].rate = event?.selectedObj?.Car_Detail?.maxPrice;
        this.lineItems[i].carDetails = event?.selectedObj;
        // this.selectedInventory = event.selectedObj;
        // setTimeout(() => {
        //   this.lineItems[i].amount = this.calculateAmount(
        //     this.lineItemForm.get("lineItemList").value
        //   );
        // }, 100);
        // this.updateLineItemRate(event.selectedObj, i);
        break;
    }
  }

  updateLineItemRate(inventory: any, i: number) {
    // console.log(inventory?.Car_Detail?.maxPrice);
    // Get the FormArray and the specific FormGroup at the given index
    // const lineItemListForm = this.lineItemForm.get("lineItemList") as FormArray;
    // const lineItemGroup = lineItemListForm.at(i) as FormGroup;
    // lineItemGroup.get("rate").patchValue(inventory?.Car_Detail?.maxPrice);
  }

  // Drawer Action Events
  actionEvent(event) {
    // let eventData = null;
    const customers = this.saleConfig.customerSelect.options;
    const places = this.saleConfig.placeOfSupplySelect.options;
    const customer = customers.find(cus => cus?.customerId == this.saleDetails.customerId);
    const place = places.find(cus => cus?.posId == this.saleDetails.posId);
    let data: any = {
      customer: customer,
      place: place,
      saleDetails: this.saleDetails,
      listItems: this.lineItems
    };
    switch (event) {
      case "preview":
        console.log(data);
        new InvoicePDF(data).openPdf();
        break;
      default:
        this.onBtnClick.emit("close");
        break;
    }
  }

  formatAddress(customer: any) {
    return `${customer?.addressLine1}, ${customer?.addressLine2}, ${customer?.city}, ${customer?.stateId}. ${customer?.pincode}`;
  }

  numToText(num: any) {
    return convertAmountToWords(Math.round(Number(num || 0)));
  }

  // API

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((res: any) => {
      // this.customers = res.data;

      this.saleConfig.customerSelect.options = res.data.map((row: any) => {
        return {
          ...row,
          name: `${row["firstName"]} ${row["lastName"]}`,
        };
      });
    });
  }

  getAllInventory() {
    this.inventoryService.getAllInventory().subscribe((res: any) => {
      // this.customers = res.data;
      // console.log(res.data);
      // this.saleConfig.inventorySelect.options =
      this.inventory = res.data.map((row: any) => {
        return {
          ...row,
          name: row["Car_Detail"]["name"],
        };
      });
      // this.saleConfig.inventorySelect.option
    });
  }
}
