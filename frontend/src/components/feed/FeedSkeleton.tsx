import Skeleton from '../ui/Skeleton'
import './FeedSkeleton.css'

const RATIOS = ['5 / 7', '3 / 2', '7 / 10', '1 / 1', '9 / 5', '2 / 3', '3 / 4', '2 / 3']

export interface FeedSkeletonProps {
  count?: number
}

export default function FeedSkeleton({ count = 8 }: FeedSkeletonProps) {
  return (
    <div
      className="masonry feed-skeleton"
      role="status"
      aria-label="Loading your feed"
    >
      {Array.from({ length: count }, (_, i) => (
        <div className="feed-skeleton__card" key={i}>
          <Skeleton
            className="feed-skeleton__media"
            style={{ aspectRatio: RATIOS[i % RATIOS.length] }}
          />
          <div className="feed-skeleton__meta">
            <Skeleton width="72%" height={13} />
            <div className="feed-skeleton__row">
              <Skeleton circle width={24} height={24} />
              <Skeleton width="42%" height={10} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
