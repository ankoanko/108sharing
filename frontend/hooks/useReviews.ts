import * as React from 'react'
import { IReview } from 'core/interfaces'

export const useReviews = (props: { initialReviews: IReview[] }) => {
  const [reviews, setReviews] = React.useState([...(props.initialReviews || [])])
  const updateReviews = updatedReview => {
    const nextReviews = reviews.map(review => {
      if (review.id === updatedReview.id) {
        return { ...updatedReview }
      } else {
        return { ...review }
      }
    })

    setReviews(nextReviews)
  }
  return {
    reviews,
    updateReviews,
  }
}
