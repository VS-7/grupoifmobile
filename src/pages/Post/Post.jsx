import styles from "./Post.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, Link } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import Comment from '../../components/Comment';

const Post = () => {
    const { id } = useParams();
    const { document: post, loading, error } = useFetchDocument("posts", id);

    // Função para abrir link
    const openLink = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className={styles.post_container}>
            {loading && <p>Carregando publicação...</p>}
            {error && <p>{error}</p>}
            {post && (
                <>
                    <h1>{post.title}</h1>
                    <img src={post.image} alt={post.title} />
                    <h3>Esta publicação fala sobre</h3>
                    <p className={styles.p_body}>{post.body}</p>
                    <div className={styles.tags}>
                        {post.tagsArray && post.tagsArray.map((tag) => (
                            <p key={tag}><span>#</span>{tag}</p>
                        ))}
                    </div>
                    {/* Adicionar seção para links se existirem */}
                    {post.linksArray && post.linksArray.length > 0 && (
                        <div className={styles.links}>
                            <h3>Links úteis</h3>
                            {post.linksArray.map((link, index) => (
                                <button key={index} onClick={() => openLink(link)} className="btn btn-light">Link {index + 1}</button>
                            ))}
                        </div>
                    )}
                    <Link to="/" className="btn btn-dark"><IoIosArrowBack size="1em"/> Voltar</Link>
                </>
            )}
        </div>
    );
}

export default Post;