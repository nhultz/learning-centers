<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          multiple
          v-on:change="onFileSelection"
        />
        <button
          type="button"
          class="btn btn-primary"
          v-on:click="$refs.fileInput.click()"
        >
          Upload Pictures
        </button>
      </div>

      <div class="col" v-if="pictures.length > 0">
        <button
          type="button"
          class="btn btn-primary float-right"
          v-on:click="upload"
        >
          Upload
        </button>
      </div>
    </div>

    <div class="row" id="errorMessage">
      <div class="col">
        <div v-if="errors.length" class="alert alert-danger">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="pictures.length">
      <form id="uploadForm" @submit.prevent>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Category</span>
          </div>
          <input v-model="category" type="text" class="form-control" />
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 5%" scope="col">Remove</th>
              <th style="width: 50%" scope="col">File Name</th>
              <th style="width: 45%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(picture, idx) in pictures" :key="picture.name">
              <td>
                <button
                  id="removeBtn"
                  class="btn btn-sm float-right"
                  v-on:click="removePicture(idx)"
                  :disabled="picture.state !== 'staged'"
                >
                  <i class="fas fa-times-circle fa-lg"></i>
                </button>
              </td>
              <td>{{ picture.fileName }}</td>
              <td>
                <div class="progress" v-if="picture.state === 'uploading'">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    v-bind:style="{ width: picture.currentUploadPercent }"
                  ></div>
                </div>

                <div class="progress" v-if="picture.state === 'complete'">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style="width: 100%"
                  ></div>
                </div>

                <div class="progress" v-if="picture.state === 'error'">
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    style="width: 100%"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
import { storage, firestore } from "../firebase-config.js";
import searchService from "@/services/search.service.js";

export default {
  name: "UploadPictures",
  data: function() {
    return {
      pictures: [],
      category: null,
      errors: []
    };
  },
  methods: {
    onFileSelection: function(event) {
      this.pictures = [];
      this.category = null;

      Array.from(event.target.files).forEach(f => {
        const fixedName = this.normalizeName(f.name);

        this.pictures.push({
          name: fixedName.split(".")[0],
          fileName: fixedName,
          file: f,
          state: "staged"
        });
      });
    },
    removePicture: function(picIndex) {
      this.pictures.splice(picIndex, 1);
    },
    normalizeName: function(name) {
      return name.toLowerCase().replace(/\s/g, "-");
    },
    checkForErrors: function() {
      this.errors = [];

      if (!this.category) {
        this.errors.push("Category Required");
      }
    },
    setPictureState: function(picture, idx, state) {
      picture.state = state;
      this.$set(this.pictures, idx, picture);
    },
    setUploadPercent: function(picture, idx, percent) {
      picture.currentUploadPercent = `${percent}%`;
      this.$set(this.pictures, idx, picture);
    },
    upload: function() {
      this.checkForErrors();
      if (this.errors.length) {
        return;
      }

      this.pictures.forEach((p, idx) => {
        this.setPictureState(p, idx, "uploading");

        const filePath = `centers/${p.fileName}`;

        var uploadTask = storage
          .ref()
          .child(filePath)
          .put(p.file);

        var _this = this;

        uploadTask.on(
          "state_changed",
          // in progress
          function(snapshot) {
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            _this.setUploadPercent(p, idx, progress);
          },
          // error
          function(error) {
            // eslint-disable-next-line no-console
            console.log("Image upload failed");
            // eslint-disable-next-line no-console
            console.log(error);
            _this.setPictureState(p, idx, "error");
          },
          // success
          function() {
            firestore
              .collection("centers")
              .add({
                category: _this.category,
                name: p.name,
                storageUrl: filePath
              })
              .then(function() {
                _this.setPictureState(p, idx, "complete");
                searchService.buildIndex();
              })
              .catch(function(error) {
                // eslint-disable-next-line no-console
                console.log("Write to Firestore failed");
                // eslint-disable-next-line no-console
                console.log(error);
                _this.setPictureState(p, idx, "error");
              });
          }
        );
      });
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 1rem;
}

#uploadForm {
  margin-top: 1rem;
}

#errorMessage {
  margin-top: 1rem;
}

#removeBtn {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
