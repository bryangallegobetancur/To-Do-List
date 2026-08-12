import { CheckIcon } from './icons'

export default function Brand({ className = '' }) {
  return (
    <span className={`brand ${className}`}>
      <span className="brand__mark" aria-hidden="true">
        <CheckIcon />
      </span>
      To Do List
    </span>
  )
}
