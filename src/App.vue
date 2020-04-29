<template>
  <div id="app" @mouseup="stopDrowing()">
    <app-intro />

    <div class="container app-container form-container">
      <div class="control-container">
        <div class="level">
          <div class="level-left">
            <b-field
              label="Pick the Year"
              horizontal
              custom-class="control-label"
            >
              <b-dropdown aria-role="list">
                <BButton slot="trigger" slot-scope="{ active }">
                  <span>{{ year }}</span>
                  <b-icon :icon="active ? 'angle-up' : 'angle-down'"></b-icon>
                </BButton>

                <b-dropdown-item
                  v-for="value in years"
                  :key="value"
                  @click="confirmSetYear(value)"
                >
                  {{ value }}
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
          </div>
        </div>
      </div>

      <div class="control-container">
        <div class="level">
          <div class="level-left">
            <b-field
              label="Pick the Color"
              horizontal
              custom-class="control-label"
            >
              <div class="colors-container">
                <b-tooltip
                  v-for="n in 5"
                  :key="n"
                  :label="
                    `${n - 1 ? (n - 1) * amplification : 'No'} contributions`
                  "
                  type="is-black"
                  size="is-small"
                >
                  <div
                    class="pixel"
                    :style="pixelSizeStyle"
                    :class="[
                      { '-selected': n - 1 == selectedColor },
                      `-color-${n - 1}`,
                    ]"
                    @click="selectColor(n - 1)"
                  ></div>
                </b-tooltip>
              </div>
            </b-field>
          </div>
          <div class="level-right">
            <b-button
              size="is-small"
              @click="undo"
              :disabled="!pixelsHistory.length"
              v-shortkey.push="{ undo: ['ctrl', 'z'], undoMac: ['meta', 'z'] }"
              @shortkey="undo"
            >
              Undo
            </b-button>
            <b-button size="is-small" @click="confirmReset()">Reset</b-button>
          </div>
        </div>
      </div>

      <div
        class="pixels-container"
        :style="{
          height: containerHeight + 'px',
          width: containerWidth + 'px',
        }"
      >
        <b-tooltip
          :label="
            `
            ${pixel.value ? pixel.value * amplification : 'No'}
            contributions on ${pixel.dateStr}
            ${!pixel.isEditable ? '(not editable)' : ''}
          `
          "
          v-for="pixel in pixels"
          :key="pixel.index"
          :active="!isDrawing"
          size="is-small"
          type="is-black"
        >
          <div
            class="pixel"
            :style="pixelSizeStyle"
            :class="`-color-${pixel.value}`"
            @mousedown="startDrawing() || fill(pixel)"
            @mouseover="isDrawing && fill(pixel)"
          ></div>
        </b-tooltip>
      </div>

      <div class="actions level">
        <div class="level-left">
          <div class="field has-addons">
            <p class="control">
              <b-button type="is-primary" @click="generate">
                Create my git-pixels!
              </b-button>
            </p>
            <!-- <p class="control">
              <b-button type="is-primary" icon-right="cog" />
            </p> -->
          </div>
        </div>
        <div class="level-right">
          <b-button type="is-primary" icon-left="share-square" @click="share">
            Share
          </b-button>
        </div>
      </div>
    </div>

    <app-footer />
  </div>
</template>

<script>
import moment from 'moment'

import AppIntro from './_common/AppIntro/AppIntro'
import AppFooter from './_common/AppFooter/AppFooter'

export default {
  name: 'App',
  components: {
    AppIntro,
    AppFooter,
  },
  data() {
    return {
      year: moment().year(),
      dateFrom: null,
      dateTo: null,
      numWeeks: 53,
      pixelSize: 18,
      selectedColor: 2,
      isDrawing: false,
      days: [],
      pixels: [],
      pixelsHistory: [],
      amplification: 80,
    }
  },
  computed: {
    years() {
      return [...Array(15)].map((x, index) =>
        moment()
          .subtract(index, 'years')
          .year(),
      )
    },
    containerHeight() {
      return this.pixelSize * 7
    },
    containerWidth() {
      return this.pixelSize * Math.ceil(this.days.length / 7)
    },
    pixelSizeStyle() {
      return { width: this.pixelSize + 'px', height: this.pixelSize + 'px' }
    },
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search)
    this.year = urlParams.get('year')
      ? moment()
          .set('year', urlParams.get('year'))
          .year()
      : moment().year()
    const pixelsInitialValue = urlParams.get('pixels')
      ? urlParams
          .get('pixels')
          .split('')
          .map(pixel => parseInt(pixel, 10))
      : []

    this.setDays()
    this.setPixels(pixelsInitialValue)
  },
  mounted() {},
  methods: {
    confirmSetYear(value) {
      // There are no pixels drawn, no questions asked
      if (this.pixels.filter(pixel => !!pixel.value).length <= 1) {
        this.year = value
        return false
      }

      this.$buefy.dialog.confirm({
        message:
          'Changing the year will reset all the current pixels, are you sure?',
        onConfirm: () => {
          this.reset()
          this.year = value
          this.setDays()
          this.setPixels()
          this.updateUrl()
        },
      })
    },
    setDays() {
      const yearNow = moment().year()

      const dateTo =
        this.year === yearNow
          ? moment()
          : moment()
              .set('year', this.year)
              .endOf('year')

      const dateFrom = moment(dateTo)
        .subtract(52, 'weeks')
        .startOf('week')

      const daysOfYear = []
      for (
        let day = moment(dateFrom);
        day.isSameOrBefore(dateTo);
        day = moment(day).add(1, 'day')
      ) {
        daysOfYear.push(day)
      }

      this.days = daysOfYear
    },
    setPixels(values = []) {
      this.pixels = this.days.map((date, index) => {
        const isLast = index === this.days.length - 1
        const value = values[index] || 0

        return {
          date,
          dateStr: date.format('MMM D, YYYY'),
          index,
          value: isLast ? 4 : value,
          isEditable: !isLast,
        }
      })
    },
    selectColor(value) {
      this.selectedColor = value
    },
    startDrawing() {
      this.captureState()
      this.isDrawing = true
    },
    stopDrowing() {
      this.isDrawing = false
      this.updateUrl()
    },
    fill(pixel) {
      if (!pixel.isEditable || pixel.value === this.selectedColor) {
        return false
      }

      pixel.value = this.selectedColor
      this.pixels = [...this.pixels]
    },
    captureState() {
      if (this.isDrawing) {
        return false
      }

      const pixelsState = this.pixels.map(pixel => ({ ...pixel }))

      this.pixelsHistory.push(pixelsState)

      // Store max 50 snapshots
      if (this.pixelsHistory.length > 50) {
        this.pixelsHistory.unshift()
      }
    },
    undo() {
      if (!this.pixelsHistory) {
        return false
      }

      this.pixels = this.pixelsHistory.pop()
      this.updateUrl()
    },
    updateUrl() {
      const yearStr = `year=${this.year}`
      const pixelsStr =
        this.pixels.filter(pixel => !!pixel.value).length > 1
          ? `&pixels=${this.pixels.map(pixel => pixel.value).join('')}`
          : ''

      const updatedUrl = `${window.location.origin}?${yearStr}${pixelsStr}`

      window.history.replaceState({}, '', updatedUrl)
    },
    share() {
      const dummy = document.createElement('input')
      const url = window.location.href

      document.body.appendChild(dummy)
      dummy.value = url
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)

      this.$buefy.toast.open({
        message: 'You pixels URL is copied to clipboard!',
        type: 'is-success',
      })
    },
    confirmReset() {
      this.$buefy.dialog.confirm({
        message: 'Reset the pixels?',
        onConfirm: () => this.reset(),
      })
    },
    reset() {
      this.pixelsHistory = []
      this.setPixels()
      this.updateUrl()
    },
    generate() {
      this.$buefy.toast.open({
        message: 'Exporting feature is still in progress, come back later :(',
        type: 'is-warning',
      })
    },
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  padding-bottom: 200px;
  position: relative;
}

.app-container {
  max-width: 1050px;
}

.form-container {
  user-select: none;
  padding: 3rem;
  border: 2px dashed rgb(230, 230, 230);
}

.control-container {
  margin-bottom: 1em;
}

.control-label {
  white-space: nowrap;
  width: 100px;
  text-align: left;
}

.colors-container {
  display: inline-flex;
  flex-direction: row;
  vertical-align: bottom;

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
  margin-bottom: 2rem;
}

.pixel {
  border: 1.5px solid #fff;
  background: rgb(235, 237, 240);
  position: relative;

  &.-selected {
    border-color: rgba(0, 0, 0, 0.5);
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
    content: ' ';
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
