import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Product } from './product.model';
import { MatSnackBar, MatSnackBarConfig, MatDialog } from '@angular/material';
import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  simpleReqProductObs$: Observable<Product[]>;
  productsErrorHandling: Product[];
  productsLoading: Product[];
  bLoading: boolean = false;
  productsIds: Product[];
  newlyProducts: Product[] = [];
  productsToDelete: Product[];
  productsToEdit: Product[];

  private unsubscribe$: Subject<any> = new Subject();
  
  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {}

  getSimplesHttpRequest() {
    this.productsService.getProducts();
  }

  getProductsWithErrorHandling() {
    this.productsService.getProductsError().subscribe(
      (prods) => {
      this.productsErrorHandling = prods;
      },
      (err) => {
      console.log(err);
      console.log('Message:' + err.error.msg);
      console.log('Status code:' + err.status);

      let config = new MatSnackBarConfig();
      config.duration = 2000;
      config.panelClass = ['snack_err'];

      if(err.status == 0)
        this.snackBar.open('Could not connect to the server', '', config);
      else
        this.snackBar.open(err.error.msg, '', config);
      }
    );
  }

  getProductsWithErrorHandlingOk() {
    this.productsService.getProductsDelay()
    .subscribe(
      (prods) => {
        this.productsErrorHandling = prods;
        
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_ok'];

        this.snackBar.open('Products sucessfuly loaded', '', config);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getProductsLoading() {
    this.bLoading = true;

    this.productsService.getProductsDelay()
    .subscribe(
      (prods) => {
        this.productsLoading = prods;
        this.bLoading = false;
      },
      () => {
        this.bLoading = false;
      }
    );
  }

  loadName(id: string) {
    this.productsService.getProductName(id).subscribe(
      (name => {
        let index = this.productsIds.findIndex(p => p._id === id);

        if (index >= 0) {
          this.productsIds[index].name = name;
        }
      })
    );
  }

  getProductsIds() {
    this.productsService.getProductsIds().subscribe(
      (ids) => {
        this.productsIds = ids.map(id => ({
          _id: id,
          name: '',
          department: '',
          price: 0
        }))
      }
    );
  }

  saveProduct(name: string, department: string, price: number) {
    let p = {name, department, price};

  }

  deleteProduct(p: Product) {
    this.productsService.deleteProduct(p).subscribe(
      (res) => {
        let i = this.productsToDelete.findIndex(prod => p._id == prod._id);

        if (i >= 0)
          this.productsToDelete.splice(i, 1);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadProductsToDelete() {
    this.productsService.getProducts().subscribe(
      (prods) => this.productsToDelete = prods
    );
  }

  loadProductsToEdit() {
    this.productsService.getProducts().subscribe(
      (prods) => this.productsToEdit = prods
    );
  }

  editProduct(p: Product) {
    let newProduct: Product = {...p};
    let dialogRef = this.dialog.open(DialogEditProductComponent, {width: '400px', data: newProduct});

    dialogRef.afterClosed().pipe(
      filter((prod: Product) => prod != undefined),
      switchMap((prod: Product) => this.productsService.editProduct(prod))).subscribe(
      (prod: Product,) => {
        let i = this.productsToEdit.findIndex(p => p._id == prod._id);
        if (i>=0)
          this.productsToEdit[i] = prod;
      },
      (err) => console.error(err)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
