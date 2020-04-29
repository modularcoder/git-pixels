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
  const { name = 'git-pixels' } = argv

  // Contributions
  const contributions = getContributions(argv)

  // Setup dir
  log(info('Creating directory...'))
  const pathDir = path.resolve(`./${name}/`)
  const pathFile = path.resolve(pathDir, 'README.md')
  const baseMessage =
    'Created by using [git-pixels](https://github.com/modularcoder/git-pixels)'
  const dateFormat = 'MMM DD YYYY'

  try {
    fs.mkdirSync(pathDir)
    fs.writeFileSync(pathFile, baseMessage)
  } catch (e) {
    log(error(`! Error: Couldn't create a direcotry, ${e.message}`))

    process.exit(1)
  }

  // Setup Repo
  log(info('Initializing git repozitory...'))

  const simpleGit = SimpleGit(pathDir)

  try {
    await simpleGit.init(false)
  } catch (e) {
    log(error(`! Error: , ${e.message}`))
    process.exit(1)
  }

  // Make the commits for each contribution
  try {
    await contributions.reduce(async (prevItem, { date, count }) => {
      await prevItem

      await makeContributions({ date, count })
    }, Promise.resolve())
  } catch (e) {
    log(error(`! Error: , ${e.message}`))
    process.exit(1)
  }

  async function makeContributions({ date, count }) {
    const dateFormatted = date.format(dateFormat)

    if (count === 0) {
      log(info(`${dateFormatted} - No contributions`))
      return false
    }

    await [...Array(count)]
      .map((x, index) => index)
      .reduce(async (prevCommit, commitNumber) => {
        await prevCommit

        fs.writeFileSync(
          pathFile,
          `${baseMessage} | ${dateFormatted} | ${commitNumber}`,
        )
        await simpleGit.add('./*')
        await simpleGit.commit(
          `git-pixels: ${dateFormatted} | ${commitNumber}`,
          null,
          {
            '--date': date.format(),
          },
        )
      }, Promise.resolve())

    log(info(`${dateFormatted} - Committed ${count} contributions `))
  }

  process.exit(0)
}

function getContributions(argv) {
  const { year, pixels, amplify = 25 } = argv

  const yearNow = moment().year()

  const dateTo =
    year === yearNow
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
    const count = pixelsArray[index] || 0

    return {
      date,
      index,
      count: count * amplify,
    }
  })

  return contributions
}
