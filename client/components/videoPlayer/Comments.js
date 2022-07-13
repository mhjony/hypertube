import React, { useState } from 'react'

// import useInternalNotes from 'swrs/business/useInternalNotes'

import Button from '../Button'
import Textarea from '../Textarea'

const Comment = ({ note, onClick = null }) => (
  <div
    className={`px-3 py-1 bg-gray-400 rounded mr-1 mb-1 flex justify-between items-center text-black ${
      onClick ? 'cursor-pointer' : ''
    }`}
    onClick={onClick || (() => {})}
  >
    <div>
      <div className="text-sm text-gray-800">{note.note}</div>
      <div className="text-xs text-gray-600">{note.updatedAt}</div>
    </div>
  </div>
)

const Comments = ({ id }) => {
  const [loading, setLoading] = useState(false)
  const [newNotes, setNewNotes] = useState('')

  //   const { notes, createNote, removeNote } = useInternalNotes(session, id)

  const notes = [
    {
      id: 1,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 2,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 1,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 2,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 1,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 2,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 1,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 2,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 1,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    },
    {
      id: 2,
      note: 'This is a comment',
      updatedAt: '12 July 2022'
    }
  ]

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const res = await createNote(newNotes, id)
      if (!res.error) {
        setNewNotes('')
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
        {notes.length > 0 ? (
          <div className="mx-8">
            {notes.map(note => (
              <Comment key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-gray-700 text-center text-sm">No notes yet!</div>
        )}
      </div>
      <div className="mx-8">
        <h2 className="font-bold text-gray-600 uppercase text-xs mb-1">Add a new comments</h2>

        <Textarea
          value={newNotes}
          onChange={setNewNotes}
          placeholder="White your comment here..."
          name="autofollow"
          rows={2}
        />
      </div>

      <Button loading={loading} onClick={handleSubmit} className="w-full" size="sm">
        Save
      </Button>
    </div>
  )
}

export default Comments
