import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faAngleUp,
  faShare,
  faShareSquare,
  faShareAlt,
  faShareAltSquare,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'

const iconsSolid = [
  faAngleDown,
  faAngleUp,
  faShare,
  faShareSquare,
  faShareAltSquare,
  faShareAlt,
  faDownload,
]

const iconsRegular = []

const icons = [...iconsSolid, ...iconsRegular]

library.add(icons)

export { FontAwesomeIcon as BaseIcon, icons, iconsSolid, iconsRegular }
export default FontAwesomeIcon
