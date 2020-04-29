import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faBars,
  faQuestionCircle,
  faFilter,
  faPlus,
  faMinus,
  faCaretRight,
  faCaretUp,
  faCaretDown,
  faChartBar as fasFaChartBar,
  faArrowUp,
  faArrowLeft,
  faAngleDown,
  faAngleUp,
  faChevronUp,
  faChevronDown,
  faAngleRight,
  faPalette,
  faTimesCircle,
  faExclamationCircle,
  faFileDownload,
  faEllipsisV,
  faEllipsisH,
  faCalendarDay,
} from '@fortawesome/free-solid-svg-icons'

const iconsSolid = [
  faCheck,
  faBars,
  faQuestionCircle,
  faFilter,
  faPlus,
  faMinus,
  faCaretRight,
  faCaretUp,
  faCaretDown,
  fasFaChartBar,
  faArrowUp,
  faArrowLeft,
  faAngleDown,
  faAngleUp,
  faChevronUp,
  faChevronDown,
  faAngleRight,
  faPalette,
  faTimesCircle,
  faExclamationCircle,
  faFileDownload,
  faEllipsisV,
  faEllipsisH,
  faCalendarDay,
]

const iconsRegular = []

const icons = [...iconsSolid, ...iconsRegular]

library.add(icons)

export { FontAwesomeIcon as BaseIcon, icons, iconsSolid, iconsRegular }
export default FontAwesomeIcon
