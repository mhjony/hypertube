import React, { useState, useEffect } from 'react'

import Button from '../Button'
import Textarea from '../Textarea'
import api from '../../services/backend/movies'

const Comment = ({ comment, onClick = null }) => (
  <div
    className={`px-3 py-1 bg-gray-400 rounded mr-1 mb-1 flex justify-between items-center text-black ${
      onClick ? 'cursor-pointer' : ''
    }`}
    onClick={onClick || (() => {})}
  >
    <div>
      <div className="text-sm text-gray-800">{comment.comment_body}</div>
      <div className="text-xs text-gray-600">{comment.updatedAt}</div>
    </div>
  </div>
)

const Comments = ({ session }) => {
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])

  const imdb_code = '234324'
  const user_id = 'b3e6c2dc-8d21-4f9c-9149-d89d2495afe8'

  const getMovieComments = async (session, imdb_code) => {
    try {
      const { accessToken } = session

      const res = await api.getMovieComments(accessToken, imdb_code)

      if (res?.error) {
        throw new Error(res.error)
      } else {
        setComments(res)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getMovieComments(session, imdb_code)
  }, [session])

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const res = await api.addComment(session.accessToken, imdb_code, user_id, newComment)
      if (!res.error) {
        setNewComment('')
      }

      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-gay-800 m-8">
      <div className="border-b border-solid border-gray-300 mb-1 pb-1">
        <h2 className="font-bold text-gray-600 uppercase text-md mb-1">Movie Comments</h2>
      </div>
      <div className="border-b border-solid border-gray-300 mb-2 pt-2 pb-2">
        {comments.length > 0 ? (
          <div className="mx-8">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-gray-700 text-center text-sm">No comments yet!</div>
        )}
      </div>
      <div className="mx-8">
        <h2 className="font-bold text-gray-600 uppercase text-xs mb-1">Add a new comments</h2>

        <Textarea
          value={newComment}
          onChange={setNewComment}
          placeholder="White your comment here..."
          name="autofollow"
          rows={2}
        />
      </div>

      <Button loading={loading} onClick={handleSubmit} className="bg-red-400">
        Save
      </Button>
    </div>
  )
}

export default Comments
