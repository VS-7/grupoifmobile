import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useAuthentication } from '../../hooks/useAuthentication';
import { db } from '../../firebase/config';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import styles from "./Post.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FiHeart, FiPlusCircle, FiCheck } from "react-icons/fi";

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
            setLiked(post.likes?.some(like => like.uid === userID));
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

    const openLink = (url) => {
        window.open(url, '_blank');
    };


    const fetchUserNames = async (userIds) => {
        const userNames = await Promise.all(userIds.map(async (userId) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            return userDoc.exists() ? userDoc.data().displayName : "Usuário";
        }));
        return userNames;
    };

    const handleLike = async () => {
        const userDisplayName = auth.currentUser.displayName; // Obter o displayName do usuário atual
        const likeObject = { uid: userID, displayName: userDisplayName };
    
        const postRef = doc(db, "posts", id);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            const currentLikes = postDoc.data().likes || [];
            const isLiked = currentLikes.some(like => like.uid === userID);
    
            if (isLiked) {
                // Remover o like
                const updatedLikes = currentLikes.filter(like => like.uid !== userID);
                await updateDoc(postRef, { likes: updatedLikes });
                setLikes(updatedLikes);
            } else {
                // Adicionar o like
                const updatedLikes = [...currentLikes, likeObject];
                await updateDoc(postRef, { likes: updatedLikes });
                setLikes(updatedLikes);
            }
            setLiked(!liked);
        }
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
                            {likes.length > 1
                                ? `Curtido por ${likes[likes.length - 1].displayName} e outras ${likes.length - 1} pessoas`
                                : `Curtido por ${likes[0].displayName}`}
                        </div>
                    )}

                    {showLikesModal && (
                        <div className={styles.likesModal} onClick={handleShowLikesModal}>
                            <div className={styles.modalContent} onClick={e => e.stopPropagation()}> {/* Impede que o clique no conteúdo feche o modal */}
                                <span className={styles.closeModal} onClick={handleShowLikesModal}>&times;</span>
                                <p><strong>Curtidas</strong></p>
                                {likes.map((like, index) => (
                                    <div key={index}>{like.displayName}</div> // Aqui estamos assumindo que 'likes' agora é um array de objetos com 'uid' e 'displayName'
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
                    <button type="submit" className={styles.btnAcess}><FiCheck /></button>
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
