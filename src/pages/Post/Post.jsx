import styles from "./Post.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, Link } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import Comment from '../../components/Comment';

const Post = () => {
    const { id } = useParams();
    const { document: post, loading, error } = useFetchDocument("posts", id);

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
                        {post.tagsArray.map((tag) => (
                            <p key={tag}>
                                <span>#</span>{tag}
                            </p>
                        ))}
                    </div>
                    <Link to="/" className="btn btn-dark"><IoIosArrowBack size="1em"/> Voltar</Link> 
                </>
            )}
        </div>
    );
    
}

export default Post;