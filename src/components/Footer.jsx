import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <h3>Escreva sobre o que você tem interesse no mundo mobile!</h3>
        <p>IF Mobile &copy; 2024</p>
        <div className={styles.image_container}>
          <img className={styles.img_pet} src="https://drive.google.com/uc?export=view&id=1ZLrmnX5HWgMGfj0yLcRLZfW3WCf4-QSN" alt="Apoio Programa de Educação Tutorial" />
          <img className={styles.img_if} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Logotipo_IFET.svg/1529px-Logotipo_IFET.svg.png" alt="Logo IF"/>
        </div>
    </footer>
  )
}

export default Footer
