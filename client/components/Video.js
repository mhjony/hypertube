/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

import LazyloadImage from './LazyloadImage'
import SchemaVideo from './SchemaVideo'

const Video = ({
  data,
  username,
  className = '',
  size = '',
  type = 'internal',
  useSchema = true,
  showTitle = true,
  showUsername = false,
  hideSelectors = false
}) => {
  const { data: session } = useSession()

  const { uploadDate } = data

  let formattedUploadDate = ''
  if (typeof uploadDate === 'string') {
    formattedUploadDate = uploadDate.slice(0, 10)
  }
  if (typeof uploadDate === 'number') {
    formattedUploadDate = new Date(uploadDate).toISOString().slice(0, 10)
  }

  const [showAdditional, setShowAdditional] = useState(false)
  const [humanizedDate, setHumanizedDate] = useState(formattedUploadDate)

  useEffect(() => {
    const humanized = new Date(uploadDate).toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    setHumanizedDate(humanized)
  }, [])

  const usedCover = data.thumbnail

  const onMouse = () => {
    if (hideSelectors) {
      return
    }
    setShowAdditional(true)
  }

  const offMouse = () => {
    if (hideSelectors) {
      return
    }
    setShowAdditional(false)
  }

  const href = data.url

  let videoClass = 'video'
  if (size === 'small') videoClass += ' video--small'
  if (size === 'large') videoClass += ' video--large'

  return (
    <div
      key={data.id}
      className={`${className} relative`}
      onMouseEnter={onMouse}
      onMouseLeave={offMouse}
    >
      {useSchema && (
        <SchemaVideo
          username={username}
          date={formattedUploadDate}
          likes={data.likes}
          comments={data.comments}
          shares={data.shareCount}
          image={usedCover}
          title={data.title}
          internalUrl={internalUrl}
        />
      )}

      <Link href={href} prefetch={false}>
        <div className="video--img">
          <LazyloadImage
            alt={`Video with title '${data.title}'`}
            style={{ height: '100%', objectFit: 'cover', width: '100%' }}
            loading="lazy"
            src={usedCover}
            blurhash={data?.defaultCoverBlurhash}
            tiktokCdn={false}
          />
        </div>
        <div className="video-overlay">
          <div className="video--info">
            <div className="flex items-center mb-1 md:mb-2">
              <div className="video--icon">
                <Image alt="Views icon" src="/img/icon-play.png" height="14" width="10" />
              </div>
              {data.views}
            </div>

            {data.duration && (
              <div className="flex items-center mb-1 md:mb-2">
                <div className="video--icon" />
                {data.duration}
              </div>
            )}
          </div>

          <div className="video--title">
            <div className="video--date">{humanizedDate}</div>
            {showTitle && data.title}
            {<div className="mt-2 font-bold">@trahman</div>}
          </div>
        </div>
      </Link>

      <style jsx>{`
        .video,
        .video--img,
        .video--title,
        .video-overlay {
          border-radius: 4px;
        }
        .video {
          background-color: #000;
          background-size: cover;
          border: 0;
          display: block;
          position: relative;
          min-width: 140px;
          width: 100%;
          height: 450px;
          text-shadow: 0px 0px 12px rgba(0, 0, 0, 1), 0px 0px 12px rgba(0, 0, 0, 1);
          transform: scale3d(1, 1, 1);
          transition: all 0.2s ease-in-out;
          margin-bottom: 20px;
          background-repeat: no-repeat;
          background-position: center;
        }
        .video--img {
          height: 100%;
          left: 0;
          overflow: hidden;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 2;
        }
        .video--img img {
          height: 100%;
        }
        .video.video--small {
          height: 300px;
        }
        .video.video--large {
          height: 650px;
        }
        .video:hover {
          transform: scale3d(0.98, 0.98, 0.98);
        }
        .video-overlay {
          background: rgb(240, 148, 51);
          background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
          position: relative;
          z-index: 4;
          width: 100%;
          height: 100%;
        }
        .video--icon {
          margin-right: 4px;
          text-align: center;
          width: 18px;
        }
        .video--info {
          color: #fff;
          left: 0;
          padding: 10px;
          position: absolute;
          top: 0;
          width: 100%;
          font-weight: 600;
          font-size: 17px;
          line-height: 14px;
          vertical-align: middle;
          color: #fff;
        }
        .video--small .video--info {
          font-size: 14px;
        }
        .video--title {
          background: rgba(0, 0, 0, 0.4);
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0) 100%
          );
          color: #fff;
          bottom: 0;
          font-size: 16px;
          font-weight: 400;
          left: 0;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 10;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding: 15px 10px 10px;
          position: absolute;
          word-break: break-word;
          width: 100%;
        }
        .video--promoted {
          left: -14px;
          position: relative;
          text-shadow: none;
          top: -14px;
        }
        .video--date {
          font-size: 80%;
          margin-bottom: 5px;
        }
        .video--small .video--title {
          font-size: 12px;
        }
        @media (max-width: 767px) {
          .video {
            margin-bottom: 0px;
          }
          .video--small .video--info,
          .video--small .video--title {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}

export default memo(Video)
