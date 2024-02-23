import styles from "./Post.module.css"; // Corrigido o nome da importação do estilo

// hooks
import { useParams, Link } from "react-router-dom"; // Importe o componente Link
import { useFetchDocument } from "../../hooks/useFetchDocument";

const Post = () => {
    const { id } = useParams();
    const { document: post, loading, error } = useFetchDocument("posts", id);

    return (
        <div> {/* Adicionado className para o estilo */}
            {loading && <p>Carregando post...</p>}
            {error && <p>{error}</p>}
            {post && (
                <div className={styles.post_container}>
                    <h1>{post.title}</h1>
                    <img src={post.image} alt={post.title} />
                    <h3>Este post fala sobre:</h3> {/* Corrigido o texto "poste" para "post" */}
                    <p className={styles.p_bory}>{post.body}</p>
                    <div className={styles.tags}> {/* Corrigido o nome da classe de estilo */}
                        {post.tagsArray.map((tag) => (
                            <p key={tag}>
                                <span>#</span>{tag}
                            </p>
                        ))}
                    </div>
                    <Link to="/" className="btn btn-dark">Voltar para Home</Link> 
                </div>
            )}
        </div>
    );
}

export default Post;
