import React, { useState } from 'react';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../hooks/useInsertDocument';
import styles from './Comment.module.css';

const Comment = ({ postId }) => {
    const { user } = useAuthValue();
    const [commentText, setCommentText] = useState('');
    const { insertDocument, response } = useInsertDocument('comments');

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            // Implementar lógica de tratamento para usuário não autenticado
            return;
        }

        if (!commentText.trim()) {
            // Implementar lógica de tratamento para comentário vazio
            return;
        }

        try {
            await insertDocument({
                postId,
                userId: user.uid,
                username: user.displayName,
                commentText,
                createdAt: new Date()
            });
            setCommentText('');
        } catch (error) {
            // Tratar erro ao inserir comentário
        }
    };

    return (
        <div className={styles.commentContainer}>
            <h3>Comentários</h3>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    className={styles.commentInput}
                    placeholder="Digite seu comentário..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <button type="submit" className={styles.commentButton} disabled={!user}>Comentar</button>
            </form>
            {response.loading && <p>Enviando comentário...</p>}
            {response.error && <p>Erro ao enviar comentário: {response.error}</p>}
        </div>
    );
};

export default Comment;