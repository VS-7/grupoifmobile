import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useAuthentication } from '../../hooks/useAuthentication';
import { db } from '../../firebase/config';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import styles from "./Post.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FiHeart, FiPlusCircle } from "react-icons/fi";

const Post = () => {
    const { id } = useParams();
    const { document: post, loading, error } = useFetchDocument("posts", id);
    const { auth } = useAuthentication();
    const userID = auth.currentUser?.uid;

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [userLikes, setUserLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (post) {
            setLiked(post.likes?.includes(userID));
            setLikes(post.likes || []);
            setComments(post.comments || []);
        }
    }, [post, userID]);

    useEffect(() => {
        if (likes.length > 0) {
            fetchUserNames(likes).then(names => {
                setUserLikes(names);
            });
        }
    }, [likes]);

    const fetchUserNames = async (userIds) => {
        const userNames = await Promise.all(userIds.map(async (userId) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            return userDoc.exists() ? userDoc.data().displayName : "Usuário";
        }));
        return userNames;
    };

    const handleLike = async () => {
        const postRef = doc(db, "posts", id);
        if (liked) {
            await updateDoc(postRef, { likes: arrayRemove(userID) });
            setLikes(likes.filter(like => like !== userID));
        } else {
            await updateDoc(postRef, { likes: arrayUnion(userID) });
            setLikes([...likes, userID]);
        }
        setLiked(!liked);
    };

    const handleShowLikesModal = () => setShowLikesModal(!showLikesModal);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const commentToAdd = { uid: userID, displayName: auth.currentUser.displayName, comment: newComment, timestamp: new Date() };
        await updateDoc(doc(db, "posts", id), { comments: arrayUnion(commentToAdd) });
        setComments([...comments, commentToAdd]);
        setNewComment("");
    };

    return (
        <div className={styles.post_container}>
            {loading && <p>Carregando publicação...</p>}
            {error && <p>{error}</p>}
            {post && (
                <>  
                    <Link to="/" className={styles.btnback}><IoIosArrowBack size="1em"/> Voltar</Link>
                    <h3>{post.title}</h3>
                    <img src={post.image} alt={post.title} />
                    <button onClick={handleLike} className={styles.likeButton}>
                        {liked ? <FiHeart className={styles.descurtir}/> : <FiHeart className={styles.curtir}/>}
                    </button>
                    {likes.length > 0 && (
                        <div onClick={handleShowLikesModal} className={styles.likesPreview}>
                            {likes.length > 1 ? `Curtido por ${userLikes[userLikes.length - 1]} e outras ${likes.length - 1} pessoas` : `Curtido por ${userLikes[0]}`}
                        </div>
                    )}

                    {showLikesModal && (
                        <div className={styles.likesModal} onClick={handleShowLikesModal}>
                            <div className={styles.modalContent} onClick={e => e.stopPropagation()}> {/* Impede que o clique no conteúdo feche o modal */}
                                <span className={styles.closeModal} onClick={handleShowLikesModal}>&times;</span>
                                <p>Curtidas</p>
                                {userLikes.map((name, index) => (
                                    <div key={index}>{name}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    <h3>Esta publicação fala sobre</h3>
                    <p className={styles.p_body}>{post.body}</p>    
                    <div className={styles.tags}>
                        {post.tagsArray && post.tagsArray.map((tag) => (
                            <p key={tag}><span>#</span>{tag}</p>
                        ))}
                    </div>
                    {post.linksArray && post.linksArray.length > 0 && (
                        <div className={styles.links}>
                            <h3>Links úteis</h3>
                            {post.linksArray.map((link, index) => (
                                <button key={index} onClick={() => openLink(link)} className={styles.btnAcess}>Acessar  <HiOutlineArrowUpRight size="1em"/></button>
                            ))}
                        </div>
                    )}
                   
                    
                </>
                
            )}
             <div>
                {/* Form for adding a new comment */}
                <form onSubmit={handleAddComment} className={styles.commentForm}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Adicione um comentário..." className={styles.textarea}/>
                    <button type="submit" className={styles.btnAcess}>Comentar</button>
                </form>

                {/* Display comments */}
                {comments.length > 0 && (
                    <div className={styles.commentsSection}>
                        {comments.map((comment, index) => (
                            <div key={index} className={styles.comment}>
                                <strong>{comment.displayName}</strong>: {comment.comment}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
    );
}

export default Post;
