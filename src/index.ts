import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { fromFile, toFile, SketchFile } from '@sketch-hq/sketch-file'
import { resolve } from 'path'
// import { v4 as uuid } from 'uuid'
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
      console.log(`Updating ${swatch.name}`)

      const currentColorValue = rgbaToHex(
        swatch.value.red,
        swatch.value.green,
        swatch.value.blue,
        swatch.value.alpha
      )
      console.log(`Current color: ${currentColorValue}`)

      const colorValue = hexToRGBA(sourceColors[index][1])
      console.log(`New color: ${colorValue}`)

      swatch.name = sourceColors[index][0]
      swatch.value.red = colorValue[0] / 255
      swatch.value.green = colorValue[1] / 255
      swatch.value.blue = colorValue[2] / 255
      swatch.value.alpha = colorValue[3]
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

// TODO: use `hex-rgb` and `rgb-hex`

const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)

const getChunksFromString = (st, chunkSize) =>
  st.match(new RegExp(`.{${chunkSize}}`, 'g'))

const convertHexUnitTo256 = hexStr =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16)

const getAlphafloat = (a, alpha) => {
  if (typeof a !== 'undefined') {
    return a / 255
  }
  if (typeof alpha != 'number' || alpha < 0 || alpha > 1) {
    return 1
  }
  return alpha
}

const hexToRGBA = (hex: string, alpha?: FileFormat.UnitInterval) => {
  if (!isValidHex(hex)) {
    throw new Error('Invalid HEX')
  }
  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
  return [r, g, b, getAlphafloat(a, alpha)]
}

// Utility function to convert RGBA colors, as stored in the
// Sketch file format, into Hex colors usable by Storybook.
function rgbaToHex(
  r: FileFormat.UnitInterval,
  g: FileFormat.UnitInterval,
  b: FileFormat.UnitInterval,
  a: FileFormat.UnitInterval
) {
  const red: string = Math.round(r * 255)
    .toString(16)
    .padStart(2, '0')
  const green: string = Math.round(g * 255)
    .toString(16)
    .padStart(2, '0')
  const blue: string = Math.round(b * 255)
    .toString(16)
    .padStart(2, '0')
  const alpha: string = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${red}${green}${blue}${alpha == 'ff' ? '' : alpha}`
}
