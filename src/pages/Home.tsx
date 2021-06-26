import { useHistory  } from 'react-router-dom';


import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoImgDark from '../assets/images/logo-dark.svg';
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useToasts } from 'react-toast-notifications';




export function Home(){
   const history = useHistory();
   const [roomCode, setRoomCode] = useState('')
   const {user, signInWithGoogle} = useAuth();
   const {addToast} = useToasts();


   async function handleCreateRoom(){

    if(!user){
        await signInWithGoogle();
    }

        history.push('/rooms/new');
   
   }

   async function handleJoinRoom(event: FormEvent){
       event?.preventDefault();

       if(roomCode.trim() === ''){
        addToast('Favor preencher o código da sala!', { appearance: 'warning' });
           return;
       }

       const roomRef = await database.ref('rooms/'+roomCode).get();

       if(!roomRef.exists()){
        addToast('Sala inexistente!', { appearance: 'error' });
           return;
       }

       if(roomRef.val().endedAt){
        addToast('Essa sala já foi encerrada!', { appearance: 'warning' });
           return;
       }

       history.push('/rooms/'+roomCode)


   }


    return (
        <div id="page-auth"> 
            <aside>
              <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
              <strong> Crie salas de Q&amp;A ao-vivo</strong>
              <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img className="normal-logo" src={logoImg} alt="Letmeask" />
                    <img className="dark-logo" src={logoImgDark} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                      <img src={googleIconImg} alt="Logo do Google" />
                      Crie sua sala com o Google   
                   </button>
                   <div className="separator"> ou entre em uma sala </div>
                   <form onSubmit={handleJoinRoom}>
                       <input
                       type="text"
                       placeholder= "Digite o código da sala" 
                       onChange={event => setRoomCode(event.target.value)}
                       value={roomCode}
                       />
                       <Button type="submit">
                           Entrar na sala
                       </Button>
                   </form>
                </div>
            </main>
        </div>
    )
}