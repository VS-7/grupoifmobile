//CSS
import { Link } from "react-router-dom";
import styles  from "./About.module.css"



const About = () => {
  return (
    <form className={styles.about}>
        <h2>Sobre o IF <span>Mobile</span></h2>
        <div className={styles.about_container}>
        <div className={styles.about_text}>
            <p>Somos um grupo de entusiastas desbravando o mundo do desenvolvimento mobile.</p>
            <p>O objetivo é proporcionar um ambiente colaborativo e enriquecedor para estudantes interessados em aprender e aprimorar suas habilidades no universo do desenvolvimento de aplicativos móveis.</p>
            <p>Aqui, a ideia é compartilharmos conhecimento, explorarmos tecnologias inovadoras e criarmos projetos. Juntos, vamos desbravar o mundo mobile e criar soluções inovadoras para as demandas do mercado atual.</p>
        
          <p>Fique à vontade para explorar nosso conteúdo, participar de nossas atividades e fazer parte desta comunidade.</p>
          <p>Seja bem-vindo e junte-se a nós nessa jornada!</p>
          <p>Apoio PET Conexões Ciência da Computação</p>
          <img src="../../../public/pet.png" alt="pet" className={styles.img}/>
          <p>Equipe do Grupo de Estudo de Desenvolvimento Mobile - IF Sudeste MG</p>
        </div>
    </div> 
        <p>Venha compartilhar seus conhecimentos!</p>
        <Link to="/posts/create" className="btn">
            Nova publicação
        </Link>
    </form>
  )
}

export default About;
