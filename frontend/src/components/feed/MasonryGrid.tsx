import type { MediaItem } from '../../services/mockData'
import PhotoCard from './PhotoCard'
import './MasonryGrid.css'

export interface MasonryGridProps {
  items: MediaItem[]
}

export default function MasonryGrid({ items }: MasonryGridProps) {
  return (
    <div className="masonry">
      {items.map((item, i) => (
        <PhotoCard key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}