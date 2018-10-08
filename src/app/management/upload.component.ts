import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

interface UploadImage {
  name: string;
  fileName: string;
  file: File;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  category: string;
  pictures: UploadImage[] = [];

  constructor(
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  onFileChanged(event) {
    Array.from(event.target.files).forEach((f: File) => {
      this.pictures.push({
        name: this.normalizeName(f.name).split('.')[0],
        fileName: this.normalizeName(f.name),
        file: f
      });
    });
  }

  upload() {
    this.pictures.forEach(p => {
      const filePath = `centers/${p.fileName}`;
      const task = this.afStorage.upload(filePath, p.file);

      task.percentageChanges().subscribe(val => {
        console.log(`Upload percent: ${val}`);
      });

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            console.log('Image upload complete');

            this.afStore
              .collection('centers')
              .add({
                category: this.category,
                name: p.name,
                storageUrl: filePath
              })
              .then(ref => {
                console.log('Added document with ID: ', ref.id);
              });
          })
        )
        .subscribe();
    });
  }

  private normalizeName(name: string): string {
    return name.toLowerCase().replace(/\s/g, '-');
  }
}
