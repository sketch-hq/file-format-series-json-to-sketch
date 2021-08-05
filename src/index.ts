import { fromFile, toFile, SketchFile } from '@sketch-hq/sketch-file'
import { resolve } from 'path'
import hexRgb from 'hex-rgb'

import colors from '../colors.json'

const sketchDocumentPath = '../color-library.sketch'

fromFile(resolve(__dirname, sketchDocumentPath)).then(
  (parsedFile: SketchFile) => {
    const document = parsedFile.contents.document
    if (!document.sharedSwatches) return

    const sourceColors = Object.entries(colors).sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { numeric: true })
    )

    const targetColors = document.sharedSwatches.objects.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    )

    if (sourceColors.length !== targetColors.length) return

    targetColors.forEach((swatch, index) => {
      const colorName = sourceColors[index][0]
      const colorValue = hexRgb(sourceColors[index][1])

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
