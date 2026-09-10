const paths = {
  'arrow-up-right': <><path d="M5 15 15 5" /><path d="M8 5h7v7" /></>,
  'arrow-left': <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 17h16" /></>,
  minus: <path d="M5 12h14" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
}

export default function Icon({ name, size = 18 }) {
  return <svg className={`icon icon--${name}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>
}

export function ArrowUpRightIcon() {
  return <Icon name="arrow-up-right" size={16} />
}
