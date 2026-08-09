import './ChipRow.css'

export interface ChipRowProps {
  chips: string[]
  active: string
  onSelect: (chip: string) => void
}

export default function ChipRow({ chips, active, onSelect }: ChipRowProps) {
  return (
    <div className="chips" role="tablist" aria-label="Filter by topic">
      {chips.map((chip) => {
        const isActive = chip === active
        return (
          <button
            key={chip}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? 'chips__pill chips__pill--active' : 'chips__pill'}
            onClick={() => onSelect(chip)}
          >
            {chip}
          </button>
        )
      })}
    </div>
  )
}