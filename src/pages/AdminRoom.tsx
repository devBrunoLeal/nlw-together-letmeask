import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import logoImgDark from '../assets/images/logo-dark.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useToasts } from 'react-toast-notifications';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {addToast} = useToasts();
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove().then(res =>{
        addToast('Pergunta excluida com sucesso!',{ appearance: 'success'})
      });
    }
  }


  async function handleCheckQuestionAsAnswered(questionId: string) {
   
    const room = await database.ref(`rooms/${roomId}/questions/${questionId}`);
    let isAnswered;
    
    room.on('value',res=> {isAnswered = res.val().isAnswered;})

    if(isAnswered){
      room.update({
         isAnswered: false,
      }).then(res =>{
        addToast('Você retirou o status dessa pergunta como respondido!',{ appearance: 'warning'})
      })
    }else{
      room.update({
         isAnswered: true,
      }).then(res =>{
        addToast('Você alterou o status dessa pergunta como respondida!',{ appearance: 'success'})
      })
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    const room = await database.ref(`rooms/${roomId}/questions/${questionId}`);
    let isHighlighted;
    
    room.on('value',res=> {isHighlighted = res.val().isHighlighted;})

    if(isHighlighted){
      room.update({
        isHighlighted: false,
      }).then(res =>{
        addToast('Destaque retirado com sucesso!',{ appearance: 'success'})
      })
    }else{
      room.update({
        isHighlighted: true,
      }).then(res =>{
        addToast('Pergunta destacada com sucesso!',{ appearance: 'success'})
      })
    }
  }

  function handleRedirectHome(){
    history.push('/')
  }

  return (
    <div id="page-room">
      <header style={{position:'relative'}}>
        <div className="content">
        <img style={{cursor:'pointer'}} onClick={handleRedirectHome} className="normal-logo" src={logoImg} alt="Letmeask" />
        <img style={{cursor:'pointer'}} onClick={handleRedirectHome} className="dark-logo" src={logoImgDark} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>

        <Button onClick={() => {history.push('/rooms/'+roomId)}} className="button arrow-back" >←</Button>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                    
                  </>
                )}
                {question.isAnswered && (
                  <>
                    <button
                      style={{fontSize: '11px', color:'#FFF6'}}
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    > Remover como respondida
                    </button>
                    
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}