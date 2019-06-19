import { Component, OnInit, Inject } from '@angular/core';
import { Product } from '../product.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.css']
})
export class DialogEditProductComponent implements OnInit {

  product: Product = {_id: '', name: '', department: '', price: 0};

  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public p: Product
  ) {
    this.product = p;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

}
