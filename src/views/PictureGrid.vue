<template>
  <div class="grid">
    <PictureCell
      v-for="(center, idx) in currentCenters"
      :key="idx"
      :gridIndex="idx"
      :center="center"
      v-on:pick-image="pickImage"
    />
    <div id="search-overlay" v-if="showSearch">
      <button class="btn" id="close" v-on:click="hideSearch">
        <i class="fas fa-times-circle fa-lg"></i>
      </button>

      <input
        type="text"
        class="form-control"
        ref="searchInput"
        v-on:keyup="search"
      />

      <div class="search-results" v-if="searchResults">
        <ul class="list-group">
          <button
            class="list-group-item list-group-action-item"
            v-for="center in searchResults"
            :key="center.name"
            v-on:click="pickCenter(center)"
          >
            {{ center.name }}
          </button>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PictureCell from "@/components/PictureCell.vue";
import searchService from "@/services/search.service.js";
import { Subject } from "rxjs";

export default {
  name: "PictureGrid",
  components: {
    PictureCell
  },
  data: function() {
    return {
      currentCenters: [
        { picked: false },
        { picked: false },
        { picked: false },
        { picked: false },
        { picked: false },
        { picked: false }
      ],
      selectedGridIdx: null,
      showSearch: false,
      searchResults: [],
      searchTerm$: new Subject(),
      searchSubscription: null
    };
  },
  methods: {
    pickImage: function(gridIndex) {
      this.selectedGridIdx = gridIndex;
      this.showSearch = true;

      // focus input on next DOM tick
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });

      this.searchSubscription = searchService
        .search(this.searchTerm$)
        .subscribe(results => (this.searchResults = results));
    },
    hideSearch: function() {
      this.selectedGridIdx = null;
      this.showSearch = false;
      this.searchResults = [];

      if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
      }
    },
    search: function(event) {
      this.searchTerm$.next(event.target.value);
    },
    pickCenter: function(chosenCenter) {
      this.currentCenters.splice(this.selectedGridIdx, 1, chosenCenter);
      this.hideSearch();
    }
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 33% 33% 33%;
  height: 100%;
}

#search-overlay {
  position: absolute;
  top: 5em;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  width: 40%;
}

#search-overlay input {
  border: solid;
}

#close {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
}
</style>
