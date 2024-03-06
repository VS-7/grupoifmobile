import React, { useState } from 'react';
import { auth, db, storage } from '../../firebase/config';
import { useAuthValue } from '../../../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfile = () => {
  const { user } = useAuthValue();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(''); // Suponha que vamos buscar isso do Firestore
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let imageUrl = user.photoURL; // Use a existing photoURL if no new image is uploaded
  
      if (image) {
        const imageRef = ref(storage, `profilePictures/${user.uid}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: imageUrl,
      });
  
      // Atualiza ou cria a biografia no Firestore
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        bio: bio,
      }, { merge: true }); // Usar a opção { merge: true } para atualizar ou criar o campo sem sobrescrever outros campos
  
      setLoading(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      setLoading(false);
      alert('Erro ao atualizar o perfil: ', error.message);
    }
  };

  return (
    <div>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <br />
        <label>
          Biografia:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <br />
        <label>
          Foto de Perfil:
          <input type="file" onChange={handleImageChange} />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;