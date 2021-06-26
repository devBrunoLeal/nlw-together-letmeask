import { useState } from 'react';
import './styles.scss';

export function DarkButton() {
    const [dark, setDark] = useState(true);


    function handleDarkMode(){
        dark? setDark(false):setDark(true)

        if(dark){
            window.document.querySelector('body')?.classList.remove('dark-body')
        }else{
            window.document.querySelector('body')?.classList.add('dark-body')
        }
      
    }
  return (
    <div onClick={handleDarkMode} className={dark? 'tdnn':'tdnn day'}>
    <div className={dark? 'moon':'moon sun'}>
   </div>
</div>
  );
}