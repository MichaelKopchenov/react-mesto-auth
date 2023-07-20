import successIcon from '../images/success.svg';
import failureIcon from '../images/failure.svg';
import "./styles/InfoToolTip.css";

function InfoToolTip({ isOpen, onClose, registeredIn, titleOfRegisterPopup }) {
  return (
    <div className={`popup ${ isOpen ? 'popup_opened' : '' } `}>
      <div className="popup-info">
      <button 
        type="button" 
        className="popup__close-btn" 
        onClick={ onClose }
      />
        <img 
          className='popup__icon' 
          src={ 
            registeredIn 
            ? successIcon 
            : failureIcon 
          } 
          alt="Иконка" 
        />
        <h3>{ titleOfRegisterPopup }</h3>
      </div>
    </div>
  )
}

export default InfoToolTip;