import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  dataInventory: any;
  modal_tambah = false;
  id: any;
  nama: any;
  jenis: any;
  modal_edit = false;
  constructor(public _apiService: ApiService, private modal: ModalController) {}

  ngOnInit() {
    this.getInventory();
  }

  getInventory() {
    this._apiService.tampil('tampildata.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataInventory = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  reset_model() {
    this.id = null;
    this.nama = '';
    this.jenis = '';
  }
  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }
  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }
  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilInventory(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }
  tambahInventory() {
    if (this.nama != '' && this.jenis != '') {
      let data = {
        nama: this.nama,
        jenis: this.jenis,
      };
      this._apiService.tambah(data, '/tambahdata.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah inventory');
          this.getInventory();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah inventory');
        },
      });
    } else {
      console.log('gagal tambah inventory karena masih ada data yg kosong');
    }
  }
  hapusInventory(id: any) {
    this._apiService.hapus(id, '/hapusdatabyid.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getInventory();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }
  ambilInventory(id: any) {
    this._apiService.lihat(id, '/lihatdatabyid.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let inventory = hasil;
        this.id = inventory.id;
        this.nama = inventory.nama;
        this.jenis = inventory.jenis;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }
  editInventory() {
    let data = {
      id: this.id,
      nama: this.nama,
      jenis: this.jenis,
    };
    this._apiService.edit(data, '/editdatabyid.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getInventory();
        console.log('berhasil edit Inventory');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Inventory');
      },
    });
  }
}
