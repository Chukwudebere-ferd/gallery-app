import './Switch.css'

export interface SwitchOption<T extends string> {
  value: T
  label: string
  icon?: (props: { className?: string }) => React.ReactNode
  hint?: string
}

export interface SwitchProps<T extends string> {
  name: string
  options: SwitchOption<T>[]
  value: T
  onChange: (value: T) => void
}

export default function Switch<T extends string>({
  name,
  options,
  value,
  onChange,
}: SwitchProps<T>) {
  return (
    <div className="switch" role="radiogroup" aria-label={name}>
      {options.map(({ value: optionValue, label, icon: Icon, hint }) => {
        const selected = optionValue === value
        const cls = ['switch__chip', selected ? 'switch__chip--on' : '']
          .filter(Boolean)
          .join(' ')
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cls}
            onClick={() => onChange(optionValue)}
          >
            {Icon ? <Icon /> : null}
            <span className="switch__label">{label}</span>
            {hint && <span className="switch__hint">{hint}</span>}
          </button>
        )
      })}
    </div>
  )
}