#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const chalk = require('chalk')
const moment = require('moment')
const SimpleGit = require('simple-git/promise')

// console.log(path.resolve(`./${argv.name || 'git-pixels'}/`))

const log = console.log
const error = chalk.bold.red
// const warning = chalk.keyword('orange')
const info = chalk.blue

if (!argv.year || !argv.pixels) {
  log(error('! Please specify the year and pixels parameters'))
  log(info('Example: --year=2015 --pixels=123'))
  process.exit(1)
}

create(argv)

async function create(argv) {
  const { year, pixels, amplify = 80, name = 'git-pixels' } = argv

  const yearNow = moment().year()

  const dateTo =
    this.year === yearNow
      ? moment()
      : moment()
          .set('year', year)
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

  const days = daysOfYear
  const pixelsArray = pixels.split('')

  const contributions = days.map((date, index) => {
    const value = pixelsArray[index] || 0

    return {
      date,
      index,
      value: value * amplify,
    }
  })

  log(info('Creating directory...'))

  const dir = path.resolve(`./${name}/`)

  try {
    fs.mkdirSync(dir)
    fs.writeFileSync(path.resolve(dir, 'README.md'), '')
  } catch (e) {
    log(error(`! Error: Couldn't create a direcotry, ${e.message}`))

    process.exit(1)
  }

  log(info('Initializing git repozitory...'))
  // log(info(JSON.stringify(contributions, null, 2)))

  const simpleGit = SimpleGit(dir)

  await simpleGit.init(false)
  await simpleGit.add('.')
  await simpleGit.commit('Msg', 'README.md', {
    '--date': contributions[0].date.format(),
  })

  // Created by using [git-pixels](https://github.com/modularcoder/git-pixels)

  process.exit(0)
}
