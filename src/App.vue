<template>
  <div id="app">
    <app-intro />

    <div class="controls-container">
      <div class="control-container">
        <div class="level">
          <div class="level-left">
            Pick the Year
          </div>
        </div>
      </div>

      <div class="control-container">
        <div class="level">
          <div class="level-left">
            Pick the Color
            <div class="colors-container">
              <div
                v-for="n in 5"
                class="pixel"
                :key="n"
                :style="pixelSizeStyle"
                :class="[
                  { '-selected': n - 1 == selectedColor },
                  `-color-${n - 1}`
                ]"
                @click="selectColor(n - 1)"
              ></div>
            </div>
          </div>
          <div class="lefel-right">
            <b-button
              size="is-small"
              @click="undo"
              :disabled="!pixelsHistory.length"
              >Undo</b-button
            >
            <b-button size="is-small" @click="share">Share</b-button>
            <b-button size="is-small" @click="confirmReset()">Reset</b-button>
          </div>
        </div>
      </div>

      <div
        class="pixels-container"
        :style="{
          height: containerHeight + 'px',
          width: containerWidth + 'px'
        }"
        v-on:mousedown="startDrowing"
        v-on:mouseup="stopDrowing"
      >
        <b-tooltip
          label="Tooltip top"
          v-for="pixel in pixels"
          :key="pixel.index"
          :active="!isDrawing"
          type="is-black"
        >
          <div
            class="pixel"
            :style="pixelSizeStyle"
            :class="`-color-${pixel.value}`"
            @mousedown="captureState() || fill(pixel)"
            @mouseover="isDrawing && fill(pixel)"
          ></div>
        </b-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import AppIntro from "./_common/AppIntro/AppIntro";

export default {
  name: "App",
  components: {
    AppIntro
  },
  data() {
    return {
      year: 2012,
      pixelSize: 18,
      selectedColor: 2,
      isDrawing: false,
      days: [],
      pixels: [],
      pixelsHistory: [],
      amplification: 1
    };
  },
  computed: {
    years() {
      return [...Array(6)].map((x, index) =>
        moment()
          .subtract(index, "years")
          .year()
      );
    },
    containerHeight() {
      return this.pixelSize * 7;
    },
    containerWidth() {
      return this.pixelSize * Math.ceil(this.days.length / 7);
    },
    pixelSizeStyle() {
      return { width: this.pixelSize + "px", height: this.pixelSize + "px" };
    }
  },
  mounted() {
    this.setDays();
    this.setPixels();
  },
  methods: {
    setDays() {
      const yearFrom = this.year;
      const yearTo = this.year + 1;

      const daysOfYear = [];
      for (
        let day = new Date(yearFrom, 0, 1);
        day < new Date(yearTo, 0, 1);
        day.setDate(day.getDate() + 1)
      ) {
        daysOfYear.push(new Date(day));
      }

      this.days = daysOfYear;
    },
    setPixels() {
      this.pixels = this.days.map((date, index) => {
        const isLast = index === this.days.length - 1;

        return {
          date,
          index,
          value: isLast ? 4 : 0,
          isEditable: !isLast
        };
      });
    },
    selectColor(value) {
      this.selectedColor = value;
    },
    startDrowing() {
      this.captureState();
      this.isDrawing = true;
    },
    stopDrowing() {
      this.isDrawing = false;
    },
    fill(pixel) {
      if (!pixel.isEditable) {
        return false;
      }

      pixel.value = this.selectedColor;
      this.pixels = [...this.pixels];

      console.log("pixel", pixel);
    },
    captureState() {
      const pixelsState = this.pixels.map(pixel => ({ ...pixel }));

      this.pixelsHistory.push(pixelsState);
    },
    undo() {
      if (!this.pixelsHistory) {
        return false;
      }

      this.pixels = this.pixelsHistory.pop();
    },
    share() {},
    confirmReset() {},
    reset() {}
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.controls-container {
  margin: 0 auto;
  text-align: left;
  display: inline-flex;
  flex-direction: column;
  user-select: none;
  padding: 3rem;
  border: 2px dashed rgb(230, 230, 230);
}

.control-container {
  margin-bottom: 1em;
}

.colors-container {
  display: inline-flex;
  flex-direction: row;
  vertical-align: bottom;
  margin-left: 1em;

  .pixel {
    cursor: pointer;
  }
}

.pixels-container {
  margin: 0 auto;
  // background: red;
  flex-direction: column;
  flex-wrap: wrap;
  display: flex;
}

.pixel {
  border: 1px solid #fff;
  background: rgb(235, 237, 240);
  position: relative;

  &.-selected {
    border-color: #000;
  }

  &.-color-0 {
    background: rgb(235, 237, 240);
  }

  &.-color-1 {
    background: #c6e48b;
  }

  &.-color-2 {
    background: #7bc96f;
  }

  &.-color-3 {
    background: #239a3b;
  }

  &.-color-4 {
    background: #196127;
  }

  &::before {
    display: block;
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &:hover::before {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
