import React from 'react'

const CommentCard = ({ comment }) => {
  return (
    <div className="px-3 py-1 bg-gray-200 rounded mr-1 mb-1  justify-between items-center text-black">
      <div className="text-sm text-gray-800">{comment.text}</div>
      <div className="text-xs text-gray-600">{comment.date}</div>
    </div>
  )
}

const Comments = () => {
  // TODO: We will show the comments here

  const comments = [
    { text: 'This is a comment', date: '12 July 2022' },
    { text: 'This is a comment', date: '12 July 2022' },
    { text: 'This is a comment', date: '12 July 2022' },
    { text: 'This is a comment', date: '12 July 2022' }
  ]
  return (
    <>
      {comments &&
        comments.map(comment => (
          <div className="">
            <CommentCard comment={comment} />
          </div>
        ))}
    </>
  )
}

export default Comments
