import React, { useState, useEffect } from 'react'

import Button from '../Button'
import Textarea from '../Textarea'
import api from '../../services/backend/movies'
import ProfileModal from '../ProfileCardModal'

const Comment = ({ comment, onClick = null }) => {
  return (
    <div
      className={`px-3 py-1 bg-gray-400 rounded mr-1 mb-1 flex justify-between items-center text-black ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick || (() => {})}
    >
      <div className="flex border-l-2 border-gray-300 border-solid">
        <ProfileModal comment={comment} />

        <div>
          <div className="pt-2 mt-4 text-sm text-gray-800">{comment.comment_body}</div>
          <div className="text-xs text-gray-600">{comment.created_at}</div>
        </div>
      </div>
    </div>
  )
}

const Comments = ({ session, user_id, imdb_code }) => {
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])

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
