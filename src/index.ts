import { fromFile, toFile, SketchFile } from '@sketch-hq/sketch-file'
import { resolve } from 'path'
import hexRgb from 'hex-rgb'

import sourceColors from '../colors.json'

const sketchDocumentPath = '../color-library.sketch'

fromFile(resolve(__dirname, sketchDocumentPath)).then(
  (parsedFile: SketchFile) => {
    const document = parsedFile.contents.document
    if (!document.sharedSwatches) return

    const targetColors = document.sharedSwatches.objects

    Object.keys(sourceColors).forEach(colorName => {
      const colorValue = hexRgb(sourceColors[colorName])
      const swatch = targetColors.find(color => color.name === colorName)
      if (!swatch) return

      swatch.name = colorName
      swatch.value.red = colorValue.red / 255
      swatch.value.green = colorValue.green / 255
      swatch.value.blue = colorValue.blue / 255
      swatch.value.alpha = colorValue.alpha
    })
    parsedFile.contents.document.sharedSwatches.objects = targetColors
    const exportableFile: SketchFile = {
      contents: parsedFile.contents,
      filepath: resolve(__dirname, sketchDocumentPath),
    }
    toFile(exportableFile).then(() => {
      console.log(
        `✅ Color Library saved succesfully. ${targetColors.length} colors updated.`
      )
    })
  }
)
