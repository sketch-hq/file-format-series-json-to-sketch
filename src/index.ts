import FileFormat from '@sketch-hq/sketch-file-format-ts'
// import { fromFile, SketchFile } from '@sketch-hq/sketch-file'
// import { resolve } from 'path'
// import * as fs from 'fs'

import { v4 as uuid } from 'uuid'
import colors from '../colors.json'

// Utility function to convert hex strings to RGBA array
const hexToRgb = (hex: string): Array<number> =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16))

// Let's iterate over the color list, and store a reference for each
const colorList: Array<FileFormat.ColorAsset> = []

Object.keys(colors).forEach(key => {
  // Create a new Color object
  const rgbColor = hexToRgb(colors[key])
  const color: FileFormat.Color = {
    _class: 'color',
    alpha: 1,
    red: rgbColor[0],
    blue: rgbColor[1],
    green: rgbColor[2],
  }

  const colorAsset: FileFormat.ColorAsset = {
    _class: 'MSImmutableColorAsset',
    name: key,
    color: color,
    do_objectID: uuid(),
  }
  colorList.push(colorAsset)
})

console.log(colorList)
