import { ChangeEvent, FormEvent, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import Avatar from "../Avatar";
import Comment from "../Comment";

import styles from "./Post.module.css";

interface Author {
  avatar: string;
  name: string;
  role: string;
}

interface Content {
  type: "paragraph" | "link";
  content: string;
}

interface PostProps {
  id: number;
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content}: PostProps) {

  const [comments, setComments] = useState([
    {
      id: 0,
      author: {
        avatar: "https://github.com/luhsales1.png",
        name: "Luciana Sales"
      },
      publishedAt: new Date("2023-02-12 19:45:44"),
      content: "Muito bom Nathallye, parabéns!! 👏👏"
    },
    {
      id: 1,
      author: {
        avatar: "https://github.com/souzabel.png",
        name: "Isabel Souza"
      },
      publishedAt: new Date("2023-02-11 19:45:44"),
      content: "Parabéns!! 👏👏"
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  });

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    const publishedAt = Date.now();

    setComments([...comments, {
      id: comments.length + 1,
      author: {
        avatar: "https://github.com/nathallye.png",
        name: "Nathallye Bacelar"
      },
      publishedAt: new Date(publishedAt),
      content: newCommentText
    }])

    setNewCommentText("");
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNewCommentText(event.target.value);
  }

  function deleteComment(idCommentToDelete: number) {
    const commentsWithoutDeletedOne = comments.filter((comment) => {
      return comment.id !== idCommentToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatar} />

          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>

      </header>

      <div className={styles.content}>
        {
          content.map((line) => {
            if (line.type === "paragraph") {
              return <p key={line.content}>{line.content}</p>
            } else if (line.type === "link") {
              return <p key={line.content}><a href="#">{line.content}</a></p>
            }
          })
        }
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu faeedback</strong>

        <textarea
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChange}
          required
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {
          comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                id={comment.id}
                author={comment.author}
                publishedAt={comment.publishedAt}
                content={comment.content}
                onDeleteComment={deleteComment}
              />
            )
          })
        }
      </div>
    </article>
  )
}
