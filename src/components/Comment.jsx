import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";

export default function Comment({ id }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentlyLoggedinUser] = useAuthState(auth);
  const commentRef = doc(db, "Articles", id);

  useEffect(() => {
    const docRef = doc(db, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      setComments(snapshot.data().comments);
    });
  }, []);

  const handleChangeComment = (e) => {
    if (e.key === "Enter") {
      updateDoc(commentRef, {
        comments: arrayUnion({
          user: currentlyLoggedinUser.uid,
          userName: currentlyLoggedinUser.displayName,
          comment: comment,
          createdAt: new Date(),
          commentId: uuidv4(),
        }),
      }).then(() => {
        setComment("");
      });
    }
  };

  // delete comment function
  const handleDeleteComment = (commentId) => {
    updateDoc(commentRef, {
      comments: arrayRemove(comments.find(c => c.commentId === commentId)),
    })
      .then(() => {
        console.log("Comment deleted successfully");
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return (
    <div>
      Comentarios
      <div className="container">
        {comments !== null &&
          comments.map(({ commentId, user, comment, userName, createdAt }) => (
            <div key={commentId}>
              <div className="border p-2 mt-2 row">
                <div className="col-11">
                  <span
                    className={`badge ${user === currentlyLoggedinUser.uid
                      ? "bg-success"
                      : "bg-primary"
                      }`}
                  >
                    {userName}
                  </span>
                  {comment}
                </div>
                <div className="col-1">
                  {user === currentlyLoggedinUser.uid && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteComment(commentId)}
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        {currentlyLoggedinUser && (
          <input
            type="text"
            className="form-control mt-4 mb-5"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Añade un comentario"
            onKeyUp={(e) => {
              handleChangeComment(e);
            }}
          />
        )}
      </div>
    </div>
  );
}
